const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

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
router.post(
    "/",
    protect,
    (req, res, next) => {
        next();
    },
    upload.fields([
        { name: "heroBackground", maxCount: 1 },
        { name: "fossilImage", maxCount: 1 },
        { name: "featureImages", maxCount: 4 },
    ]),
    (req, res, next) => {
        next();
    },
    createDinosaur,
);
router.put("/:slug", updateDinosaur);
router.delete("/:slug", deleteDinosaur);

module.exports = router;
