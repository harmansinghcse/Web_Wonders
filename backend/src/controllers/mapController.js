const Dinosaur = require("../models/Dinosaur");

// Detailed geologically accurate map dictionary keyed by dinosaur slug
const dinosaurMapData = {
    "tyrannosaurus-rex": {
        coordinates: [47.6062, -107.8217],
        formation: "Hell Creek Formation",
        country: "USA"
    },
    "triceratops": {
        coordinates: [43.0002, -107.5002],
        formation: "Lance Formation",
        country: "USA"
    },
    "brachiosaurus": {
        coordinates: [39.5501, -105.7821],
        formation: "Morrison Formation",
        country: "USA"
    },
    "ichthyosaurus": {
        coordinates: [50.7260, -2.9397],
        formation: "Blue Lias Formation",
        country: "United Kingdom"
    },
    "stegosaurus": {
        coordinates: [38.7490, -109.5680],
        formation: "Morrison Formation",
        country: "USA"
    },
    "halszkaraptor": {
        coordinates: [44.2000, 103.7000],
        formation: "Djadochta Formation",
        country: "Mongolia"
    },
    "microraptor": {
        coordinates: [41.5000, 120.3000],
        formation: "Jiufotang Formation",
        country: "China"
    },
    "liaoningosaurus": {
        coordinates: [41.6000, 120.4000],
        formation: "Yixian Formation",
        country: "China"
    },
    "carnotaurus": {
        coordinates: [-43.5000, -69.0000],
        formation: "La Colonia Formation",
        country: "Argentina"
    },
    "velociraptor": {
        coordinates: [44.0000, 103.5000],
        formation: "Djadochta Formation",
        country: "Mongolia"
    },
    "tapejara": {
        coordinates: [-7.2500, -39.5000],
        formation: "Santana Formation",
        country: "Brazil"
    },
    "coelophysis": {
        coordinates: [36.3350, -106.4633],
        formation: "Chinle Formation",
        country: "USA"
    },
    "rhamphorhynchus": {
        coordinates: [48.8956, 11.0000],
        formation: "Solnhofen Limestone",
        country: "Germany"
    },
    "mosasaurus": {
        coordinates: [50.8503, 5.6889],
        formation: "Maastricht Formation",
        country: "Netherlands"
    },
    "parasaurolophus": {
        coordinates: [37.4000, -111.8000],
        formation: "Kaiparowits Formation",
        country: "USA"
    },
    "dilophosaurus": {
        coordinates: [36.0000, -110.5000],
        formation: "Kayenta Formation",
        country: "USA"
    },
    "ankylosaurus": {
        coordinates: [47.5000, -107.0000],
        formation: "Hell Creek Formation",
        country: "USA"
    },
    "eoraptor": {
        coordinates: [-30.1667, -67.8333],
        formation: "Ischigualasto Formation",
        country: "Argentina"
    },
    "archaeopteryx": {
        coordinates: [48.9000, 11.1000],
        formation: "Solnhofen Limestone",
        country: "Germany"
    },
    "diplodocus": {
        coordinates: [44.0000, -107.0000],
        formation: "Morrison Formation",
        country: "USA"
    }
};

