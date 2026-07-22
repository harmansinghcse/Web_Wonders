import axios from "axios";
import { getStoredPosts, savePostsToStorage, getStoredFollows, saveFollowsToStorage } from "./communityServiceHelpers";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Fetch posts (Backend API with local storage sync/fallback)
export const fetchPostsService = async () => {
    try {
        const response = await axios.get(`${API_BASE}/api/community/posts`, { timeout: 3000 });
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            const apiPosts = response.data.data;
            const localPosts = getStoredPosts();
            // Merge local user-created posts with API posts
            const mergedMap = new Map();
            [...localPosts, ...apiPosts].forEach(p => mergedMap.set(p.id, p));
            const merged = Array.from(mergedMap.values());
            savePostsToStorage(merged);
            return merged;
        }
    } catch (e) {
        console.log("Using local dynamic storage fallback for community posts:", e.message);
    }
    return getStoredPosts();
};

// Create a new post dynamically
export const createPostService = async (newPostData) => {
    const localPosts = getStoredPosts();
    const updated = [newPostData, ...localPosts];
    savePostsToStorage(updated);

    try {
        await axios.post(`${API_BASE}/api/community/posts`, newPostData, { timeout: 3000 });
    } catch (e) {
        console.log("Post saved locally:", e.message);
    }
    return updated;
};

// Like a post dynamically
export const likePostService = async (postId, posts) => {
    const updated = posts.map(post => {
        if (post.id === postId) {
            const nextLiked = !post.isLiked;
            return {
                ...post,
                isLiked: nextLiked,
                likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
            };
        }
        return post;
    });
    savePostsToStorage(updated);

    try {
        await axios.post(`${API_BASE}/api/community/posts/${postId}/like`, {}, { timeout: 3000 });
    } catch (e) {
        // Fallback handled locally
    }
    return updated;
};

// Add comment dynamically
export const addCommentService = async (postId, commentObj, posts) => {
    const updated = posts.map(post => {
        if (post.id === postId) {
            const newComments = [...(post.comments || []), commentObj];
            return {
                ...post,
                commentsCount: (post.commentsCount || 0) + 1,
                comments: newComments
            };
        }
        return post;
    });
    savePostsToStorage(updated);

    try {
        await axios.post(`${API_BASE}/api/community/posts/${postId}/comment`, commentObj, { timeout: 3000 });
    } catch (e) {
        // Fallback handled locally
    }
    return updated;
};

// Save / Bookmark toggle
export const toggleSaveService = (postId, posts) => {
    const updated = posts.map(post => {
        if (post.id === postId) {
            return { ...post, isSaved: !post.isSaved };
        }
        return post;
    });
    savePostsToStorage(updated);
    return updated;
};

// Follow toggle
export const toggleFollowService = (explorerId, explorersList) => {
    const follows = getStoredFollows();
    const updatedExplorers = explorersList.map(exp => {
        if (exp.id === explorerId) {
            const nextState = !exp.isFollowing;
            if (nextState) {
                if (!follows.includes(explorerId)) follows.push(explorerId);
            } else {
                const idx = follows.indexOf(explorerId);
                if (idx > -1) follows.splice(idx, 1);
            }
            return { ...exp, isFollowing: nextState };
        }
        return exp;
    });
    saveFollowsToStorage(follows);
    return { updatedExplorers, follows };
};
