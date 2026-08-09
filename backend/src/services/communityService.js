const Post = require("../models/Post");
const User = require("../models/User");

/**
 * Fetch paginated community posts feed
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Promise<object>} - Paginated posts and count
 */
const getPosts = async (page = 1, limit = 10, queryOptions = {}) => {
    const { authorIds, postType, dinosaurId, tag, sort = "newest", feedMode = "explore" } = queryOptions;
    
    let query = {};
    
    if (authorIds) {
        query.author = { $in: authorIds };
    }
    
    if (postType && postType !== "all") {
        if (postType === "image") {
            query.type = { $in: ["photo", "hybrid"] };
        } else {
            query.postType = postType;
        }
    }
    
    if (dinosaurId) {
        query.dinosaur = dinosaurId;
    }
    
    if (tag) {
        query.tags = { $in: [new RegExp(tag, "i")] };
    }
    
    const skip = (page - 1) * limit;
    
    if (sort === "popular" || sort === "most_discussed" || sort === "most_liked" || feedMode === "trending") {
        // Aggregate to calculate score/likesCount/commentsCount dynamically for sorting
        const total = await Post.countDocuments(query);
        
        let sortStage = { score: -1, createdAt: -1 };
        if (sort === "most_discussed") {
            sortStage = { commentsCount: -1, createdAt: -1 };
        } else if (sort === "most_liked") {
            sortStage = { likesCount: -1, createdAt: -1 };
        }

        const pipeline = [
            { $match: query },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    commentsCount: { $size: { $ifNull: ["$comments", []] } },
                    score: {
                        $add: [
                            { $size: { $ifNull: ["$likes", []] } },
                            { $size: { $ifNull: ["$comments", []] } }
                        ]
                    }
                }
            },
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
        ];
        
        const posts = await Post.aggregate(pipeline);
        const populatedPosts = await Post.populate(posts, [
            { path: "author", select: "name avatar role" },
            { path: "comments.author", select: "name avatar role" },
            { path: "dinosaur", select: "name slug images" }
        ]);
        
        return {
            posts: populatedPosts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    
    let sortOptions = { createdAt: -1 };
    if (sort === "oldest") {
        sortOptions = { createdAt: 1 };
    }
    
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate("author", "name avatar role")
        .populate("comments.author", "name avatar role")
        .populate("dinosaur", "name slug images")
        .lean();
        
    return {
        posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

/**
 * Create a new post
 * @param {string} authorId - Logged-in user ID
 * @param {object} postData - Post details
 * @returns {Promise<object>} - Created post document
 */
const createPost = async (authorId, postData) => {
    const post = await Post.create({
        ...postData,
        author: authorId,
        likes: [],
        comments: [],
    });

    const populated = await Post.findById(post._id)
        .populate("author", "name avatar role")
        .populate("dinosaur", "name slug images")
        .lean();

    return populated;
};

/**
 * Update an existing post (ownership validated)
 * @param {string} postId - Post ID
 * @param {string} userId - Requesting user ID
 * @param {object} postData - Updated fields
 * @returns {Promise<object>} - Updated post document
 */
const updatePost = async (postId, userId, postData) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found.");
    }

    if (post.author.toString() !== userId) {
        throw new Error("Unauthorized to edit this post.");
    }

    // Update fields allowed to change
    post.title = postData.title || post.title;
    post.description = postData.description || post.description;
    post.image = postData.image !== undefined ? postData.image : post.image;
    post.category = postData.category || post.category;
    post.type = postData.type || post.type;
    post.tags = postData.tags || post.tags;
    
    if (postData.postType) {
        post.postType = postData.postType;
    }
    if (postData.dinosaur !== undefined) {
        post.dinosaur = postData.dinosaur || null;
    }
    
    if (postData.stats) {
        post.stats = postData.stats;
    }

    await post.save();

    // Invalidate fact-check since post has been edited
    const FactCheck = require("../models/FactCheck");
    await FactCheck.deleteOne({ post: postId });

    const populated = await Post.findById(post._id)
        .populate("author", "name avatar role")
        .populate("comments.author", "name avatar role")
        .populate("dinosaur", "name slug images")
        .lean();

    return populated;
};

