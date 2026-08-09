const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getConversations,
    getConversationById,
    getConversationMessages,
    startConversation,
    sendMessage,
    markAsRead
} = require("../controllers/messageController");

const router = express.Router();

// All message endpoints require authentication
router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", startConversation);
router.get("/conversations/:id", getConversationById);
router.get("/conversations/:id/messages", getConversationMessages);
router.post("/conversations/:id/messages", sendMessage);
router.patch("/conversations/:id/read", markAsRead);

module.exports = router;
