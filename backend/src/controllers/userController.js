const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            ...req.body,
            password: hashedPassword,
        };

        const user = await User.create(userData);

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { registerUser };
