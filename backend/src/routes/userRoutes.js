const express = require("express");
const { registerUser } = require("../controllers/userController");
const { loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
