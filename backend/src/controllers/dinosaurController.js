const Dinosaur = require("../models/Dinosaur");

// i know this getalldinosaur is ugly i will fix its readabilty later
const getAllDinosaurs = async (req, res, next) => {
    try {
        // pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // sorting
        const sortBy = req.query.sort;

        // filtering
        const filter = { ...req.query };

        const excludedFields = ["page", "limit", "sort"];

        excludedFields.forEach((field) => delete filter[field]);

        let queryString = JSON.stringify(filter);

        queryString = queryString.replace(
            /\b(gte|gt|lte|lt|in)\b/g,
            (match) => `$${match}`,
        );

        // const dinosaurs = await Dinosaur.find(filter).skip(skip).limit(limit);

        // build the query first rather then a chain of query like above
        let query = Dinosaur.find(JSON.parse(queryString));

        if (req.query.diet) {
            filter.diet = req.query.diet;
        }

        if (req.query.period) {
            filter.period = req.query.period;
        }

        if (req.query.name) {
            filter.name = {
                $regex: req.query.name,
                $options: "i",
            };
        }

        if (sortBy) {
            query = query.sort(sortBy);
        } else {
            query = query.sort("name");
        }

        // pagination
        query = query.skip(skip).limit(limit);

        const dinosaurs = await query;

        res.status(200).json({
            success: true,
            data: dinosaurs,
        });
    } catch (error) {
        next(error);
    }
};

const createDinosaur = async (req, res, next) => {
    try {
        const dinosaur = await Dinosaur.create(req.body);

        res.status(201).json({
            success: true,
            data: dinosaur,
        });
    } catch (error) {
        next(error);
    }
};

const getDinosaurBySlug = async (req, res, next) => {
    try {
        const dinosaur = await Dinosaur.findOne({
            slug: req.params.slug,
        });

        if (!dinosaur) {
            return res.status(404).json({
                success: false,
                message: "Dinosaur not found",
            });
        }

        res.status(200).json({
            success: true,
            data: dinosaur,
        });
    } catch (error) {
        next(error);
    }
};

const updateDinosaur = async (req, res, next) => {
    try {
        const dinosaur = await Dinosaur.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true },
        );

        if (!dinosaur) {
            return res.status(404).json({
                success: false,
                message: "Dinosaur not found",
            });
        }

        res.status(200).json({
            success: true,
            data: dinosaur,
        });
    } catch (error) {
        next(error);
    }
};

const deleteDinosaur = async (req, res, next) => {
    try {
        const dinosaur = await Dinosaur.findOneAndDelete({
            slug: req.params.slug,
        });

        if (!dinosaur) {
            return res.status(404).json({
                success: false,
                message: "Dinosaur not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Dinosaur deleted successfully",
            data: dinosaur,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDinosaurs,
    createDinosaur,
    getDinosaurBySlug,
    updateDinosaur,
    deleteDinosaur,
};
