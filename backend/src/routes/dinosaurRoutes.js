const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { dinosaurSchema } = require("../validations/dinosaurValidation");

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
    authorize("admin"),
    validate(dinosaurSchema),
    createDinosaur,
);
router.put("/:slug", protect, authorize("admin"), updateDinosaur);
router.delete("/:slug", protect, authorize("admin"), deleteDinosaur);

module.exports = router;
