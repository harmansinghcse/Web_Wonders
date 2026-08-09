const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            default: "Explorer Journal",
        },
        type: {
            type: String,
            enum: ["text", "hybrid", "photo", "fossil"],
            default: "text",
        },
        postType: {
            type: String,
            enum: ["text", "image", "question", "comparison", "opinion", "discovery", "educational", "discussion", "fact", "casual"],
            default: "text",
        },
        dinosaur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dinosaur",
            required: false,
            index: true,
        },
        seedMarker: {
            type: String,
            default: "",
            index: true,
        },
        seedVersion: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        badge: {
            type: String,
            default: "Post",
        },
        tags: [
            {
                type: String,
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [commentSchema],
        stats: {
            attack: Number,
            defense: Number,
            speed: Number,
            size: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);
