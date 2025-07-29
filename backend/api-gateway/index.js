const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");

const videosRouter = require("./routes/videos");

const app = express();
const port = 8000;

// 1. Helmet для безопасных заголовков
app.use(helmet());

// 2. Ограничиваем доступ (CORS) — разрешаем только фронтенд
const allowedOrigins = ["http://localhost:3000"]; // Позже сюда добавим домен админки
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// 3. Лимитируем запросы (100 запросов на IP за 15 минут)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));

// 4. JSON парсер
app.use(express.json());

app.use("/auth", authRouter);

// Проверка здоровья
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "api-gateway" });
});

// JWT Middleware (проверка токена для защищённых маршрутов)
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Нет токена" });

    jwt.verify(token, "SUPER_SECRET_KEY", (err, user) => {
        if (err) return res.status(403).json({ message: "Токен недействителен" });
        req.user = user;
        next();
    });
}

// Пример защищённого маршрута
app.get("/admin", authenticateToken, (req, res) => {
    res.json({ message: "Добро пожаловать в админку", user: req.user });
});

app.use("/videos", videosRouter);

app.listen(port, () => {
    console.log(`API Gateway running at http://localhost:${port}`);
});
