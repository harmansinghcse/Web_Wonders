const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateOTP, getOTPExpiry } = require("../utils/otp");

const { sendOTPEmail } = require("../services/email_service");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Check if a pending registration already exists
        const pendingUser = await PendingUser.findOne({ email });

        if (pendingUser) {
            await PendingUser.deleteOne({ email });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP and expiry
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();

        // Create pending user
        await PendingUser.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully. Please verify your email.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required.",
            });
        }

        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(404).json({
                success: false,
                message: "No pending registration found.",
            });
        }

        if (pendingUser.otpExpires < Date.now()) {
            await PendingUser.deleteOne({ email });

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please register again.",
            });
        }

        if (pendingUser.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,
        });

        await PendingUser.deleteOne({ email });

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or Password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or Password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        // change respone according to frontend design in future
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
            .status(200)
            .json({
                success: true,
                message: "Login Successful",
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP,
};
