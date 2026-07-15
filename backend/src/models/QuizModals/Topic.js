const mongoose = require("mongoose");
const slugify = require("slugify");

const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Topic title is required"],
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        bannerImage: {
            type: String,
            default: "",
        },

        icon: {
            type: String,
            default: "",
        },

        estimatedTime: {
            type: Number,
            default: 10,
            min: 1,
        },

        order: {
            type: Number,
            default: 0,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

topicSchema.pre("save", function () {
    if (!this.slug) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
        });
    }
});

module.exports = mongoose.model("Topic", topicSchema);
