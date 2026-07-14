const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        topic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic",
            required: true,
            index: true,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
            index: true,
        },

        question: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        options: {
            type: [String],
            validate: {
                validator: (value) => value.length === 4,
                message: "Exactly 4 options are required.",
            },
            required: true,
        },

        correctAnswer: {
            type: Number,
            min: 0,
            max: 3,
            required: true,
        },

        explanation: {
            type: String,
            default: "",
        },

        hint: {
            type: String,
            default: "",
        },

        points: {
            type: Number,
            default: 10,
        },
    },
    {
        timestamps: true,
    },
);

questionSchema.index({
    topic: 1,
    difficulty: 1,
});

module.exports = mongoose.model("Question", questionSchema);
