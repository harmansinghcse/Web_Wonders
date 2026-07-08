const mongoose = require("mongoose");

const dinosaurSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    scientificName: {
      type: String,
      required: true,
    },

    // Images
    images: {
      heroBackground: {
        type: String,
        required: true,
      },
    },

    // Hero Section
    hero: {
      tagLine: String,
      title: String,
      highlightedTitle: String,
      description: String,
    },

    // Quick Facts
    stats: {
      length: String,
      height: String,
      weight: String,
      diet: String,
      speed: String,
      lifespan: String,
      period: String,
      location: String,
    },

    // About
    about: {
      heading: String,

      paragraphs: [
        {
          type: String,
        },
      ],
    },

    // Fossil Record
    fossil: {
      firstDiscovered: String,

      discoveredBy: String,

      locations: [
        {
          type: String,
        },
      ],

      significance: String,

      image: String,
    },

    // Physical Features
    physicalFeatures: {
      features: [
        {
          title: String,

          description: String,

          image: String,
        },
      ],
    },

    // Timeline
    timeline: {
      period: String,

      livedFrom: String,

      livedTo: String,

      extinction: String,
    },

    // Hunting
    hunting: {
      huntingStyle: String,

      strategy: String,

      prey: [
        {
          type: String,
        },
      ],

      traits: [
        {
          icon: String,

          title: String,

          description: String,
        },
      ],
    },

        // Diet
        diet: {
      category: {
        type: String,
      },

      description: {
        type: String,
      },

      favoriteFood: [
        {
          type: String,
        },
      ],

      facts: [
        {
          title: {
            type: String,
          },

          value: {
            type: String,
          },
        },
      ],

      image: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dinosaur", dinosaurSchema);