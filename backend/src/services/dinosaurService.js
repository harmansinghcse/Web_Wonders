const Dinosaur = require("../models/Dinosaur");

/**
 * Update a dinosaur by its Mongo ID
 * @param {string} id - Mongoose Object ID
 * @param {object} dinosaurData - Updated dinosaur payload
 * @returns {Promise<object>} - Updated dinosaur document
 */
const updateDinosaur = async (id, dinosaurData) => {
    // If the slug has been updated, check if it already exists on another dinosaur
    if (dinosaurData.slug) {
        const existing = await Dinosaur.findOne({
            slug: dinosaurData.slug,
            _id: { $ne: id },
        });

        if (existing) {
            throw new Error("A dinosaur with this name/slug already exists.");
        }
    }

    const dinosaur = await Dinosaur.findByIdAndUpdate(
        id,
        dinosaurData,
        { new: true, runValidators: true },
    );

    if (!dinosaur) {
        throw new Error("Dinosaur not found.");
    }

    return dinosaur;
};

/**
 * Delete a dinosaur by its Mongo ID
 * @param {string} id - Mongoose Object ID
 * @returns {Promise<object>} - Deleted dinosaur document
 */
const deleteDinosaur = async (id) => {
    const dinosaur = await Dinosaur.findByIdAndDelete(id);

    if (!dinosaur) {
        throw new Error("Dinosaur not found.");
    }

    return dinosaur;
};

module.exports = {
    updateDinosaur,
    deleteDinosaur,
};
