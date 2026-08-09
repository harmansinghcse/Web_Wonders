const mongoose = require("mongoose");

const dailyChallengeSchema = new mongoose.Schema(
    {
        date: {
            type: String, // format YYYY-MM-DD
            required: true,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard", "mixed"],
            default: "medium",
        },
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: false,
        },
        topicName: {
            type: String,
            required: true,
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DailyChallenge", dailyChallengeSchema);
