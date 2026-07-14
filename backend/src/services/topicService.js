const Topic = require("../models/QuizModals/Topic");

/**
 * Create a new quiz topic
 */
exports.createTopic = async (data) => {
    const existingTopic = await Topic.findOne({
        title: data.title.trim(),
    });

    if (existingTopic) {
        throw new Error("Topic already exists.");
    }

    const topic = await Topic.create({
        title: data.title,
        description: data.description,
        bannerImage: data.bannerImage || "",
        icon: data.icon || "",
        estimatedTime: data.estimatedTime || 10,
        order: data.order || 0,
    });

    return topic;
};

/**
 * Get all published topics
 */
exports.getTopics = async () => {
    return await Topic.find({ isPublished: true })
        .sort({ order: 1, title: 1 })
        .select("title slug description bannerImage icon estimatedTime order");
};

/**
 * Get a single topic by slug
 */
exports.getTopicBySlug = async (slug) => {
    const topic = await Topic.findOne({
        slug,
        isPublished: true,
    });

    if (!topic) {
        throw new Error("Topic not found.");
    }

    return topic;
};

/**
 * Update a topic
 */
exports.updateTopic = async (slug, data) => {
    const topic = await Topic.findOneAndUpdate({ slug }, data, {
        new: true,
        runValidators: true,
    });

    if (!topic) {
        throw new Error("Topic not found.");
    }

    return topic;
};

/**
 * Delete a topic
 */
exports.deleteTopic = async (slug) => {
    const topic = await Topic.findOneAndDelete({
        slug,
    });

    if (!topic) {
        throw new Error("Topic not found.");
    }

    return topic;
};

exports.getTopics = async () => {
    return await Topic.find({
        isPublished: true,
    })
        .sort({
            order: 1,
            title: 1,
        })
        .select("title slug description bannerImage icon estimatedTime order");
};
