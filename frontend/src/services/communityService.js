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
