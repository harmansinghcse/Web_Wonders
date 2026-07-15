const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    getAllDinosaurs,
    createDinosaur,
    getDinosaurBySlug,
    updateDinosaur,
    deleteDinosaur,
    searchDinosaurs,
    submitDinosaur,
    getMySubmissions,
    getPendingSubmissions,
    getSubmissionById,
    reviewSubmission,
} = require("../controllers/dinosaurController");

const router = express.Router();

router.get("/", getAllDinosaurs);
router.get("/search", searchDinosaurs);

// Submissions & Reviews (Must be before /:slug)
router.get("/my-submissions", protect, getMySubmissions);
router.get("/submissions", protect, authorize("admin"), getPendingSubmissions);
router.get("/submissions/:id", protect, authorize("admin"), getSubmissionById);
router.put("/submissions/:id/review", protect, authorize("admin"), reviewSubmission);

router.post(
    "/submit",
    protect,
    upload.fields([
        { name: "heroBackground", maxCount: 1 },
        { name: "fossilImage", maxCount: 1 },
        { name: "featureImages", maxCount: 4 },
    ]),
    submitDinosaur,
);

router.get("/:slug", getDinosaurBySlug);

router.post(
    "/",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "heroBackground", maxCount: 1 },
        { name: "fossilImage", maxCount: 1 },
        { name: "featureImages", maxCount: 4 },
    ]),
    createDinosaur,
);
router.put("/:slug", protect, authorize("admin"), updateDinosaur);
router.delete("/:slug", protect, authorize("admin"), deleteDinosaur);

module.exports = router;
