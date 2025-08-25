const express = require("express");
const fs = require("fs");
const path = require("path");
// Доступ к /videos защищён на уровне index.js через directusSessionAuth

const router = express.Router();


// Определяем uploadsPath: приоритет ENV, затем контейнерный путь, затем локальный shared-uploads
const resolveUploadsPath = () => {
    const envPath = process.env.UPLOADS_PATH && process.env.UPLOADS_PATH.trim();
    if (envPath && fs.existsSync(envPath)) return envPath;

    const containerPath = "/app/uploads";
    if (fs.existsSync(containerPath)) return containerPath;

    const localPath = path.join(__dirname, "../../shared-uploads");
    if (fs.existsSync(localPath)) return localPath;

    // Последняя попытка: корень репо (dev-режим вне контейнера)
    const repoRootLocal = path.join(process.cwd(), "../shared-uploads");
    if (fs.existsSync(repoRootLocal)) return repoRootLocal;

    return localPath; // по умолчанию
};

const uploadsPath = resolveUploadsPath();
console.log("[videos] uploadsPath=", uploadsPath);
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
// Раздаём как плейлисты, так и сегменты, включая вложенные пути (например, segments/1080p_0001.ts)
router.get("/:video/*", (req, res) => {
    const { video } = req.params;
    const restPath = req.params[0] || ""; // master.m3u8, 720p.m3u8 или segments/part.ts
    const filePath = path.join(uploadsPath, video, restPath);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Файл не найден");
    }

    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".m3u8") {
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    } else if (ext === ".ts") {
        res.setHeader("Content-Type", "video/mp2t");
    }

    res.sendFile(filePath);
});

module.exports = router;