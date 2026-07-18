/**
 * Independent Geolocation and Paleontological Bio service layer.
 * Manages reverse geocoding via OpenStreetMap Nominatim and handles local cache resolution.
 */

// Cache storing geocoded results key: "lat,lng" value: geocoded report
const locationCache = new Map();

// High-quality paleontological biography registry mapped by approximate coordinate keys
const geologicalBiographies = {
    // Hell Creek [47.6, -107.8]
    "47.6,-107.8": {
        formation: "Hell Creek Formation",
        description: "The Hell Creek Formation is a world-famous sequence of mostly Upper Cretaceous rocks named after Hell Creek near Jordan, Montana. It consists of freshwater claystones, mudstones, and sandstones deposited in a river delta environment.",
        importance: "It is globally famous for yielding the first complete T. rex fossils and documenting the dramatic K-Pg extinction event, preserving rich dinosaur ecosystems right up to the asteroid impact layer.",
        count: 12,
        environment: "Badlands Canyons",
        geoFact: "The boundary line marking the asteroid impact (iridium clay layer) is clearly visible across its rock strata."
    },
    // Hell Creek Ankylosaurus [47.5, -107.0]
    "47.5,-107.0": {
        formation: "Hell Creek Formation",
        description: "The Hell Creek badlands consist of sandstones deposited by river deltas flowing into the Western Interior Seaway.",
        importance: "Preserves the last standing dinosaur species before the meteorite impact, including Triceratops, Ankylosaurus, and T. rex.",
        count: 4,
        environment: "Badlands Canyons",
        geoFact: "The formation is rich in fossilized redwood amber, showing the area was once a warm temperate forest."
    },
    // Lance Formation [43.0, -107.5]
    "43.0,-107.5": {
        formation: "Lance Formation",
        description: "The Lance Formation is a division of Late Cretaceous rocks in Wyoming, consisting of terrestrial sandstones and shales. It represents ancient coastal plains bordering the Western Interior Seaway.",
        importance: "It preserves an exceptional variety of late-stage non-avian dinosaurs and early mammals, providing a detailed record of late Cretaceous terrestrial life just before the extinction event.",
        count: 8,
        environment: "Semiarid Plains",
        geoFact: "Fossils here are often found in micro-sites containing thousands of tiny teeth and bone fragments."
    },
    // Morrison sauropods [39.5, -105.7]
    "39.5,-105.7": {
        formation: "Morrison Formation",
        description: "The Morrison Formation is a distinctive sequence of Upper Jurassic sedimentary rock found in the western United States. It is composed of mudstone, sandstone, and siltstone.",
        importance: "It is the most fertile source of giant sauropod dinosaurs in North America, defining our understanding of the late Jurassic 'golden age' of giants.",
        count: 15,
        environment: "Mountain Valleys",
        geoFact: "Morrison rocks cover over 1.5 million square kilometers across the Western United States."
    },
    // Dorset Blue Lias [50.7, -2.9]
    "50.7,-2.9": {
        formation: "Blue Lias Formation",
        description: "The Blue Lias is a geologic formation consisting of a sequence of limestone and shale layers. It was deposited in a warm, shallow tropical sea that covered much of Europe.",
        importance: "Mary Anning discovered the first complete Ichthyosaur skeleton here in Lyme Regis, laying the groundwork for modern paleontology.",
        count: 5,
        environment: "Coastal Cliffs",
        geoFact: "The cliffs here suffer from constant coastal erosion, exposing new fossils after heavy winter storms."
    },
    // Utah Morrison [38.7, -109.5]
    "38.7,-109.5": {
        formation: "Morrison Formation",
        description: "The Morrison Formation in Utah consists of river channel deposits and ancient floodplains. The dry climate has preserved fossil bones in spectacular detail.",
        importance: "Contains major quarry sites like Cleveland-Lloyd Dinosaur Quarry, which has the densest concentration of Jurassic predator bones ever found.",
        count: 22,
        environment: "Arid Desert / Canyons",
        geoFact: "The site contains a mysterious high concentration of Allosaurus fossils, leading scientists to believe it was a predator trap."
    },
    // Djadochta raptor [44.2, 103.7]
    "44.2,103.7": {
        formation: "Djadochta Formation",
        description: "The Djadochta Formation is a geological formation located in the Gobi Desert. It is famous for its red sandstone dunes and arid alluvial deposits.",
        importance: "Excavations here yielded the famous 'Fighting Dinosaurs' fossil and Halszkaraptor, a unique semi-aquatic raptor that challenged previous theories about dinosaur niches.",
        count: 18,
        environment: "Gobi Sand Dunes",
        geoFact: "Fossils here are exceptionally preserved in three dimensions because animals were quickly buried alive in collapsing sand dunes during sandstorms."
    },
    // Liaoning feathered dino [41.5, 120.3]
    "41.5,120.3": {
        formation: "Jiufotang Formation",
        description: "The Jiufotang Formation is an Cretaceous geologic formation in Liaoning, consisting of volcanic ash layers and lake sediment beds.",
        importance: "It is world-famous for its Jehol Biota, preserving feathered dinosaurs, early birds, and pterosaurs in astonishing detail, including soft tissues and stomach contents.",
        count: 35,
        environment: "Volcanic Hills & Lake Beds",
        geoFact: "Fine volcanic ash falling into calm lakes created oxygen-free conditions, preventing decay and preserving delicate feathers."
    },
    // Yixian tiny armored dino [41.6, 120.4]
    "41.6,120.4": {
        formation: "Yixian Formation",
        description: "The Yixian Formation is composed of basalt flows interbedded with lake sediments. It represents a forested volcanic lake ecosystem.",
        importance: "Preserves the earliest known flowering plants and uniquely tiny, armor-plated dinosaurs like Liaoningosaurus, which showed evidence of eating fish.",
        count: 42,
        environment: "Volcanic Forest Plains",
        geoFact: "The Yixian fossils are famous for preserving color pigments (melanosomes) in fossilized feathers."
    },
    // La Colonia Carnotaurus [-43.5, -69.0]
    "-43.5,-69.0": {
        formation: "La Colonia Formation",
        description: "The La Colonia Formation is a sequence of sandstones, claystones, and siltstones deposited in estuary and coastal lagoon environments.",
        importance: "Preserves Carnotaurus, the 'meat-eating bull', providing crucial insights into the evolution of theropods in Gondwana after the continental split.",
        count: 4,
        environment: "Patagonian Steppe",
        geoFact: "The Carnotaurus skeleton found here preserves detailed fossilized skin impressions across almost its entire body."
    },
    // Djadochta Velociraptor [44.0, 103.5]
    "44.0,103.5": {
        formation: "Djadochta Formation",
        description: "The Djadochta sandstones represent a Cretaceous desert biome. Fossil remains are abundant in the bright orange and red cliff faces.",
        importance: "First explored by Roy Chapman Andrews in the 1920s, this site was the first place dinosaur eggs were ever discovered.",
        count: 18,
        environment: "Desert Cliffs",
        geoFact: "Roy Chapman Andrews is widely believed to be the real-life inspiration for the character Indiana Jones."
    },
    // Brazil Pterosaur [-7.2, -39.5]
    "-7.2,-39.5": {
        formation: "Santana Formation",
        description: "The Santana Group is a geologic formation in northeastern Brazil, famous for its limestone nodules deposited in an ancient shallow inland lagoon.",
        importance: "It is one of the premier pterosaur fossil sites in the world, preserving three-dimensional pterosaur skeletons and soft-tissue crests.",
        count: 14,
        environment: "Caatinga Scrublands",
        geoFact: "Fossils are found inside round limestone nodules that can be cracked open like geode rocks."
    },
    // Chinle Coelophysis [36.3, -106.5]
    "36.3,-106.5": {
        formation: "Chinle Formation",
        description: "The Chinle Formation is a widespread geological formation consisting of riverbed siltstones and volcanic muds across the American Southwest.",
        importance: "The Ghost Ranch quarry within the Chinle contains thousands of Coelophysis skeletons packed together, representing a sudden mass drowning event.",
        count: 120,
        environment: "Red Rock Mesas",
        geoFact: "Ghost Ranch was the home and inspiration of the famous American painter Georgia O'Keeffe."
    },
    // Solnhofen pterosaur [48.9, 11.0]
    "48.9,11.0": {
        formation: "Solnhofen Limestone",
        description: "The Solnhofen Plattenkalk is a Jurassic limestone deposit forming flat, easily split slate layers. It represents an ancient tropical lagoon system.",
        importance: "This deposit preserves exceptionally delicate structures like insect wings, jellyfish outlines, pterosaur wing membranes, and Archaeopteryx feathers.",
        count: 25,
        environment: "Limestone Quarries",
        geoFact: "The fine-grained limestone here has been quarried for centuries and was historically used to invent lithographic printing."
    },
    // Solnhofen Archaeopteryx [48.9, 11.1]
    "48.9,11.1": {
        formation: "Solnhofen Limestone",
        description: "The Solnhofen limestones are famous for lithographic stone beds formed in hypersaline lagoons under a tropical climate.",
        importance: "Preserves Archaeopteryx, the iconic 'first bird' showing a transition from feathered dinosaurs to modern birds, supporting Darwin's theories.",
        count: 12,
        environment: "Forested Limestone Hills",
        geoFact: "Every single one of the 12 known Archaeopteryx specimens was found within this single small quarry region."
    },
    // Maastricht marine dino [50.9, 5.7]
    "50.9,5.7": {
        formation: "Maastricht Formation",
        description: "The Maastricht Formation consists of chalky marine limestones deposited in a shallow subtropical sea near the end of the dinosaur age.",
        importance: "The discovery of a giant Mosasaur jaw in a quarry here in 1764 was one of the earliest fossil finds to suggest the concept of extinction.",
        count: 3,
        environment: "Limestone Caves",
        geoFact: "The underground quarries have created a massive network of over 20,000 tunnel systems under Mount Saint Peter."
    },
    // Utah Kaiparowits [37.4, -111.8]
    "37.4,-111.8": {
        formation: "Kaiparowits Formation",
        description: "The Kaiparowits Formation is a thick sequence of sandstones and mudstones deposited by large river systems in southern Utah.",
        importance: "It is one of the most complete late Cretaceous terrestrial sequences in the world, preserving a highly endemic dinosaur fauna.",
        count: 9,
        environment: "Arid Canyons & Mesas",
        geoFact: "Located in the remote Grand Staircase-Escalante National Monument, it remains one of the least explored basins in the US."
    },
    // Arizona Kayenta [36.0, -110.5]
    "36.0,-110.5": {
        formation: "Kayenta Formation",
        description: "The Kayenta Formation is a geological deposit of siltstones and sandstones formed in ancient river basins and floodplain systems.",
        importance: "Preserves early Jurassic ecosystems, document the transition after the Triassic extinction, and yields the double-crested Dilophosaurus.",
        count: 6,
        environment: "Siltstone Desert Mesas",
        geoFact: "Dinosaurs here shared their environment with early tritylodontids, which were highly mammal-like synapsids."
    },
    // Ischigualasto Triassic [-30.2, -67.8]
    "-30.2,-67.8": {
        formation: "Ischigualasto Formation",
        description: "The Ischigualasto Formation is a Triassic basin composed of river sandstones and volcanic tuffs, also known as the Valley of the Moon.",
        importance: "It is the only place on Earth where almost the entire Triassic period is preserved in a continuous sequence of continental sediments, yielding Eoraptor.",
        count: 12,
        environment: "Eroded Clay Desert",
        geoFact: "Its eerie, wind-carved clay formations resemble a lunar landscape, giving the site its popular name Valle de la Luna."
    },
    // Morrison Wyoming sauropod [44.0, -107.0]
    "44.0,-107.0": {
        formation: "Morrison Formation",
        description: "The Morrison Formation in Wyoming represents a vast savannah-like plain crossed by seasonal rivers, rich in giant conifers.",
        importance: "Yields massive skeletons of Diplodocus and Apatosaurus, illustrating how Jurassic herbivores evolved colossal body sizes to digest tough pine foliage.",
        count: 18,
        environment: "Rolling High Plains",
        geoFact: "Many Morrison quarries in Wyoming were the center of the famous 'Bone Wars' rivalry between paleontologists Marsh and Cope."
    }
};

