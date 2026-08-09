const mongoose = require("mongoose");

const factCheckSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            unique: true,
            index: true,
        },
        verdict: {
            type: String,
            enum: [
                "Correct",
                "Mostly Correct",
                "Partially Correct",
                "Misleading",
                "Incorrect",
                "Insufficient Evidence"
            ],
            required: true,
        },
        explanation: {
            type: String,
            required: true,
            trim: true,
        },
        checkedBy: {
            type: String,
            default: "Professor Ross / Gemini",
        },
        checkedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("FactCheck", factCheckSchema);
