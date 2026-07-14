const mongoose = require("mongoose");

const dinosaurSubmissionSchema = new mongoose.Schema(
    {
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        feedback: {
            type: String,
            default: "",
        },
        dinosaurData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("DinosaurSubmission", dinosaurSubmissionSchema);
