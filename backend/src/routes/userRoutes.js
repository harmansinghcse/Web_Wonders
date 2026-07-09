const express = require("express");
const {
    registerUser,
    loginUser,
    verifyOTP,
    getCurrentUser,
    logoutUser,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logoutUser);

module.exports = router;
