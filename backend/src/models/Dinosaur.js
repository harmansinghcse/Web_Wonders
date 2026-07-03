const mongoose = require("mongoose");

const dinosaurSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    scientificName: {
        type: String,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    period: {
        type: String,
        required: true,
    },

    diet: {
        type: String,
        enum: ["Carnivore", "Herbivore", "Omnivore"],
    },

    description: {
        type: String,
    },

    image: {
        type: String,
    },

    length: Number,
    height: Number,
    weight: Number,

    locationFound: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Dinosaur", dinosaurSchema);
