const express = require("express");
const upload = require("../middleware/upload.js");

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
    res.status(200).json({
        success: true,
        url: req.file.path,
        public_id: req.file.filename,
    });
});

module.exports = router;
