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
        const mongoFilters = JSON.parse(queryString);
        let query = Dinosaur.find(mongoFilters);

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

        // pagination metadata
        const totalDocuments = await Dinosaur.countDocuments(mongoFilters);
        const totalPages = Math.ceil(totalDocuments / limit);

        // execute query
        const dinosaurs = await query;

        res.status(200).json({
            success: true,
            page,
            limit,
            count: dinosaurs.length,
            totalDocuments,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            data: dinosaurs,
        });
    } catch (error) {
        next(error);
    }
};

const createDinosaur = async (req, res, next) => {
    try {
        console.log("Body:", req.body);
        console.log("Files:", req.files);
        const dinosaur = JSON.parse(req.body.dinosaur);

        console.log("Parsed dinosaur:", dinosaur);
        if (!req.files.heroBackground?.length) {
            return res.status(400).json({
                success: false,
                message: "Please upload a hero background image.",
            });
        }

        if (!req.files.fossilImage?.length) {
            return res.status(400).json({
                success: false,
                message: "Please upload a fossil image.",
            });
        }

        if (req.files.featureImages?.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "Please upload all 4 physical feature images.",
            });
        }

        const existing = await Dinosaur.findOne({
            slug: dinosaur.slug,
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "A dinosaur with this name already exists.",
            });
        }

        // Hero Background
        if (req.files.heroBackground?.length) {
            dinosaur.images.heroBackground = req.files.heroBackground[0].path;
        }

        // Fossil Image
        if (req.files.fossilImage?.length) {
            dinosaur.fossil.image = req.files.fossilImage[0].path;
        }

        // Physical Feature Images
        if (req.files.featureImages?.length) {
            req.files.featureImages.forEach((file, index) => {
                if (dinosaur.physicalFeatures.features[index]) {
                    dinosaur.physicalFeatures.features[index].image = file.path;
                }
            });
        }

        console.log("About to create...");
        const createdDinosaur = await Dinosaur.create(dinosaur);
        console.log("Created successfully");

        res.status(201).json({
            success: true,
            data: createdDinosaur,
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
            { new: true, runValidators: true },
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
