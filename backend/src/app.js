const express = require("express");

const app = express();

const dinosaurRoutes = require("./routes/dinosaurRoutes");

app.use(express.json());
app.use("/api/dinosaur", dinosaurRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Jurassic API is running",
    });
});

module.exports = app;
