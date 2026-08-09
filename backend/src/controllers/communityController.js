const mongoose = require("mongoose");
const Post = require("../models/Post");
const FactCheck = require("../models/FactCheck");
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
const transformPost = (post, currentUser, factCheck = null) => {
    const currentUserId = currentUser?.id || currentUser?._id;
    const isAdmin = currentUser?.role === "admin";
    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
    const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;

    const canEdit = !!(currentUserId && post.author?._id && post.author._id.toString() === currentUserId.toString());
    const canDelete = !!(canEdit || isAdmin);

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
        postType: post.postType || "text",
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
            ? post.comments.slice(0, 5).map(c => ({
                id: c._id,
                userId: c.author?._id,
                user: c.author?.name || "Explorer",
                avatar: c.author?.avatar || "",
                role: c.author?.role || "Explorer",
                text: c.text,
                timestamp: formatTimeAgo(c.createdAt),
                permissions: {
                    canEdit: !!(currentUserId && c.author?._id && c.author._id.toString() === currentUserId.toString()),
                    canDelete: !!(currentUserId && (c.author?._id && c.author._id.toString() === currentUserId.toString() || isAdmin))
                }
            }))
            : [],
        tags: post.tags || [],
        dinosaur: post.dinosaur ? {
            id: post.dinosaur._id || post.dinosaur,
            name: post.dinosaur.name || "",
            slug: post.dinosaur.slug || ""
        } : null,
        factCheck: factCheck ? {
            verdict: factCheck.verdict,
            explanation: factCheck.explanation,
            checkedBy: factCheck.checkedBy,
            checkedAt: factCheck.checkedAt
        } : null,
        permissions: {
            canEdit,
            canDelete
        }
    };
};

/**
 * Fetch all posts (Supports pagination)
 */
const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const feedMode = req.query.feedMode || "explore";
        const postType = req.query.postType;
        const dinosaurId = req.query.dinosaurId;
        const tag = req.query.tag;
        const sort = req.query.sort;

        let authorIds = null;
        if (feedMode === "following" && req.user) {
            const Follow = require("../models/Follow");
            authorIds = await Follow.find({ follower: req.user.id }).distinct("following");
            // If the user isn't following anyone, make sure we return empty instead of all posts
            if (!authorIds || authorIds.length === 0) {
                authorIds = [new mongoose.Types.ObjectId()];
            }
        }

        const queryOptions = {
            authorIds,
            postType,
            dinosaurId,
            tag,
            sort,
            feedMode
        };

        const result = await communityService.getPosts(page, limit, queryOptions);

        const postIds = result.posts.map(p => p._id);
        const FactCheck = require("../models/FactCheck");
        const factChecks = await FactCheck.find({ post: { $in: postIds } }).lean();

        const transformed = result.posts.map(post => {
            const fc = factChecks.find(f => f.post.toString() === post._id.toString());
            return transformPost(post, req.user, fc);
        });

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
            postType: req.body.postType || "text",
            dinosaur: req.body.dinosaurId || undefined,
            image: imageUrl,
            stats: parsedStats || undefined,
            tags: parsedTags || [],
        });

        return res.status(201).json({
            success: true,
            data: transformPost(newPost, req.user),
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
            postType: req.body.postType,
            dinosaur: req.body.dinosaurId,
            tags: parsedTags,
            stats: parsedStats,
            image: imageUrl,
        });

        // Invalidate cached fact check/answer
        await FactCheck.deleteOne({ post: postId });

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: transformPost(updated, req.user),
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

        if (result.isLiked) {
            const Post = require("../models/Post");
            const post = await Post.findById(postId);
            if (post && post.author.toString() !== req.user.id.toString()) {
                const Notification = require("../models/Notification");
                await Notification.create({
                    recipient: post.author,
                    sender: req.user.id,
                    type: "like",
                    post: postId,
                });
            }
        }

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

        const Post = require("../models/Post");
        const post = await Post.findById(postId);
        if (post && post.author.toString() !== req.user.id.toString()) {
            const newComment = result.comments[result.comments.length - 1];
            const Notification = require("../models/Notification");
            await Notification.create({
                recipient: post.author,
                sender: req.user.id,
                type: "comment",
                post: postId,
                comment: text.trim(),
                commentId: newComment ? newComment._id.toString() : undefined,
            });
        }

        // Transform comments list
        const transformedComments = result.comments.map(c => ({
            id: c._id,
            userId: c.author?._id,
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
            userId: c.author?._id,
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

/**
 * Edit a comment on a post
 */
const editComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment text cannot be empty.",
            });
        }

        const result = await communityService.editComment(postId, commentId, req.user.id, text.trim());

        const transformedComments = result.comments.map(c => ({
            id: c._id,
            userId: c.author?._id,
            user: c.author?.name || "Explorer",
            avatar: c.author?.avatar,
            role: c.author?.role,
            text: c.text,
            timestamp: formatTimeAgo(c.createdAt),
            permissions: {
                canEdit: !!(req.user && c.author?._id && c.author._id.toString() === req.user.id.toString()),
                canDelete: !!(req.user && (c.author?._id && c.author._id.toString() === req.user.id.toString() || req.user.role === 'admin'))
            }
        }));

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
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

