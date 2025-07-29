function getAllVideos(req, res) {
    const videos =[
        { id: 1, title: 'First Video', quality: '1080p' },
        { id: 2, title: 'Second Video', quality: '1080p' },
    ];
    res.json(videos);
}

module.exports = {getAllVideos};