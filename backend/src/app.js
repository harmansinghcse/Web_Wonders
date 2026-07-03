const express = require("express");

const app = express();

const dinosaurRoutes = require("./routes/dinosaurRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use("/api/dinosaur", dinosaurRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Jurassic API is running",
    });
});

module.exports = app;
