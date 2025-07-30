const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const adminUser = {
    username: "admin",
    passwordHash: bcrypt.hashSync("123456", 10), // хеш
};

// POST /auth/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username !== adminUser.username) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
        { username: adminUser.username, role: "admin" },
        process.env.JWT_SECRET || "SUPER_SECRET_KEY",
        { expiresIn: "1h" }
    );

    res.json({ token });
});

module.exports = router;
