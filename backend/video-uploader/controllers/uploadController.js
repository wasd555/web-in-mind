const amqp = require("amqplib");

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
    const videoData = {
        filename: "test-video.mp4",
        quality: "1080p",
        uploadedAt: new Date(),
    };

    await sendToQueue(videoData);
    res.json({ message: "Видео принято и задача отправлена в очередь" });
}

module.exports = { uploadVideo };
