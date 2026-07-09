const User = require("../models/User");

// GET /api/profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            profile: user,
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, bio, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
};
