const express = require("express");

const app = express();

const dinosaurRoutes = require("./routes/dinosaurRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(cons());
app.set("query parser", "extended");
app.use("/api/dinosaur", dinosaurRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        message: "Jurassic API is running",
    });
});

module.exports = app;
