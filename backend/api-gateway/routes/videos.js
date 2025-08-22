const express = require("express");
const fs = require("fs");
const path = require("path");
// Доступ к /videos защищён на уровне index.js через directusSessionAuth

const router = express.Router();


// const uploadsPath = path.join(__dirname, "../../shared-uploads");
const uploadsPath = path.join("/app/uploads");
console.log("Проверяем uploadsPath:", uploadsPath);
// Получение списка видео
router.get("/", (req, res) => {
    if (!fs.existsSync(uploadsPath)) {
        return res.json([]);
    }

    const videos = fs.readdirSync(uploadsPath).filter((file) =>
        fs.statSync(path.join(uploadsPath, file)).isDirectory()
    );

    const result = videos.map((videoFolder) => {
        const folderPath = path.join(uploadsPath, videoFolder);
        const files = fs.readdirSync(folderPath);
        const availableResolutions = files
            .filter((f) => f.endsWith(".m3u8") && !f.startsWith("master"))
            .map((f) => f.replace(".m3u8", ""));

        return {
            name: videoFolder,
            availableResolutions,
            hls: `/videos/${videoFolder}/master.m3u8`
        };
    });

    res.json(result);
});

// Раздача HLS файлов
router.get("/:video/:file", (req, res) => {
    const { video, file } = req.params;
    const filePath = path.join(uploadsPath, video, file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Файл не найден");
    }

    res.sendFile(filePath);
});

module.exports = router;