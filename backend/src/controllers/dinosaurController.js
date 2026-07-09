const Dinosaur = require("../models/Dinosaur");
const uploadToCloudinary = require("../utils/uploadToCloudiary");

// i know this getalldinosaur is ugly i will fix its readabilty later
const getAllDinosaurs = async (req, res, next) => {
    try {
        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = req.query.sort;

        // Filtering
        const filter = { ...req.query };

        const excludedFields = ["page", "limit", "sort"];
        excludedFields.forEach((field) => delete filter[field]);

        let queryString = JSON.stringify(filter);

        queryString = queryString.replace(
            /\b(gte|gt|lte|lt|in)\b/g,
            (match) => `$${match}`,
        );

        const mongoFilters = JSON.parse(queryString);

        // Name search
        if (req.query.search) {
            mongoFilters.$or = [
                { name: { $regex: req.query.search, $options: "i" } },
                { period: { $regex: req.query.search, $options: "i" } },
                { diet: { $regex: req.query.search, $options: "i" } },
            ];
        }

        // Build query
        let query = Dinosaur.find(mongoFilters);

        // Sorting
        if (sortBy) {
            query = query.sort(sortBy);
        } else {
            query = query.sort("name");
        }

        // Pagination
        query = query.skip(skip).limit(limit);

        // Execute query
        const dinosaurs = await query;

        // Pagination metadata
        const totalDocuments = await Dinosaur.countDocuments(mongoFilters);
        const totalPages = Math.ceil(totalDocuments / limit);

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

const searchDinosaurs = async (req, res, next) => {
    try {
        const query = req.query.query?.trim();

        if (!query) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        const dinosaurs = await Dinosaur.find({
            name: {
                $regex: query,
                $options: "i",
            },
        })
            .select(
                "name slug scientificName images.heroBackground timeline.period",
            )
            .sort("name")
            .limit(5);

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
        const dinosaur = JSON.parse(req.body.dinosaur);

        if (!req.files?.heroBackground?.length) {
            return res.status(400).json({
                success: false,
                message: "Please upload a hero background image.",
            });
        }

        if (!req.files?.fossilImage?.length) {
            return res.status(400).json({
                success: false,
                message: "Please upload a fossil image.",
            });
        }

        if (req.files?.featureImages?.length !== 4) {
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

        // Upload Hero Background
        const heroImage = await uploadToCloudinary(req.files.heroBackground[0]);
        dinosaur.images.heroBackground = heroImage.secure_url;

        // Upload Fossil Image
        const fossilImage = await uploadToCloudinary(req.files.fossilImage[0]);
        dinosaur.fossil.image = fossilImage.secure_url;

        // Upload Physical Feature Images
        for (let i = 0; i < req.files.featureImages.length; i++) {
            const uploadedImage = await uploadToCloudinary(
                req.files.featureImages[i],
            );

            dinosaur.physicalFeatures.features[i].image =
                uploadedImage.secure_url;
        }

        const createdDinosaur = await Dinosaur.create(dinosaur);

        return res.status(201).json({
            success: true,
            data: createdDinosaur,
        });
    } catch (error) {
        console.error("Create Dinosaur Error:", error);
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
    searchDinosaurs,
};
