const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const videosRouter = require("./routes/videos");

const app = express();
const port = 8000;

app.use(helmet());

const allowedOrigins = ["http://localhost:3000"];
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/videos", videosRouter);

// хелс чек
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "api-gateway" });
});

// JWT Middleware
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

app.get("/admin", authenticateToken, (req, res) => {
    res.json({ message: "Добро пожаловать в админку", user: req.user });
});

app.listen(port, () => {
    console.log(`API Gateway running at http://localhost:${port}`);
});
