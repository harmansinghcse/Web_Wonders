export const eras = [
    {
        id: "triassic",
        name: "Triassic",
        tagline: "Dawn of Dinosaurs",
        description: "The first dinosaurs appeared during the Triassic period, rising from the ashes of Earth's greatest extinction event. The supercontinent Pangaea began to break apart, creating new climates and ecosystems that allowed early dinosaurs and mammals to emerge.",
        start: "252 Ma",
        end: "201 Ma",
        background: "/jurassic_game_vibe_bg.jpg",
        dinosaur: "/triassic-dino.webp",
        theme: {
            name: "Volcanic Arid Desert",
            primary: "#C9AA5B",
            accent: "#D97706",
            bgGlow: "rgba(201, 170, 91, 0.25)",
            border: "rgba(201, 170, 91, 0.4)",
            badgeBg: "rgba(201, 170, 91, 0.15)",
            cardBg: "rgba(35, 25, 10, 0.7)"
        },
        climate: {
            temp: "22°C",
            tempSub: "+8°C vs Today",
            oxygen: "16%",
            co2: "CO₂: 1750 ppm",
            drift: "Pangaea Supercontinent",
            flora: "Ferns, Cycads, Ginkgos & Seed Ferns"
        },
        dinosaurs: [
            {
                name: "Coelophysis",
                scientificName: "Coelophysis bauri",
                diet: "Carnivore",
                length: "2.7–3.1 m",
                weight: "15–5 KG",
                image: "/coelophysis.jpg"
            },
            {
                name: "EORAPTOR",
                scientificName: "EORAPTOR Lunensis",
                diet: "Carnivore",
                length: "1–1.5 m",
                weight: "8–12 kg",
                image: "/eoraptor.jpg"
            },
            {
                name: "Ichthyosaurus",
                scientificName: "Ichthyosaurus communis",
                diet: "Carnivore",
                length: "3–10 m",
                weight: "250–2,000 kg",
                image: "/ichthyosaurus.jpg"
            }
        ],
        milestones: [
            {
                ma: "252 Ma",
                title: "Permian-Triassic Extinction",
                desc: "The 'Great Dying' wiped out 96% of marine life and 70% of land species, clearing ecological niches for dinosaurs."
            },
            {
                ma: "233 Ma",
                title: "Carnian Pluvial Episode",
                desc: "2 million years of intense global rainfall that transformed dry Pangaea and triggered rapid dinosaur radiation."
            },
            {
                ma: "201 Ma",
                title: "Triassic-Jurassic Extinction",
                desc: "Volcanic eruptions associated with Pangaea rift opening eliminated competing pseudosuchians."
            }
        ]
    },
    {
        id: "jurassic",
        name: "Jurassic",
        tagline: "Age of Giants",
        description: "Dense, lush conifer forests covered the Earth during the Jurassic period. Warm, humid climates allowed giant sauropods like Brachiosaurus and ferocious predators like Allosaurus to dominate the land, while pterosaurs ruled the skies.",
        start: "201 Ma",
        end: "145 Ma",
        background: "/jurassic-bg.webp",
        dinosaur: "/jurassic-dino.webp",
        theme: {
            name: "Lush Conifer Jungle",
            primary: "#10B981",
            accent: "#059669",
            bgGlow: "rgba(16, 185, 129, 0.25)",
            border: "rgba(16, 185, 129, 0.4)",
            badgeBg: "rgba(16, 185, 129, 0.15)",
            cardBg: "rgba(10, 30, 20, 0.7)"
        },
        climate: {
            temp: "20°C",
            tempSub: "+6°C vs Today",
            oxygen: "26%",
            co2: "CO₂: 1950 ppm",
            drift: "Laurasia & Gondwana Separation",
            flora: "Conifer Forests, Ferns & Cycads"
        },
        dinosaurs: [
            {
                name: "Brachiosaurus",
                scientificName: "Brachiosaurus altithorax",
                diet: "Herbivore",
                length: "23–26 m",
                weight: "30–58 tonnes",
                image: "/brachiosaurus.jpg"
            },
            {
                name: "Allosaurus",
                scientificName: "Allosaurus fragilis",
                diet: "Carnivore",
                length: "8.5–12 m",
                weight: "2–2.3 tonnes",
                image: "/allosaurus.jpg"
            },
            {
                name: "Stegosaurus",
                scientificName: "Stegosaurus stenops",
                diet: "Herbivore",
                length: "9 m",
                weight: "5.3–7 tonnes",
                image: "/stegosaurus.jpg"
            }
        ],
        milestones: [
            {
                ma: "201 Ma",
                title: "Pangaea Breakup Accelerates",
                desc: "Tethys Ocean opens, separating Laurasia in the north from Gondwana in the south."
            },
            {
                ma: "170 Ma",
                title: "Sauropod Gigantism Peak",
                desc: "Warm humid climates and vast conifer forests support the evolution of massive long-necked sauropods."
            },
            {
                ma: "150 Ma",
                title: "First Avian Evolution",
                desc: "Archaeopteryx emerges, marking the evolutionary transition from feathered theropods to early birds."
            }
        ]
    },
    {
        id: "cretaceous",
        name: "Cretaceous",
        tagline: "The Final Kingdom",
        description: "Flowering plants spread and dinosaurs reached their evolutionary peak during the Cretaceous period. Giant herbivores like Triceratops fed on new plant life, while the legendary Tyrannosaurus Rex ruled as the ultimate apex predator before the asteroid impact.",
        start: "145 Ma",
        end: "66 Ma",
        background: "/cretaceous-bg.webp",
        dinosaur: "/trex-dino.webp",
        theme: {
            name: "Fiery Extinction Sunset",
            primary: "#EF4444",
            accent: "#DC2626",
            bgGlow: "rgba(239, 68, 68, 0.25)",
            border: "rgba(239, 68, 68, 0.4)",
            badgeBg: "rgba(239, 68, 68, 0.15)",
            cardBg: "rgba(35, 10, 10, 0.7)"
        },
        climate: {
            temp: "24°C",
            tempSub: "+10°C vs Today",
            oxygen: "30%",
            co2: "CO₂: 1400 ppm",
            drift: "Fragmenting Modern Continents",
            flora: "Flowering Plants (Angiosperms), Magnolias & Palms"
        },
        dinosaurs: [
            {
                name: "Tyrannosaurus Rex",
                scientificName: "Tyrannosaurus rex",
                diet: "Carnivore",
                length: "12–13 m",
                weight: "8–9 tonnes",
                image: "/trex-dino.webp"
            },
            {
                name: "Triceratops",
                scientificName: "Triceratops horridus",
                diet: "Herbivore",
                length: "8–9 m",
                weight: "6–12 tonnes",
                image: "/triceratops.jpg"
            },
            {
                name: "Velociraptor",
                scientificName: "Velociraptor mongoliensis",
                diet: "Carnivore",
                length: "2 m",
                weight: "15–20 kg",
                image: "/velociraptor.jpg"
            }
        ],
        milestones: [
            {
                ma: "125 Ma",
                title: "Angiosperm Radiation",
                desc: "Flowering plants evolve and diversify rapidly, transforming terrestrial ecosystems and dinosaur diets."
            },
            {
                ma: "90 Ma",
                title: "Western Interior Seaway",
                desc: "A vast inland sea divides North America into Laramidia and Appalachia, fostering unique endemic species."
            },
            {
                ma: "66 Ma",
                title: "Chicxulub Asteroid Extinction",
                desc: "A 10km asteroid impact triggers catastrophic global darkness, ending the 165-million-year Reign of Dinosaurs."
            }
        ]
    }
];
