const express = require("express");

const router = express.Router();

const acquisitionController = require("../controllers/acquisitionController");

router.post("/start", acquisitionController.startAcquisition);

module.exports = router;
