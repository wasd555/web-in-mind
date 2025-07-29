const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const uploadRouter = require("./routes/upload");

const app = express();
const port = 8001;

// Безопасные заголовки
app.use(helmet());

// Ограничение запросов (макс. 100 за 15 минут)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));

// Разрешаем только определённый фронтенд (пока *)
app.use(cors({ origin: "*" }));

// JSON-парсер
app.use(express.json());

// Проверка здоровья
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "video-uploader" });
});

// Маршруты
app.use("/upload", uploadRouter);

// Запуск сервера
app.listen(port, () => {
    console.log(`Video Uploader running at http://localhost:${port}`);
});