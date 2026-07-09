const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        avatar: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 250,
        },

        score: {
            type: Number,
            default: 0,
            min: 0,
        },

        quizzesSolved: {
            type: Number,
            default: 0,
            min: 0,
        },

        achievementsUnlocked: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("User", userSchema);
