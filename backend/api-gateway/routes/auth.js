const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

// Фейковый пользователь (позже заменим на базу данных)
const adminUser = {
    username: "admin",
    passwordHash: bcrypt.hashSync("123456", 10), // храним хэш пароля, а не сам пароль
};

// POST /auth/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Проверяем логин
    if (username !== adminUser.username) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    // Проверяем пароль (сравниваем с хэшем)
    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    // Генерируем токен
    const token = jwt.sign(
        { username: adminUser.username, role: "admin" },
        process.env.JWT_SECRET || "SUPER_SECRET_KEY",
        { expiresIn: "1h" }
    );

    res.json({ token });
});

module.exports = router;
