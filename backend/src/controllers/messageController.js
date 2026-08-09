const messageService = require("../services/messageService");

const getConversations = async (req, res, next) => {
    try {
        const result = await messageService.getConversations(req.user.id);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const getConversationById = async (req, res, next) => {
    try {
        const result = await messageService.getConversationById(req.params.id, req.user.id);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        if (err.message.includes("Unauthorized")) {
            return res.status(403).json({ success: false, message: err.message });
        }
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, message: err.message });
        }
        next(err);
    }
};

const getConversationMessages = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;

        const result = await messageService.getConversationMessages(
            req.params.id,
            req.user.id,
            page,
            limit
        );

        return res.status(200).json({
            success: true,
            data: result.messages,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            }
        });
    } catch (err) {
        if (err.message.includes("Unauthorized")) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

const startConversation = async (req, res, next) => {
    try {
        const { targetUserId } = req.body;
        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: "targetUserId is required to start a conversation."
            });
        }

        const result = await messageService.startConversation(req.user.id, targetUserId);
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const conversationId = req.params.id;
        const { content, messageType } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message content cannot be empty."
            });
        }

        const result = await messageService.sendMessage(
            conversationId,
            req.user.id,
            content,
            messageType || "text"
        );

        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        if (err.message.includes("Unauthorized")) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const result = await messageService.markAsRead(req.params.id, req.user.id);
        return res.status(200).json({
            success: true,
            message: "Messages marked as read."
        });
    } catch (err) {
        if (err.message.includes("Unauthorized")) {
            return res.status(403).json({ success: false, message: err.message });
        }
        next(err);
    }
};

module.exports = {
    getConversations,
    getConversationById,
    getConversationMessages,
    startConversation,
    sendMessage,
    markAsRead
};
