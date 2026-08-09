const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * Get all conversations for a user with unread counts and populated details
 */
const getConversations = async (userId) => {
    const conversations = await Conversation.find({
        participants: userId
    })
    .sort({ lastMessageAt: -1 })
    .populate("participants", "name avatar role")
    .populate("lastMessage")
    .lean();

    // Map to attach unread counts and filter out self-participants from UI name if necessary
    const conversationsWithDetails = await Promise.all(
        conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                sender: { $ne: userId },
                readAt: null
            });

            return {
                ...conv,
                unreadCount
            };
        })
    );

    return conversationsWithDetails;
};

/**
 * Get conversation details if user is participant
 */
const getConversationById = async (conversationId, userId) => {
    const conversation = await Conversation.findById(conversationId)
        .populate("participants", "name avatar role")
        .populate("lastMessage")
        .lean();

    if (!conversation) {
        throw new Error("Conversation not found.");
    }

    const isParticipant = conversation.participants.some(
        p => p._id.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new Error("Unauthorized to access this conversation.");
    }

    return conversation;
};

/**
 * Get paginated messages for a conversation
 */
const getConversationMessages = async (conversationId, userId, page = 1, limit = 20) => {
    // 1. Verify membership
    await getConversationById(conversationId, userId);

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "name avatar role")
        .lean();

    const total = await Message.countDocuments({ conversation: conversationId });

    return {
        messages: messages.reverse(), // reverse to display oldest to newest in chat thread UI
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Start a new conversation or retrieve existing between two participants
 */
const startConversation = async (userId, targetUserId) => {
    if (userId.toString() === targetUserId.toString()) {
        throw new Error("You cannot start a conversation with yourself.");
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        throw new Error("Target user not found.");
    }

    // Look for existing 1-to-1 conversation
    let conversation = await Conversation.findOne({
        participants: {
            $all: [userId, targetUserId],
            $size: 2
        }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [userId, targetUserId],
            lastMessageAt: new Date()
        });
    }

    return await Conversation.findById(conversation._id)
        .populate("participants", "name avatar role")
        .populate("lastMessage")
        .lean();
};

/**
 * Send a message within a conversation
 */
const sendMessage = async (conversationId, senderId, content, messageType = "text") => {
    // 1. Verify membership
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new Error("Conversation not found.");
    }

    const isParticipant = conversation.participants.some(
        p => p.toString() === senderId.toString()
    );

    if (!isParticipant) {
        throw new Error("Unauthorized to send messages to this conversation.");
    }

    // 2. Create message
    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content: content.trim(),
        messageType
    });

    // 3. Update conversation last message indicators
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await Message.findById(message._id)
        .populate("sender", "name avatar role")
        .lean();

    return populated;
};

/**
 * Mark all messages in a conversation as read by a participant
 */
const markAsRead = async (conversationId, userId) => {
    // 1. Verify membership
    await getConversationById(conversationId, userId);

    // 2. Update all messages sent by others
    await Message.updateMany(
        {
            conversation: conversationId,
            sender: { $ne: userId },
            readAt: null
        },
        {
            $set: { readAt: new Date() }
        }
    );

    return { success: true };
};

module.exports = {
    getConversations,
    getConversationById,
    getConversationMessages,
    startConversation,
    sendMessage,
    markAsRead
};
