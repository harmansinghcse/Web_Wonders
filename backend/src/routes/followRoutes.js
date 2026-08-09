const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    followUser,
    unfollowUser,
    getFollowStatus,
    getFollowers,
    getFollowing,
    getSuggestedExplorers,
    searchUsers,
    getUserProfile,
    getNotifications,
    markNotificationsRead,
    getUnreadCounts,
} = require("../controllers/followController");

const router = express.Router();

// User Profiles & Actions
router.get("/suggested", protect, getSuggestedExplorers);
router.get("/search", protect, searchUsers);
router.get("/notifications/unread-count", protect, getUnreadCounts);
router.get("/notifications", protect, getNotifications);
router.post("/notifications/read", protect, markNotificationsRead);

router.get("/:id/profile", protect, getUserProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.get("/:id/follow-status", protect, getFollowStatus);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);

module.exports = router;
