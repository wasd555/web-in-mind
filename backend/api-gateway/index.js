const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authenticateToken = require("./middleware/auth");
const authRouter = require("./routes/auth.js");
const videosRouter = require("./routes/videos.js");
const probeRouter = require("./routes/readiness");

const app = express();
const port = process.env.PORT || 8000;

app.use(helmet());

const allowedOrigins = ["http://localhost:3002", "http://localhost:3000", "http://localhost:3001"];
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/videos", authenticateToken, videosRouter);
app.use("/", probeRouter);

app.get("/admin", authenticateToken, (req, res) => {
    res.json({ message: "Добро пожаловать в админку", user: req.user });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`API Gateway running at http://0.0.0.0:${port}`);
});
