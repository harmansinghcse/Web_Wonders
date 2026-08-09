const User = require("../models/User");
const Follow = require("../models/Follow");
const Notification = require("../models/Notification");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Follow a user
const followUser = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user._id;

        if (targetId === currentUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself.",
            });
        }

        const targetUser = await User.findById(targetId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Try to create follow relationship. Handled atomically/safely.
        const existing = await Follow.findOne({ follower: currentUserId, following: targetId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You are already following this explorer.",
            });
        }

        await Follow.create({ follower: currentUserId, following: targetId });

        // Trigger notification
        await Notification.create({
            recipient: targetId,
            sender: currentUserId,
            type: "follow",
        });

        return res.status(200).json({
            success: true,
            message: "Successfully followed explorer.",
            following: true,
        });
    } catch (err) {
        next(err);
    }
};

// Unfollow a user
const unfollowUser = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user._id;

        const result = await Follow.deleteOne({ follower: currentUserId, following: targetId });

        if (result.deletedCount === 0) {
            return res.status(400).json({
                success: false,
                message: "You are not following this explorer.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully unfollowed explorer.",
            following: false,
        });
    } catch (err) {
        next(err);
    }
};

// Check if currently following
const getFollowStatus = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user._id;

        const record = await Follow.findOne({ follower: currentUserId, following: targetId });
        return res.status(200).json({
            success: true,
            following: !!record,
        });
    } catch (err) {
        next(err);
    }
};

// Get followers
const getFollowers = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user?.id;

        const follows = await Follow.find({ following: targetId }).populate("follower", "name avatar role");
        
        const myFollowing = currentUserId
            ? await Follow.find({ follower: currentUserId }).distinct("following")
            : [];

        const data = follows.map(f => {
            const u = f.follower;
            if (!u) return null;
            return {
                id: u._id,
                name: u.name,
                avatar: u.avatar || "",
                role: u.role || "Explorer",
                handle: `@${u.name.toLowerCase().replace(/\s+/g, "_")}`,
                isFollowing: myFollowing.some(id => id.toString() === u._id.toString()),
            };
        }).filter(Boolean);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

// Get following list
const getFollowing = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user?.id;

        const follows = await Follow.find({ follower: targetId }).populate("following", "name avatar role");
        
        const myFollowing = currentUserId
            ? await Follow.find({ follower: currentUserId }).distinct("following")
            : [];

        const data = follows.map(f => {
            const u = f.following;
            if (!u) return null;
            return {
                id: u._id,
                name: u.name,
                avatar: u.avatar || "",
                role: u.role || "Explorer",
                handle: `@${u.name.toLowerCase().replace(/\s+/g, "_")}`,
                isFollowing: myFollowing.some(id => id.toString() === u._id.toString()),
            };
        }).filter(Boolean);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

// Get Suggested Explorers
const getSuggestedExplorers = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;

        // Get people I follow
        const myFollowing = await Follow.find({ follower: currentUserId }).distinct("following");

        // Suggest people I don't follow, excluding myself
        const suggestions = await User.find({
            _id: { $ne: currentUserId, $nin: myFollowing }
        }).limit(6).select("name avatar role");

        const data = await Promise.all(suggestions.map(async (u) => {
            // Find mutual followers (people I follow who follow this user)
            const mutual = await Follow.find({
                follower: { $in: myFollowing },
                following: u._id
            }).populate("follower", "name");

            const mutualNames = mutual.map(m => m.follower?.name).filter(Boolean);

            let mutualText = "";
            if (mutualNames.length > 0) {
                if (mutualNames.length === 1) {
                    mutualText = `Followed by ${mutualNames[0]}`;
                } else if (mutualNames.length === 2) {
                    mutualText = `Followed by ${mutualNames[0]} and ${mutualNames[1]}`;
                } else {
                    mutualText = `Followed by ${mutualNames[0]} and ${mutualNames.length - 1} others you know`;
                }
            }

            return {
                id: u._id,
                name: u.name,
                avatar: u.avatar || "",
                role: u.role || "Explorer",
                handle: `@${u.name.toLowerCase().replace(/\s+/g, "_")}`,
                mutualText,
                isFollowing: false,
            };
        }));

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

