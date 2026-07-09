const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },

        score: {
            type: Number,
            default: 0,
        },

        totalQuestions: Number,

        correctAnswers: Number,

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
