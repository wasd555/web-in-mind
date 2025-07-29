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

async function startWorker() {
    try {
        const connection = await connectToRabbit();
        const channel = await connection.createChannel();
        const queue = "video-tasks";

        await channel.assertQueue(queue, { durable: true });
        console.log(` [*] Ожидание сообщений в очереди: ${queue}`);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const task = JSON.parse(msg.content.toString());
                console.log(` [x] Получена задача:`, task);

                setTimeout(() => {
                    console.log(` [✔] Задача обработана:`, task.filename);
                    channel.ack(msg);
                }, 2000);
            }
        });
    } catch (err) {
        console.error("Ошибка в воркере:", err);
    }
}

startWorker();
