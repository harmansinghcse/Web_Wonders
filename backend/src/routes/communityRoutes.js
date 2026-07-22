const express = require("express");
const {
    getPosts,
    createPost,
    likePost,
    addComment,
} = require("../controllers/communityController");

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.post("/posts/:id/like", likePost);
router.post("/posts/:id/comment", addComment);

module.exports = router;