/**
 * Search users by name/display name
 */
const searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;
        const currentUserId = req.user ? req.user.id : null;
        const users = await communityService.searchUsers(q, currentUserId);
        
        const transformed = users.map(u => ({
            id: u._id,
            name: u.name,
            avatar: u.avatar || "",
            role: u.role === "admin" ? "Admin" : "Explorer",
            handle: `@${u.name.toLowerCase().replace(/\s+/g, "")}`,
            bio: u.bio || "",
            isFollowing: currentUserId && u.followers ? u.followers.some(id => id.toString() === currentUserId.toString()) : false,
        }));

        return res.status(200).json({
            success: true,
            data: transformed,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get suggested explorers
 */
const getSuggestedUsers = async (req, res, next) => {
    try {
        const currentUserId = req.user ? req.user.id : null;
        const users = await communityService.getSuggestedUsers(currentUserId);
        
        const transformed = users.map(u => ({
            id: u._id,
            name: u.name,
            avatar: u.avatar || "",
            role: u.role === "admin" ? "Admin" : "Explorer",
            handle: `@${u.name.toLowerCase().replace(/\s+/g, "")}`,
            bio: u.bio || "",
            isFollowing: currentUserId && u.followers ? u.followers.some(id => id.toString() === currentUserId.toString()) : false,
        }));

        return res.status(200).json({
            success: true,
            data: transformed,
        });
    } catch (err) {
        next(err);
    }
};

const toggleFollowUser = async (req, res, next) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself.",
            });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!targetUser.followers) targetUser.followers = [];
        if (!currentUser.following) currentUser.following = [];

        const followerIndex = targetUser.followers.indexOf(currentUserId);
        let isFollowing = false;

        if (followerIndex > -1) {
            targetUser.followers.splice(followerIndex, 1);
            const followingIndex = currentUser.following.indexOf(targetUserId);
            if (followingIndex > -1) {
                currentUser.following.splice(followingIndex, 1);
            }
        } else {
            targetUser.followers.push(currentUserId);
            currentUser.following.push(targetUserId);
            isFollowing = true;
        }

        await targetUser.save();
        await currentUser.save();

        res.status(200).json({
            success: true,
            isFollowing,
            followersCount: targetUser.followers.length,
            followingCount: currentUser.following.length,
        });
    } catch (err) {
        next(err);
    }
};

const factCheckService = require("../services/factCheckService");

const factCheckPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        const result = await factCheckService.factCheckPost(postId);

        return res.status(200).json({
            success: true,
            data: {
                verdict: result.verdict,
                explanation: result.explanation,
                checkedBy: result.checkedBy,
                checkedAt: result.checkedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

const getComments = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const result = await communityService.getComments(postId);
        const currentUserId = req.user?.id || req.user?._id;
        const isAdmin = req.user?.role === "admin";
        
        const transformedComments = result.map(c => ({
            id: c._id,
            userId: c.author?._id,
            user: c.author?.name || "Explorer",
            avatar: c.author?.avatar || "",
            role: c.author?.role || "Explorer",
            text: c.text,
            timestamp: formatTimeAgo(c.createdAt),
            permissions: {
                canEdit: !!(currentUserId && c.author?._id && c.author._id.toString() === currentUserId.toString()),
                canDelete: !!(currentUserId && ((c.author?._id && c.author._id.toString() === currentUserId.toString()) || isAdmin))
            }
        }));
        
        return res.status(200).json({
            success: true,
            comments: transformedComments
        });
    } catch (err) {
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
    editComment,
    searchUsers,
    getSuggestedUsers,
    toggleFollowUser,
    factCheckPost,
    getComments,
};
