const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    getAllDinosaurs,
    createDinosaur,
    getDinosaurBySlug,
    updateDinosaur,
    deleteDinosaur,
} = require("../controllers/dinosaurController");

const router = express.Router();

router.get("/", getAllDinosaurs);
router.get("/:slug", getDinosaurBySlug);
router.post("/", protect, createDinosaur);
router.put("/:slug", updateDinosaur);
router.delete("/:slug", deleteDinosaur);

module.exports = router;
