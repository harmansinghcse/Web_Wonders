const express = require("express");
const router = express.Router();

const { chatWithRoss } = require("../controllers/rossController");

router.post("/chat", chatWithRoss);

module.exports = router;
