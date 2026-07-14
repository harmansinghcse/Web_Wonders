const quizService = require("../services/quizServices");
const questionService = require("../services/questionServices");
const topicService = require("../services/topicService");


exports.getDashboard = async (req, res, next) => {
    try {
        const dashboard = await quizService.getDashboard(req.user.id);

        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTopicDetails = async (req, res, next) => {
    try {
        const topic = await quizService.getTopicDetails(
            req.user.id,
            req.params.slug,
        );

        res.status(200).json({
            success: true,
            data: topic,
        });
    } catch (error) {
        next(error);
    }
};

exports.createTopic = async (req, res, next) => {
    try {
        const topic = await topicService.createTopic(req.body);

        return res.status(201).json({
            success: true,
            data: topic,
        });
    } catch (error) {
        return next(error);
    }
};

exports.createQuestion = async (req, res, next) => {
    try {
        const question = await questionService.createQuestion(
            req.params.slug,
            req.body,
        );

        res.status(201).json({
            success: true,
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTopics = async (req, res, next) => {
    try {
        const topics = await topicService.getTopics();

        res.status(200).json({
            success: true,
            data: topics,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTopicQuestions = async (req, res, next) => {
    try {
        const questions = await questionService.getTopicQuestions(
            req.params.slug
        );

        res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        next(error);
    }
};

exports.startQuizSession = async (req, res, next) => {
    try {
        const sessionData = await quizService.startSession(
            req.user.id,
            req.params.slug,
            req.query.difficulty
        );

        res.status(200).json({
            success: true,
            data: sessionData,
        });
    } catch (error) {
        next(error);
    }
};

exports.submitQuizSession = async (req, res, next) => {
    try {
        const result = await quizService.submitSession(
            req.user.id,
            req.body.sessionId,
            req.body.answers
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
