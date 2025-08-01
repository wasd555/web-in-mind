const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Нет токена" });

    jwt.verify(token, "super_secret_key", (err, user) => {
        console.log("Ошибка токена:", err);
        if (err) return res.status(403).json({ message: "Токен недействителен" });
        onsole.log("Пользователь из токена:", user);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;