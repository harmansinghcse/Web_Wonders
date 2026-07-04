const mongoose = require("mongoose");
const Dinosaur = require("../models/Dinosaur");
require("dotenv").config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB");

        const response = await fetch(
            "https://dinosaur-facts-api.shultzlab.com/dinosaurs",
        );

        const apiData = await response.json();

        const dinosaurs = apiData.map((dino) => ({
            name: dino.Name,
            description: dino.Description,

            slug: dino.Name.toLowerCase().replace(/\s+/g, "-"),

            // Temporary values for test purposes
            diet: ["Carnivore", "Herbivore", "Omnivore"][
                Math.floor(Math.random() * 3)
            ],

            period: ["Triassic", "Jurassic", "Cretaceous"][
                Math.floor(Math.random() * 3)
            ],

            height: Math.floor(Math.random() * 20) + 1,

            weight: Math.floor(Math.random() * 10000) + 500,
        }));

        console.log(dinosaurs[0]);
        await Dinosaur.deleteMany();

        await Dinosaur.insertMany(dinosaurs);

        console.log(`Inserted ${dinosaurs.length} dinosaurs`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedDatabase();
