const express = require("express");
const { uploadVideo } = require("../controllers/uploadController");

const router = express.Router();

// POST /upload
router.post("/", uploadVideo);

module.exports = router;