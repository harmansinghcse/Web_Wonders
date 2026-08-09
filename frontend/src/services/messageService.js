import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Fetch all conversations for the logged in user
export const fetchConversationsService = async () => {
    const response = await axios.get(`${API_BASE}/api/messages/conversations`, {
        withCredentials: true,
    });
    return response.data;
};

// Fetch paginated messages for a conversation
export const fetchMessagesService = async (conversationId, page = 1, limit = 20) => {
    const response = await axios.get(
        `${API_BASE}/api/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
        { withCredentials: true }
    );
    return response.data;
};

// Start or retrieve a conversation with another user
export const startConversationService = async (targetUserId) => {
    const response = await axios.post(
        `${API_BASE}/api/messages/conversations`,
        { targetUserId },
        { withCredentials: true }
    );
    return response.data;
};

// Send a message in a conversation
export const sendMessageService = async (conversationId, content, messageType = "text") => {
    const response = await axios.post(
        `${API_BASE}/api/messages/conversations/${conversationId}/messages`,
        { content, messageType },
        { withCredentials: true }
    );
    return response.data;
};

// Mark all messages in a conversation as read
export const markAsReadService = async (conversationId) => {
    const response = await axios.patch(
        `${API_BASE}/api/messages/conversations/${conversationId}/read`,
        {},
        { withCredentials: true }
    );
    return response.data;
};
