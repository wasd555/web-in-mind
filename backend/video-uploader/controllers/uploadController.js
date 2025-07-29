const amqp = require("amqplib");
const path = require("path");

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

async function sendToQueue(videoData) {
    try {
        const connection = await connectToRabbit();
        const channel = await connection.createChannel();
        const queue = "video-tasks";

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(videoData)), {
            persistent: true,
        });

        console.log(" [x] Задача отправлена в очередь:", videoData);

        await channel.close();
        await connection.close();
    } catch (err) {
        console.error("Ошибка при работе с RabbitMQ:", err);
    }
}

async function uploadVideo(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Файл не загружен" });
    }

    const videoData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
        filePath: path.join(__dirname, "..", "uploads", req.file.filename), // полный путь
    };

    await sendToQueue(videoData);

    res.json({ message: "Видео загружено и задача отправлена в очередь", videoData });
}


module.exports = { uploadVideo };
