const express = require("express");

const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
    getDashboard,
    getTopicDetails,
    createTopic,
    createQuestion,
    getTopics,
    getTopicQuestions,
    startQuizSession,
    submitQuizSession,
    getDailyChallenge,
    startDailyChallenge,
    submitDailyChallenge
} = require("../controllers/quizcontroller");

router.get("/dashboard", protect, getDashboard);
router.get("/daily", protect, getDailyChallenge);
router.post("/daily/start", protect, startDailyChallenge);
router.post("/daily/submit", protect, submitDailyChallenge);
router.get("/topics", protect, getTopics);
router.post("/topics", protect, authorize("admin"), createTopic);
router.get("/topics/:slug", protect, getTopicDetails);
router.post(
    "/topics/:slug/questions",
    protect,
    authorize("admin"),
    createQuestion,
);
router.get(
    "/topics/:slug/questions",
    protect,
    authorize("admin"),
    getTopicQuestions
);
router.get("/topics/:slug/play", protect, startQuizSession);
router.post("/result", protect, submitQuizSession);

module.exports = router;
