const express = require("express");
const multer = require("multer");
const path = require("path");

const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const { uploadVideo } = require("../controllers/uploadController");

const router = express.Router();

// POST /upload
router.post("/", upload.single("video"), uploadVideo);

module.exports = router;