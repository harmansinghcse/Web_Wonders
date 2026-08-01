import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Fetch posts (Supports page, limit and filter)
export const fetchPostsService = async (page = 1, limit = 10, filter = "all") => {
    const response = await axios.get(`${API_BASE}/api/community/posts?page=${page}&limit=${limit}&filter=${filter}`, {
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

<<<<<<<<< Temporary merge branch 1
// Search users by query
export const searchUsersService = async (query) => {
    const response = await axios.get(`${API_BASE}/api/community/users/search?q=${encodeURIComponent(query)}`, {
=========
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
>>>>>>>>> Temporary merge branch 2
        withCredentials: true,
    });
    return response.data;
};

<<<<<<<<< Temporary merge branch 1
// Fetch suggested explorers
export const fetchSuggestedUsersService = async () => {
    const response = await axios.get(`${API_BASE}/api/community/users/suggested`, {
=========
// Get user profile details
export const getUserProfileService = async (userId) => {
    const response = await axios.get(`${API_BASE}/api/users/${userId}/profile`, {
>>>>>>>>> Temporary merge branch 2
        withCredentials: true,
    });
    return response.data;
};

<<<<<<<<< Temporary merge branch 1
// Toggle follow/unfollow user
export const toggleFollowUserService = async (userId) => {
    const response = await axios.post(`${API_BASE}/api/community/users/${userId}/follow`, {}, {
=========
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
>>>>>>>>> Temporary merge branch 2
        withCredentials: true,
    });
    return response.data;
};
