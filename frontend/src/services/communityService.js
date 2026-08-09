import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Fetch posts (Supports page, limit, feedMode, postType, dinosaurId, tag, and sort)
export const fetchPostsService = async (page = 1, limit = 20, queryOptions = {}) => {
    const { feedMode = "explore", postType, dinosaurId, tag, sort } = queryOptions;
    let url = `${API_BASE}/api/community/posts?page=${page}&limit=${limit}&feedMode=${feedMode}`;
    if (postType) url += `&postType=${postType}`;
    if (dinosaurId) url += `&dinosaurId=${dinosaurId}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;
    if (sort) url += `&sort=${sort}`;

    const response = await axios.get(url, {
        withCredentials: true,
    });
    return response.data;
};

// Fact-check a post using Professor Ross
export const factCheckPostService = async (postId) => {
    const response = await axios.post(`${API_BASE}/api/community/posts/${postId}/fact-check`, {}, {
        withCredentials: true,
    });
    return response.data;
};

// Create a new post (using FormData for file upload support)
export const createPostService = async (formData) => {
    const response = await axios.post(`${API_BASE}/api/community/posts`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Update an existing post
export const updatePostService = async (postId, formData) => {
    const response = await axios.put(`${API_BASE}/api/community/posts/${postId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Delete a post
export const deletePostService = async (postId) => {
    const response = await axios.delete(`${API_BASE}/api/community/posts/${postId}`, {
        withCredentials: true,
    });
    return response.data;
};

// Like/Unlike a post
export const likePostService = async (postId) => {
    const response = await axios.post(`${API_BASE}/api/community/posts/${postId}/like`, {}, {
        withCredentials: true,
    });
    return response.data;
};

// Add comment to a post
export const addCommentService = async (postId, text) => {
    const response = await axios.post(`${API_BASE}/api/community/posts/${postId}/comments`, { text }, {
        withCredentials: true,
    });
    return response.data;
};

// Delete comment from a post
export const deleteCommentService = async (postId, commentId) => {
    const response = await axios.delete(`${API_BASE}/api/community/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
    });
    return response.data;
};

// Edit comment on a post
export const updateCommentService = async (postId, commentId, text) => {
    const response = await axios.put(`${API_BASE}/api/community/posts/${postId}/comments/${commentId}`, { text }, {
        withCredentials: true,
    });
    return response.data;
};

// Fetch all comments for a post
export const fetchCommentsService = async (postId) => {
    const response = await axios.get(`${API_BASE}/api/community/posts/${postId}/comments`, {
        withCredentials: true,
    });
    return response.data;
};

// Follow a user
export const followUserService = async (userId) => {
    const response = await axios.post(`${API_BASE}/api/users/${userId}/follow`, {}, {
        withCredentials: true,
    });
    return response.data;
};

// Unfollow a user
export const unfollowUserService = async (userId) => {
    const response = await axios.post(`${API_BASE}/api/users/${userId}/unfollow`, {}, {
        withCredentials: true,
    });
    return response.data;
};

// Check follow status
export const getFollowStatusService = async (userId) => {
    const response = await axios.get(`${API_BASE}/api/users/${userId}/follow-status`, {
        withCredentials: true,
    });
    return response.data;
};

// Get followers
export const getFollowersService = async (userId) => {
    const response = await axios.get(`${API_BASE}/api/users/${userId}/followers`, {
        withCredentials: true,
    });
    return response.data;
};

// Get following
export const getFollowingService = async (userId) => {
    const response = await axios.get(`${API_BASE}/api/users/${userId}/following`, {
        withCredentials: true,
    });
    return response.data;
};

// Get suggested explorers
export const getSuggestedExplorersService = async () => {
    const response = await axios.get(`${API_BASE}/api/users/suggested`, {
        withCredentials: true,
    });
    return response.data;
};

// Search users
export const searchUsersService = async (query) => {
    const response = await axios.get(`${API_BASE}/api/users/search?q=${encodeURIComponent(query)}`, {
        withCredentials: true,
    });
    return response.data;
};

// Get user profile details
export const getUserProfileService = async (userId) => {
    const response = await axios.get(`${API_BASE}/api/users/${userId}/profile`, {
        withCredentials: true,
    });
    return response.data;
};

// Fetch notifications
export const getNotificationsService = async () => {
    const response = await axios.get(`${API_BASE}/api/users/notifications`, {
        withCredentials: true,
    });
    return response.data;
};

// Mark notifications read
export const markNotificationsReadService = async () => {
    const response = await axios.post(`${API_BASE}/api/users/notifications/read`, {}, {
        withCredentials: true,
    });
    return response.data;
};
