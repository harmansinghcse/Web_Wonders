const mongoose = require("mongoose");

const quizSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: false,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard", "mixed"],
            required: false,
        },
        dailyChallenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DailyChallenge",
            index: true,
            required: false,
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        completed: {
            type: Boolean,
            default: false,
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("QuizSession", quizSessionSchema);
