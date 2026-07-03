const Dinosaur = require("../models/Dinosaur");

const getAllDinosaurs = async (req, res) => {
    const dinosaurs = await Dinosaur.find();

    res.json(dinosaurs);
};

const createDinosaur = async (req, res) => {
    console.log(req.body);
    const dinosaur = await Dinosaur.create(req.body);

    res.status(201).json(dinosaur);
};

const getDinosaurBySlug = async (req, res) => {
    const dinosaur = await Dinosaur.findOne({
        slug: req.params.slug,
    });

    res.json(dinosaur);
};

const updateDinosaur = async (req, res) => {
    const dinosaur = await Dinosaur.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true },
    );

    res.json(dinosaur);
};

const deleteDinosaur = async (req, res) => {
    const dinosaur = await Dinosaur.findOneAndDelete({ slug: req.params.slug });

    res.json({
        message: "Dinosaur deleted successfully",
        dinosaur,
    });
};

module.exports = {
    getAllDinosaurs,
    createDinosaur,
    getDinosaurBySlug,
    updateDinosaur,
    deleteDinosaur,
};
