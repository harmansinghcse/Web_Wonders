const mongoose = require("mongoose");
const User = require("../models/User");
const { getDashboard } = require("../services/quizServices");
require("dotenv").config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Find any user
        const user = await User.findOne({});
        if (!user) {
            console.log("No user found in the database. Please register a user first.");
            process.exit(0);
        }

        console.log(`Testing getDashboard for user: ${user.name} (${user._id})`);
        const dashboard = await getDashboard(user._id);
        console.log("Dashboard loaded successfully:", JSON.stringify(dashboard, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error in getDashboard:", err);
        process.exit(1);
    }
}

test();
