const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const dinosaurRoutes = require("./routes/dinosaurRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const profileRoutes = require("./routes/profile.routes");
const rossRoutes = require("./routes/rossRoutes");
const quizRoutes = require("./routes/quizRoutes");
const mapRoutes = require("./routes/mapRoutes");
const acquisitionRoutes = require("./routes/acquisitionRoutes");
const communityRoutes = require("./routes/communityRoutes");

// allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://web-wonders-coral.vercel.app",
];

app.use(express.json());

app.use(cookieParser());
app.use(
    cors({
        origin(origin, callback) {
            if (
                !origin ||
                allowedOrigins.includes(origin) ||
                origin.startsWith("http://localhost:") ||
                origin.endsWith(".vercel.app") ||
                origin.endsWith(".onrender.com")
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);
app.use("/api/quiz", quizRoutes);
app.set("query parser", "extended");
app.use("/api/dinosaur", dinosaurRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", rossRoutes);
app.use("/api/acquisition", acquisitionRoutes);
app.use("/api/map", mapRoutes);
app.use("/api/community", communityRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.json({
        message: "Jurassic API is running",
    });
});

module.exports = app;
