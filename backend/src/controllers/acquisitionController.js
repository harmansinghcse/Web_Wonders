const acquisitionService = require("../acquisition/acquisitionService");

const startAcquisition = async (req, res, next) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: "Topic is required.",
            });
        }

        const result = await acquisitionService.startAcquisition(topic);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startAcquisition,
};