const getFallbackData = (dino) => {
    const locationStr = (dino.stats?.location || "").toLowerCase();
    const fossilLocs = (dino.fossil?.locations || []).join(" ").toLowerCase();
    
    let country = "Unknown Country";
    let formation = (dino.fossil?.locations && dino.fossil.locations.length > 0) 
        ? dino.fossil.locations[0] 
        : "Unknown Formation";

    // Clean up formation name if it's too long
    if (formation.includes(",")) {
        formation = formation.split(",")[0].trim();
    }

    // Determine country
    if (locationStr.includes("china") || fossilLocs.includes("china")) {
        country = "China";
    } else if (locationStr.includes("argentina") || fossilLocs.includes("argentina")) {
        country = "Argentina";
    } else if (locationStr.includes("mongolia") || fossilLocs.includes("mongolia")) {
        country = "Mongolia";
    } else if (locationStr.includes("brazil") || fossilLocs.includes("brazil")) {
        country = "Brazil";
    } else if (locationStr.includes("germany") || fossilLocs.includes("germany")) {
        country = "Germany";
    } else if (locationStr.includes("united kingdom") || locationStr.includes("england") || fossilLocs.includes("england") || fossilLocs.includes("uk")) {
        country = "United Kingdom";
    } else if (locationStr.includes("netherlands") || fossilLocs.includes("netherlands")) {
        country = "Netherlands";
    } else if (locationStr.includes("portugal") || fossilLocs.includes("portugal")) {
        country = "Portugal";
    } else if (locationStr.includes("canada") || fossilLocs.includes("canada")) {
        country = "Canada";
    } else if (locationStr.includes("usa") || locationStr.includes("united states") || locationStr.includes("america") || fossilLocs.includes("usa") || fossilLocs.includes("canada")) {
        country = "USA";
    }

    // Generate deterministic coordinate on land to scatter markers
    let coordinates = [0, 0];
    if (country === "China") {
        coordinates = [35.8617, 104.1954];
    } else if (country === "Argentina") {
        coordinates = [-38.4161, -63.6167];
    } else if (country === "Mongolia") {
        coordinates = [46.8625, 103.8467];
    } else if (country === "Brazil") {
        coordinates = [-14.2350, -51.9253];
    } else if (country === "Germany") {
        coordinates = [51.1657, 10.4515];
    } else if (country === "United Kingdom") {
        coordinates = [55.3781, -3.4360];
    } else if (country === "Netherlands") {
        coordinates = [52.1326, 5.2913];
    } else if (country === "USA" || country === "Canada") {
        coordinates = [40.0000, -100.0000];
    } else {
        coordinates = [20.0000, 0.0000];
    }

    // Add small hash-based jitter to disperse multiple dinosaurs in the same region
    let hash = 0;
    const name = dino.name || "";
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const jitterLat = ((Math.abs(hash) % 100) - 50) / 15; // +/- 3.3 degrees
    const jitterLng = ((Math.abs(hash * 31) % 100) - 50) / 15;
    
    return {
        coordinates: [coordinates[0] + jitterLat, coordinates[1] + jitterLng],
        formation,
        country
    };
};

const getMapMarkers = async (req, res, next) => {
    try {
        const dinosaurs = await Dinosaur.find({}, "name scientificName slug images.heroBackground stats.period stats.diet stats.location fossil.locations");

        const markers = dinosaurs.map(dino => {
            const mapped = dinosaurMapData[dino.slug];
            const meta = mapped || getFallbackData(dino);

            // Clean diet categories
            let diet = dino.stats?.diet || "Unknown";
            if (diet.toLowerCase().includes("herbi")) diet = "Herbivore";
            else if (diet.toLowerCase().includes("carni")) diet = "Carnivore";
            else if (diet.toLowerCase().includes("omni")) diet = "Omnivore";
            else if (diet.toLowerCase().includes("pisci")) diet = "Carnivore";

            // Clean period categories
            let period = dino.stats?.period || "Unknown";
            if (period.toLowerCase().includes("cretaceous")) period = "Cretaceous";
            else if (period.toLowerCase().includes("jurassic")) period = "Jurassic";
            else if (period.toLowerCase().includes("triassic")) period = "Triassic";

            return {
                id: dino._id,
                name: dino.name,
                scientificName: dino.scientificName || dino.name,
                slug: dino.slug,
                image: dino.images?.heroBackground || "",
                formation: meta.formation,
                country: meta.country,
                period,
                diet,
                coordinates: meta.coordinates
            };
        });

        res.status(200).json({
            success: true,
            data: markers
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMapMarkers
};
