const express = require("express");
const {
    registerUser,
    loginUser,
    verifyOTP,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);

module.exports = router;
