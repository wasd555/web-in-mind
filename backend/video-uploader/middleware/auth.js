const jwt = require("jsonwebtoken");

function authenticateToken (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).send("No token provided");

    jwt.verify(token, process.env.JWT_SECRET || "SUPER_SECRET_KEY", (err, user) => {
        if (err) return res.status(403).json({ message: "Токен недействителен"});
        req.user = user;
        next();
    });
}

module.exports = {authenticateToken};