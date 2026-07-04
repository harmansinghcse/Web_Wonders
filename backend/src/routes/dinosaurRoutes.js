const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");
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
router.post("/", protect, authorize("admin"), createDinosaur);
router.put("/:slug", protect, authorize("admin"), updateDinosaur);
router.delete("/:slug", protect, authorize("admin"), deleteDinosaur);

module.exports = router;
