const express = require("express");
const videosRouter = require("./routes/videos");
const app = express();
const port = 8000;

app.get("/health", async (req, res) => {
    res.json({status: "OK", service: "api-gateway"});
});

app.use("/videos", videosRouter);

app.listen(port, () => {
    console.log(`API gateway running on port ${port}`);
})