/**
 * Rounds coordinate points to 1 decimal place to generate key matches.
 */
const getBioKey = (lat, lng) => {
    const rLat = Math.round(lat * 10) / 10;
    const rLng = Math.round(lng * 10) / 10;
    return `${rLat.toFixed(1)},${rLng.toFixed(1)}`;
};

/**
 * Fetches geolocation address fields via OSM Nominatim and appends the paleontological biography.
 * 
 * @param {number} lat 
 * @param {number} lng 
 * @param {string} fallbackFormation 
 * @returns {Promise<object>} Geocoded fossil site details
 */
export const getFossilSiteDetails = async (lat, lng, fallbackFormation = "Fossil Stratum") => {
    if (lat === undefined || lng === undefined) return null;

    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    
    // 1. Resolve from cache if hit
    if (locationCache.has(cacheKey)) {
        return locationCache.get(cacheKey);
    }

    try {
        // 2. Query OSM Nominatim Reverse Geocoding with custom User-Agent to prevent throttling
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
                headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "JurassicExplorer-ExcavationMap-V1.0"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Nominatim query failed with status: ${response.status}`);
        }

        const data = await response.json();
        const address = data.address || {};

        // Extract regional attributes
        const country = address.country || "";
        const state = address.state || address.province || address.region || address.county || "";
        const city = address.city || address.town || address.village || address.municipality || address.suburb || "";
        const locationName = data.display_name ? data.display_name.split(",")[0] : fallbackFormation;

        // 3. Resolve narrative biography
        const bioKey = getBioKey(lat, lng);
        const mappedBio = geologicalBiographies[bioKey];

        const resolvedSite = {
            formation: mappedBio?.formation || fallbackFormation || locationName,
            country: country,
            region: state,
            period: mappedBio?.period || "Mesozoic Era",
            description: mappedBio?.description || `The ${fallbackFormation} located in ${country} is a notable geologic layer. Prehistoric strata in this region contain fossil records dating back millions of years.`,
            importance: mappedBio?.importance || `This site is crucial for mapping the historical paleogeography of prehistoric ecosystems.`,
            count: mappedBio?.count || 1,
            environment: mappedBio?.environment || "",
            nearbyCity: city,
            geoFact: mappedBio?.geoFact || ""
        };

        // Cache coordinates to prevent duplicate API hits
        locationCache.set(cacheKey, resolvedSite);
        return resolvedSite;

    } catch (error) {
        console.error("Geocoding failed, falling back to local dataset map:", error);

        // Fallback gracefully to offline static narrative mapping if network fails or Nominatim rate-limits
        const bioKey = getBioKey(lat, lng);
        const mappedBio = geologicalBiographies[bioKey];

        if (mappedBio) {
            return {
                formation: mappedBio.formation,
                country: "Global excavation site",
                region: "",
                period: mappedBio.period || "Mesozoic Era",
                description: mappedBio.description,
                importance: mappedBio.importance,
                count: mappedBio.count,
                environment: mappedBio.environment,
                nearbyCity: "",
                geoFact: mappedBio.geoFact
            };
        }

        // Complete failure fallback
        return {
            formation: fallbackFormation,
            country: "",
            region: "",
            period: "Mesozoic Era",
            description: `A geological stratum representing dinosaur habitats from the Mesozoic Era.`,
            importance: `Aids in mapping prehistoric ecosystems.`,
            count: 1,
            environment: "",
            nearbyCity: "",
            geoFact: ""
        };
    }
};