/**
 * Delete a post (ownership or admin status validated)
 * @param {string} postId - Post ID
 * @param {string} userId - Requesting user ID
 * @param {boolean} isAdmin - Whether requesting user is an admin
 * @returns {Promise<object>} - Deleted post document
 */
const deletePost = async (postId, userId, isAdmin) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found.");
    }

    if (post.author.toString() !== userId && !isAdmin) {
        throw new Error("Unauthorized to delete this post.");
    }

    await Post.findByIdAndDelete(postId);
    return post;
};

/**
 * Toggle liking / unliking a post
 * @param {string} postId - Post ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Updated likes array and liked status
 */
const toggleLike = async (postId, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found.");
    }

    const likeIndex = post.likes.indexOf(userId);
    let isLiked = false;

    if (likeIndex > -1) {
        // Already liked, remove like
        post.likes.splice(likeIndex, 1);
    } else {
        // Add like
        post.likes.push(userId);
        isLiked = true;
    }

    await post.save();
    return {
        likesCount: post.likes.length,
        isLiked,
        likes: post.likes,
    };
};

/**
 * Add a comment to a post
 * @param {string} postId - Post ID
 * @param {string} userId - Author of comment
 * @param {string} text - Comment content
 * @returns {Promise<object>} - The newly added comment and total comments count
 */
const addComment = async (postId, userId, text) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found.");
    }

    post.comments.push({
        author: userId,
        text,
    });

    await post.save();

    // Populate comments to retrieve author fields
    const updatedPost = await Post.findById(postId)
        .populate("comments.author", "name avatar role")
        .lean();

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    return {
        comment: newComment,
        comments: updatedPost.comments,
        commentsCount: updatedPost.comments.length,
    };
};

/**
 * Delete a comment from a post (ownership or admin status validated)
 * @param {string} postId - Post ID
 * @param {string} commentId - Comment ID
 * @param {string} userId - Requesting user ID
 * @param {boolean} isAdmin - Whether requesting user is an admin
 * @returns {Promise<object>} - Updated comments list
 */
const deleteComment = async (postId, commentId, userId, isAdmin) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found.");
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
        throw new Error("Comment not found.");
    }

    if (comment.author.toString() !== userId && !isAdmin) {
        throw new Error("Unauthorized to delete this comment.");
    }

    comment.deleteOne();
    await post.save();

    const populated = await Post.findById(postId)
        .populate("comments.author", "name avatar role")
        .lean();

    return {
        comments: populated.comments,
        commentsCount: populated.comments.length,
    };
};

/**
 * Edit a comment on a post (ownership validated)
 */
const editComment = async (postId, commentId, userId, text) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error("Post not found.");
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
        throw new Error("Comment not found.");
    }

    if (comment.author.toString() !== userId) {
        throw new Error("Unauthorized to edit this comment.");
    }

    comment.text = text;
    await post.save();

    const populated = await Post.findById(postId)
        .populate("comments.author", "name avatar role")
        .lean();

    return {
        comments: populated.comments,
        commentsCount: populated.comments.length,
    };
};

/**
 * Search users by name
 */
const searchUsers = async (query, excludeUserId) => {
    if (!query || !query.trim()) return [];
    const filter = { name: { $regex: new RegExp(query.trim(), "i") } };
    if (excludeUserId) {
        filter._id = { $ne: excludeUserId };
    }
    return await User.find(filter).select("name avatar role followers following bio").limit(10).lean();
};

/**
 * Get suggested explorers list
 */
const getSuggestedUsers = async (excludeUserId) => {
    const filter = excludeUserId ? { _id: { $ne: excludeUserId } } : {};
    return await User.find(filter).select("name avatar role followers following bio").limit(5).lean();
};

module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
    editComment,
    searchUsers,
    getSuggestedUsers,
};
