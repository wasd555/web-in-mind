const express = require('express');
const {getAllVideos} = require('../controllers/videoController');

const router = express.Router();

router.get('/', getAllVideos);

module.exports = router;