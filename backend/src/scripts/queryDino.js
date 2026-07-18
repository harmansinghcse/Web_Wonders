const mongoose = require("mongoose");
const Dinosaur = require("../models/Dinosaur");
require("dotenv").config();

async function checkDino() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const dinos = await Dinosaur.find({}, "name slug stats.location fossil.locations stats.period stats.diet");
        console.log(JSON.stringify(dinos, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkDino();
