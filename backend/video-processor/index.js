const amqp = require("amqplib");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

async function connectToRabbit() {
    while (true) {
        try {
            const connection = await amqp.connect("amqp://rabbitmq");
            console.log(" [*] Подключение к RabbitMQ успешно!");
            return connection;
        } catch (err) {
            console.error(" [!] Не удалось подключиться к RabbitMQ, повтор через 5 секунд...");
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
}

const resolutions = ["480p", "720p", "1080p", "1440p", "2160p"];

const resolutionDimensions = {
    "480p": { width: 854, height: 480 },
    "720p": { width: 1280, height: 720 },
    "1080p": { width: 1920, height: 1080 },
    "1440p": { width: 2560, height: 1440 },
    "2160p": { width: 3840, height: 2160 }
};

function convertVideo(inputPath, resolution) {
    return new Promise((resolve, reject) => {
        const baseFolder = path.dirname(inputPath);
        const videoFolderName = path.parse(inputPath).name; // Название папки по имени видео
        const videoFolder = path.join(baseFolder, videoFolderName);
        if (!fs.existsSync(videoFolder)) {
            fs.mkdirSync(videoFolder, { recursive: true });
        }

        const outputFile = path.join(videoFolder, `${resolution}.mp4`);
        const size = `${resolutionDimensions[resolution].width}x${resolutionDimensions[resolution].height}`;

        ffmpeg(inputPath)
            .videoCodec("libx264")
            .size(size)
            .on("start", (cmd) => console.log(` [FFmpeg] Старт: ${cmd}`))
            .on("end", () => {
                console.log(` [FFmpeg] Конвертация завершена: ${outputFile}`);
                resolve(outputFile);
            })
            .on("error", (err) => {
                console.error(" [FFmpeg] Ошибка:", err.message);
                reject(err);
            })
            .save(outputFile);
    });
}

function generateHLS(inputFile, resolution) {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(inputFile);
        const hlsFile = path.join(dir, `${resolution}.m3u8`);

        ffmpeg(inputFile)
            .videoCodec("libx264")
            .outputOptions([
                "-profile:v baseline",
                "-level 3.0",
                "-start_number 0",
                "-hls_time 10",
                "-hls_list_size 0",
                "-f hls"
            ])
            .on("start", (cmd) => console.log(` [HLS] Старт HLS (${resolution}): ${cmd}`))
            .on("end", () => {
                console.log(` [HLS] HLS завершён: ${hlsFile}`);
                resolve(hlsFile);
            })
            .on("error", (err) => {
                console.error(` [HLS] Ошибка HLS (${resolution}):`, err.message);
                reject(err);
            })
            .save(hlsFile);
    });
}

function generateMasterPlaylist(videoFolder, resolutions) {
    const masterPath = path.join(videoFolder, "master.m3u8");
    const lines = ["#EXTM3U"];
    resolutions.forEach((res) => {
        const dim = resolutionDimensions[res];
        lines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${dim.width * dim.height * 5},RESOLUTION=${dim.width}x${dim.height}`);
        lines.push(`${res}.m3u8`);
    });
    fs.writeFileSync(masterPath, lines.join("\n"));
    console.log(` [HLS] Мастер-плейлист создан: ${masterPath}`);
}

async function startWorker() {
    try {
        const connection = await connectToRabbit();
        const channel = await connection.createChannel();
        const queue = "video-tasks";

        await channel.assertQueue(queue, { durable: true });
        console.log(` [*] Ожидание сообщений в очереди: ${queue}`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const task = JSON.parse(msg.content.toString());
                console.log(` [x] Получена задача:`, task);

                if (!fs.existsSync(task.filePath)) {
                    console.error(` [!] Файл не найден: ${task.filePath}`);
                    channel.ack(msg);
                    return;
                }

                ffmpeg.ffprobe(task.filePath, async (err, metadata) => {
                    if (err) {
                        console.error(" [FFprobe] Ошибка:", err.message);
                        channel.ack(msg);
                        return;
                    }

                    const videoStream = metadata.streams.find((s) => s.codec_type === "video");
                    if (!videoStream) {
                        console.error(" [FFprobe] Видео поток не найден");
                        channel.ack(msg);
                        return;
                    }

                    const inputWidth = videoStream.width;
                    const inputHeight = videoStream.height;

                    let maxResolutionIndex = resolutions.length - 1;
                    for (let i = 0; i < resolutions.length; i++) {
                        const res = resolutions[i];
                        const dim = resolutionDimensions[res];
                        if (dim.width > inputWidth || dim.height > inputHeight) {
                            maxResolutionIndex = i - 1;
                            break;
                        }
                    }

                    if (maxResolutionIndex < 0) {
                        console.log(` [!] Исходное разрешение (${inputWidth}x${inputHeight}) меньше минимального в списке, пропуск конвертации.`);
                        channel.ack(msg);
                        return;
                    }

                    const videoFolder = path.join(path.dirname(task.filePath), path.parse(task.filePath).name);
                    const createdResolutions = [];

                    try {
                        for (let i = 0; i <= maxResolutionIndex; i++) {
                            const res = resolutions[i];
                            const mp4File = await convertVideo(task.filePath, res);
                            await generateHLS(mp4File, res);
                            createdResolutions.push(res);
                        }

                        generateMasterPlaylist(videoFolder, createdResolutions);

                        fs.unlinkSync(task.filePath);
                        console.log(` [🗑] Исходное видео удалено: ${task.filePath}`);
                    } catch (processErr) {
                        console.error(" [!] Ошибка при обработке видео:", processErr.message);
                    }

                    channel.ack(msg);
                });
            }
        });
    } catch (err) {
        console.error("Ошибка в воркере:", err);
    }
}

startWorker();