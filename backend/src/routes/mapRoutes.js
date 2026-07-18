const express = require("express");
const { getMapMarkers } = require("../controllers/mapController");

const router = express.Router();

router.get("/markers", getMapMarkers);

module.exports = router;
