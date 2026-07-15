const Topic = require("../models/QuizModals/Topic");
const Question = require("../models/QuizModals/Questions");

exports.createQuestion = async (slug, data) => {
    const topic = await Topic.findOne({
        slug,
        isPublished: true,
    });

    if (!topic) {
        throw new Error("Topic not found.");
    }

    return await Question.create({
        topic: topic._id,
        difficulty: data.difficulty,
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        hint: data.hint,
        image: data.image,
        points: data.points,
    });
};


exports.getTopicQuestions = async (slug) => {
    const topic = await Topic.findOne({
        slug,
        isPublished: true,
    });

    if (!topic) {
        throw new Error("Topic not found.");
    }

    const questions = await Question.find({
        topic: topic._id,
    }).sort({
        difficulty: 1,
        createdAt: 1,
    });

    return questions;
};