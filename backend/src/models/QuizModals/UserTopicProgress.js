const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: true,
        },

        completedQuestions: {
            type: Number,
            default: 0,
        },

        dnaPoints: {
            type: Number,
            default: 0,
        },

        accuracy: {
            type: Number,
            default: 0,
        },

        highestDifficultyUnlocked: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "easy",
        },

        lastPlayed: Date,
    },
    {
        timestamps: true,
    },
);

progressSchema.index(
    {
        user: 1,
        topic: 1,
    },
    {
        unique: true,
    },
);

module.exports = mongoose.model("UserTopicProgress", progressSchema);
