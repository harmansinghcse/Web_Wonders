const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: "dinosaurs",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image",
    }),
});

const upload = multer({ storage });

module.exports = upload;
