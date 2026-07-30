const express = require("express");

const {
    getProfile,
    updateProfile,
    getProfileById,
} = require("../controllers/profile.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getProfile);
router.get("/:id", getProfileById);

router.patch("/", protect, updateProfile);

module.exports = router;
