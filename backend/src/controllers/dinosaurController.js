const Dinosaur = require("../models/Dinosaur");
const DinosaurSubmission = require("../models/DinosaurSubmission");
const uploadToCloudinary = require("../utils/uploadToCloudiary");
const dinosaurService = require("../services/dinosaurService");

// i know this getalldinosaur is ugly i will fix its readabilty later
const getAllDinosaurs = async (req, res, next) => {
    try {
        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = req.query.sort || "name";

        // Build Filters
        const mongoFilters = {};

        if (req.query.period) {
            mongoFilters["stats.period"] = {
                $regex: req.query.period,
                $options: "i",
            };
        }

        if (req.query.diet) {
            mongoFilters["stats.diet"] = {
                $regex: req.query.diet,
                $options: "i",
            };
        }

        if (req.query.location) {
            mongoFilters["stats.location"] = {
                $regex: req.query.location,
                $options: "i",
            };
        }

        // Search
        if (req.query.search) {
            mongoFilters.$or = [
                {
                    name: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    "stats.period": {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    "stats.diet": {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    scientificName: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
            ];
        }

        // Query
        const dinosaurs = await Dinosaur.find(mongoFilters)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select("name slug images.heroBackground stats scientificName");

        // Pagination
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
        if (!dinosaur.images) dinosaur.images = {};
        dinosaur.images.heroBackground = heroImage.secure_url;

        // Upload Fossil Image
        const fossilImage = await uploadToCloudinary(req.files.fossilImage[0]);
        if (!dinosaur.fossil) dinosaur.fossil = {};
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
        let query = { slug: req.params.slug };
        if (req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: req.params.slug };
        }

        const dinosaur = await Dinosaur.findOne(query);

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
        const dinosaur = JSON.parse(req.body.dinosaur);
        const id = req.params.id;

        // Perform basic validations (reusing existing validation rule logic)
        if (!dinosaur.name) {
            return res.status(400).json({
                success: false,
                message: "Dinosaur name is required.",
            });
        }
        if (!dinosaur.scientificName) {
            return res.status(400).json({
                success: false,
                message: "Scientific name is required.",
            });
        }

        // Upload new images to Cloudinary if they are provided in files
        if (req.files?.heroBackground?.length > 0) {
            const heroImage = await uploadToCloudinary(req.files.heroBackground[0]);
            if (!dinosaur.images) dinosaur.images = {};
            dinosaur.images.heroBackground = heroImage.secure_url;
        }

        if (req.files?.fossilImage?.length > 0) {
            const fossilImage = await uploadToCloudinary(req.files.fossilImage[0]);
            if (!dinosaur.fossil) dinosaur.fossil = {};
            dinosaur.fossil.image = fossilImage.secure_url;
        }

        if (req.files?.featureImages?.length > 0) {
            let indices = [];
            if (req.body.featureImageIndices) {
                indices = Array.isArray(req.body.featureImageIndices)
                    ? req.body.featureImageIndices.map(Number)
                    : [Number(req.body.featureImageIndices)];
            }
            
            for (let i = 0; i < req.files.featureImages.length; i++) {
                const uploadedImage = await uploadToCloudinary(req.files.featureImages[i]);
                const targetIndex = indices[i];
                if (dinosaur.physicalFeatures?.features?.[targetIndex]) {
                    dinosaur.physicalFeatures.features[targetIndex].image = uploadedImage.secure_url;
                }
            }
        }

        const updated = await dinosaurService.updateDinosaur(id, dinosaur);

        return res.status(200).json({
            success: true,
            message: "Dinosaur updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Update Dinosaur Error:", error);
        next(error);
    }
};

const deleteDinosaur = async (req, res, next) => {
    try {
        const id = req.params.id;
        const dinosaur = await dinosaurService.deleteDinosaur(id);

        res.status(200).json({
            success: true,
            message: "Dinosaur deleted successfully",
            data: dinosaur,
        });
    } catch (error) {
        next(error);
    }
};

const submitDinosaur = async (req, res, next) => {
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

        // Upload Hero Background
        const heroImage = await uploadToCloudinary(req.files.heroBackground[0]);
        if (!dinosaur.images) dinosaur.images = {};
        dinosaur.images.heroBackground = heroImage.secure_url;

        // Upload Fossil Image
        const fossilImage = await uploadToCloudinary(req.files.fossilImage[0]);
        if (!dinosaur.fossil) dinosaur.fossil = {};
        dinosaur.fossil.image = fossilImage.secure_url;

        // Upload Physical Feature Images
        for (let i = 0; i < req.files.featureImages.length; i++) {
            const uploadedImage = await uploadToCloudinary(
                req.files.featureImages[i],
            );

            dinosaur.physicalFeatures.features[i].image =
                uploadedImage.secure_url;
        }

        const submission = await DinosaurSubmission.create({
            submittedBy: req.user.id,
            status: "pending",
            dinosaurData: dinosaur,
        });

        return res.status(201).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        console.error("Submit Dinosaur Error:", error);
        next(error);
    }
};

const getMySubmissions = async (req, res, next) => {
    try {
        const submissions = await DinosaurSubmission.find({
            submittedBy: req.user.id,
        }).sort("-createdAt");

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        next(error);
    }
};

const getPendingSubmissions = async (req, res, next) => {
    try {
        const submissions = await DinosaurSubmission.find()
            .populate("submittedBy", "name email")
            .sort("-createdAt");

        return res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        next(error);
    }
};

const getSubmissionById = async (req, res, next) => {
    try {
        const submission = await DinosaurSubmission.findById(req.params.id)
            .populate("submittedBy", "name email");

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        next(error);
    }
};

const reviewSubmission = async (req, res, next) => {
    try {
        const { status, feedback } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be approved or rejected",
            });
        }

        const submission = await DinosaurSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        if (status === "approved") {
            const existing = await Dinosaur.findOne({
                slug: submission.dinosaurData.slug,
            });

            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "A published dinosaur with this slug already exists.",
                });
            }

            await Dinosaur.create(submission.dinosaurData);
            submission.status = "approved";
            submission.feedback = feedback || "Approved and published!";
        } else {
            submission.status = "rejected";
            submission.feedback = feedback || "Changes requested.";
        }

        await submission.save();

        return res.status(200).json({
            success: true,
            message: `Submission was successfully ${status}.`,
            data: submission,
        });
    } catch (error) {
        next(error);
    }
};

const getUserSubmissions = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const submissions = await DinosaurSubmission.find({
            submittedBy: userId,
        }).sort("-createdAt");

        return res.status(200).json({
            success: true,
            data: submissions,
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
    submitDinosaur,
    getMySubmissions,
    getPendingSubmissions,
    getSubmissionById,
    reviewSubmission,
    getUserSubmissions,
};
