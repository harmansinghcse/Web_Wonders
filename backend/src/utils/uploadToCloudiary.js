const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (file, folder = "dinosaurs") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);

                resolve(result);
            },
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

module.exports = uploadToCloudinary;
