const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: `dinosaurs/${req.body.folder}`,
        public_id: req.body.public_id,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        overwrite: true,
        resource_type: "image",
    }),
});

const upload = multer({ storage });

module.exports = upload;