// Search users
const searchUsers = async (req, res, next) => {
    try {
        const query = req.query.q || "";
        if (!query.trim()) {
            return res.status(200).json({ success: true, data: [] });
        }

        const currentUserId = req.user?.id;
        const myFollowing = currentUserId
            ? await Follow.find({ follower: currentUserId }).distinct("following")
            : [];

        const users = await User.find({
            name: { $regex: query, $options: "i" }
        }).limit(10).select("name avatar role");

        const data = users.map(u => ({
            id: u._id,
            name: u.name,
            avatar: u.avatar || "",
            role: u.role || "Explorer",
            handle: `@${u.name.toLowerCase().replace(/\s+/g, "_")}`,
            isFollowing: myFollowing.some(id => id.toString() === u._id.toString()),
        }));

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

// Get profile details
const getUserProfile = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user?.id;

        const targetUser = await User.findById(targetId).select("name avatar role bio score achievementsUnlocked");
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "Explorer profile not found.",
            });
        }

        const followersCount = await Follow.countDocuments({ following: targetId });
        const followingCount = await Follow.countDocuments({ follower: targetId });
        
        let isFollowing = false;
        let mutualText = "";

        if (currentUserId) {
            const followRecord = await Follow.findOne({ follower: currentUserId, following: targetId });
            isFollowing = !!followRecord;

            // Compute mutual followers
            const myFollowing = await Follow.find({ follower: currentUserId }).distinct("following");
            const mutual = await Follow.find({
                follower: { $in: myFollowing },
                following: targetId
            }).populate("follower", "name");

            const mutualNames = mutual.map(m => m.follower?.name).filter(Boolean);
            if (mutualNames.length > 0) {
                if (mutualNames.length === 1) {
                    mutualText = `Followed by ${mutualNames[0]}`;
                } else if (mutualNames.length === 2) {
                    mutualText = `Followed by ${mutualNames[0]} and ${mutualNames[1]}`;
                } else {
                    mutualText = `Followed by ${mutualNames[0]} and ${mutualNames.length - 1} others you follow`;
                }
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                id: targetUser._id,
                name: targetUser.name,
                avatar: targetUser.avatar || "",
                role: targetUser.role || "Explorer",
                handle: `@${targetUser.name.toLowerCase().replace(/\s+/g, "_")}`,
                bio: targetUser.bio || "",
                score: targetUser.score || 0,
                achievementsUnlocked: targetUser.achievementsUnlocked || 0,
                followersCount,
                followingCount,
                isFollowing,
                mutualText,
            }
        });
    } catch (err) {
        next(err);
    }
};

// Fetch recipient's notifications
const getNotifications = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const notifications = await Notification.find({ recipient: currentUserId })
            .populate("sender", "name avatar")
            .sort({ createdAt: -1 })
            .limit(40);

        const data = notifications.map(n => ({
            id: n._id,
            user: n.sender?.name || "Explorer",
            senderId: n.sender?._id || "",
            userAvatar: n.sender?.avatar || "",
            text: n.type === "follow" ? "started following you" : n.type === "like" ? "liked your post" : `commented: "${n.comment || "on your post"}"`,
            timeAgo: formatTimeAgo(n.createdAt),
            type: n.type,
            isUnread: n.isUnread,
            postId: n.post,
            commentId: n.commentId,
        }));

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

// Helper function to format timestamp
const formatTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
    return "Just now";
};

// Mark notifications read
const markNotificationsRead = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        await Notification.updateMany({ recipient: currentUserId, isUnread: true }, { isUnread: false });
        return res.status(200).json({
            success: true,
            message: "All notifications marked read.",
        });
    } catch (err) {
        next(err);
    }
};

const getUnreadCounts = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;

        const unreadNotifications = await Notification.countDocuments({
            recipient: currentUserId,
            isUnread: true,
        });

        const userConversations = await Conversation.find({
            participants: currentUserId,
        }).distinct("_id");

        const unreadMessages = await Message.countDocuments({
            conversation: { $in: userConversations },
            sender: { $ne: currentUserId },
            readAt: null,
        });

        return res.status(200).json({
            success: true,
            unreadNotifications,
            unreadMessages,
            totalCount: unreadNotifications + unreadMessages,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
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
};

