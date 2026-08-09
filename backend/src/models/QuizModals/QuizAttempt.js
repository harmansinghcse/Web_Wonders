const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
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

        score: {
            type: Number,
            required: true,
        },

        totalQuestions: {
            type: Number,
            required: true,
        },

        accuracy: {
            type: Number,
            required: true,
        },

        dnaEarned: {
            type: Number,
            default: 0,
        },

        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: true,
                },
                selectedOption: {
                    type: Number,
                    required: true,
                },
                correctOption: {
                    type: Number,
                    required: true,
                },
                wasCorrect: {
                    type: Boolean,
                    required: true,
                },
            },
        ],

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

quizAttemptSchema.index(
    { user: 1, dailyChallenge: 1 },
    {
        unique: true,
        partialFilterExpression: { dailyChallenge: { $exists: true, $ne: null } },
    }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
