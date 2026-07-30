const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    searchUsers,
    getSuggestedUsers,
} = require("../controllers/communityController");

const router = express.Router();

/**
 * Optional authentication middleware to populate req.user if a token is present
 * but still proceed as guest if no token is found.
 */
const optionalProtect = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
            req.user = user;
        }
    } catch (error) {
        // Silently catch and treat as guest
    }
    next();
};

const upload = require("../middleware/upload");

// User operations
router.get("/users/suggested", optionalProtect, getSuggestedUsers);
router.get("/users/search", optionalProtect, searchUsers);

// Feed retrieval (Guests welcome)
router.get("/posts", optionalProtect, getPosts);

// Post interactions (Authenticated)
router.post("/posts", protect, upload.single("image"), createPost);
router.put("/posts/:id", protect, upload.single("image"), updatePost);
router.delete("/posts/:id", protect, deletePost);

// Like system (Authenticated)
router.post("/posts/:id/like", protect, likePost);

// Comment system (Authenticated)
router.post("/posts/:id/comment", protect, addComment);
router.post("/posts/:id/comments", protect, addComment); // support plural endpoint
router.delete("/posts/:postId/comments/:commentId", protect, deleteComment);

module.exports = router;
