const communityService = require("../services/communityService");
const uploadToCloudinary = require("../utils/uploadToCloudiary");

/**
 * Format timestamps into human-readable time-ago strings
 */
const formatTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
    
    let months = Math.floor(seconds / 2592000);
    if (months >= 1) return months + " month" + (months > 1 ? "s" : "") + " ago";
    
    let days = Math.floor(seconds / 86400);
    if (days >= 1) return days + " day" + (days > 1 ? "s" : "") + " ago";
    
    let hours = Math.floor(seconds / 3600);
    if (hours >= 1) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
    
    let minutes = Math.floor(seconds / 60);
    if (minutes >= 1) return minutes + " min" + (minutes > 1 ? "s" : "") + " ago";
    
    return "Just now";
};

/**
 * Transform MongoDB Post document into frontend-friendly JSON format
 */
const transformPost = (post, currentUserId) => {
    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
    const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;

    return {
        id: post._id,
        author: {
            id: post.author?._id,
            name: post.author?.name || "Explorer",
            avatar: post.author?.avatar || "",
            role: post.author?.role || "Explorer",
            handle: `@${(post.author?.name || "explorer").toLowerCase().replace(/\s+/g, "_")}`,
        },
        timeAgo: formatTimeAgo(post.createdAt),
        category: post.category,
        type: post.type,
        title: post.title,
        badge: post.badge,
        description: post.description,
        image: post.image,
        stats: post.stats,
        likes: likesCount,
        isLiked: currentUserId && Array.isArray(post.likes) 
            ? post.likes.some(l => l.toString() === currentUserId.toString()) 
            : false,
        isSaved: false,
        commentsCount,
        comments: Array.isArray(post.comments) 
            ? post.comments.map(c => ({
                id: c._id,
                user: c.author?.name || "Explorer",
                avatar: c.author?.avatar || "",
                role: c.author?.role || "Explorer",
                text: c.text,
                timestamp: formatTimeAgo(c.createdAt),
            }))
            : [],
        tags: post.tags || [],
    };
};

/**
 * Fetch all posts (Supports pagination)
 */
const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const result = await communityService.getPosts(page, limit);
        const transformed = result.posts.map(post => transformPost(post, req.user?.id));

        return res.status(200).json({
            success: true,
            data: transformed,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new post
 */
const createPost = async (req, res, next) => {
    try {
        const { title, description, image, stats, tags } = req.body;

        let imageUrl = image || "";
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file, "community_posts");
            imageUrl = uploadResult.secure_url;
        }

        const trimmedDesc = (description || "").trim();
        if (!trimmedDesc && !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Post content cannot be empty. Please provide description text or upload an image.",
            });
        }

        let parsedStats = stats;
        if (typeof stats === "string" && stats) {
            try {
                parsedStats = JSON.parse(stats);
            } catch (e) {
                parsedStats = undefined;
            }
        }
        let parsedTags = tags;
        if (typeof tags === "string" && tags) {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
            }
        }

        let dynamicType = "text";
        let dynamicCategory = "Explorer Journal";
        if (parsedStats) {
            dynamicType = "hybrid";
            dynamicCategory = "Shared a hybrid";
        } else if (imageUrl) {
            dynamicType = "photo";
            dynamicCategory = "Photo Upload";
        }

        const newPost = await communityService.createPost(req.user.id, {
            title: title || (dynamicType === "hybrid" ? "New Hybrid Specimen" : dynamicType === "photo" ? "Expedition Snapshot" : "Explorer Note"),
            description: trimmedDesc,
            category: dynamicCategory,
            type: dynamicType,
            image: imageUrl,
            stats: parsedStats || undefined,
            tags: parsedTags || [],
        });

        return res.status(201).json({
            success: true,
            data: transformPost(newPost, req.user.id),
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update an existing post
 */
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, description, tags, stats, image } = req.body;

        let imageUrl = image;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file, "community_posts");
            imageUrl = uploadResult.secure_url;
        }

        let parsedStats = stats;
        if (typeof stats === "string" && stats) {
            try {
                parsedStats = JSON.parse(stats);
            } catch (e) {}
        }
        let parsedTags = tags;
        if (typeof tags === "string" && tags) {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
            }
        }

        let dynamicType = "text";
        let dynamicCategory = "Explorer Journal";
        if (parsedStats) {
            dynamicType = "hybrid";
            dynamicCategory = "Shared a hybrid";
        } else if (imageUrl) {
            dynamicType = "photo";
            dynamicCategory = "Photo Upload";
        }

        const updated = await communityService.updatePost(postId, req.user.id, {
            title,
            description: description !== undefined ? description.trim() : undefined,
            category: dynamicCategory,
            type: dynamicType,
            tags: parsedTags,
            stats: parsedStats,
            image: imageUrl,
        });

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: transformPost(updated, req.user.id),
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

/**
 * Delete a post
 */
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const isAdmin = req.user.role === "admin";

        await communityService.deletePost(postId, req.user.id, isAdmin);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
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

/**
 * Toggle liking a post
 */
const likePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const result = await communityService.toggleLike(postId, req.user.id);

        return res.status(200).json({
            success: true,
            likesCount: result.likesCount,
            isLiked: result.isLiked,
            likes: result.likes,
        });
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, message: err.message });
        }
        next(err);
    }
};

/**
 * Comment on a post
 */
const addComment = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment text cannot be empty.",
            });
        }

        const result = await communityService.addComment(postId, req.user.id, text.trim());

        // Transform comments list
        const transformedComments = result.comments.map(c => ({
            id: c._id,
            user: c.author?.name || "Explorer",
            avatar: c.author?.avatar,
            role: c.author?.role,
            text: c.text,
            timestamp: formatTimeAgo(c.createdAt),
        }));

        return res.status(200).json({
            success: true,
            data: transformedComments[transformedComments.length - 1], // Return the newly added comment
            comments: transformedComments,
            commentsCount: result.commentsCount,
        });
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ success: false, message: err.message });
        }
        next(err);
    }
};

/**
 * Delete a comment from a post
 */
const deleteComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const isAdmin = req.user.role === "admin";

        const result = await communityService.deleteComment(postId, commentId, req.user.id, isAdmin);

        const transformedComments = result.comments.map(c => ({
            id: c._id,
            user: c.author?.name || "Explorer",
            avatar: c.author?.avatar,
            role: c.author?.role,
            text: c.text,
            timestamp: formatTimeAgo(c.createdAt),
        }));

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            comments: transformedComments,
            commentsCount: result.commentsCount,
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

module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
};
