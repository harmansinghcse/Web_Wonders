const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: false,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true,
        }
    },
    {
        timestamps: true,
    }
);

// Compound index on participants for fast lookups
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
