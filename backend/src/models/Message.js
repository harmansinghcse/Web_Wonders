const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        readAt: {
            type: Date,
            required: false,
        },
        messageType: {
            type: String,
            enum: ["text", "image", "dinosaur"],
            default: "text",
        }
    },
    {
        timestamps: true,
    }
);

// Compound index on conversation and createdAt for fast paginated thread loading
messageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
