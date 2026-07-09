const dinosaurTemplate = {
    name: "Tyrannosaurus Rex",
    slug: "tyrannosaurus-rex",
    scientificName: "Tyrannosaurus rex",

    images: {
        heroBackground: "",
    },

    // Hero
    hero: {
        tagLine: "LATE CRETACEOUS PREDATOR",
        title: "Tyrannosaurus",
        highlightedTitle: "Rex",
        description:
            "Tyrannosaurus rex was one of the largest and most powerful carnivorous dinosaurs ever discovered. It ruled western North America during the Late Cretaceous period and remains one of the most recognizable prehistoric predators.",
    },

    // Quick Facts
    stats: {
        length: "12–13 m",
        height: "4 m",
        weight: "8–9 tonnes",
        diet: "Carnivore",
        period: "Late Cretaceous",
        location: "North America",
        speed: "27 km/h",
        lifespan: "28 years",
    },

    // About
    about: {
        heading: "About Tyrannosaurus Rex",
        paragraphs: [
            "Tyrannosaurus rex lived approximately 68 to 66 million years ago during the Late Cretaceous Period. It was among the largest terrestrial predators ever discovered and dominated its ecosystem.",
            "With an enormous skull, powerful jaws, and one of the strongest bite forces of any known land animal, T. rex hunted large herbivorous dinosaurs and may also have scavenged when opportunities arose.",
        ],
    },

    // Fossil
    fossil: {
        firstDiscovered: "1902",
        discoveredBy: "Barnum Brown",
        locations: ["Montana", "Wyoming", "South Dakota", "Alberta"],
        significance:
            "One of the most extensively studied dinosaurs with numerous well-preserved fossils.",
        image: "",
    },

    // Physical Features
    physicalFeatures: {
        features: [
            {
                title: "Massive Skull",
                description:
                    "Large skull built to generate one of the strongest bite forces ever measured.",
                image: "",
            },
            {
                title: "Powerful Legs",
                description:
                    "Strong hind limbs capable of supporting its enormous body weight.",
                image: "",
            },
            {
                title: "Tiny Arms",
                description:
                    "Short but muscular forelimbs ending in two powerful claws.",
                image: "",
            },
            {
                title: "Serrated Teeth",
                description:
                    "Large banana-shaped teeth ideal for crushing bone and tearing flesh.",
                image: "",
            },
        ],
    },

    // Timeline
    timeline: {
        period: "Late Cretaceous",
        livedFrom: "68 Million Years Ago",
        livedTo: "66 Million Years Ago",
        extinction: "Cretaceous–Paleogene Mass Extinction",
    },

    // Hunting
    hunting: {
        huntingStyle: "Apex Predator",

        strategy:
            "Relied on immense bite force, powerful jaws, keen vision, and strong senses to overpower large prey.",

        prey: ["Triceratops", "Edmontosaurus", "Ankylosaurus"],

        traits: [
            {
                icon: "🦷",
                title: "Powerful Bite",
                description:
                    "One of the strongest bite forces of any terrestrial animal.",
            },
            {
                icon: "👁️",
                title: "Excellent Vision",
                description:
                    "Forward-facing eyes provided outstanding depth perception.",
            },
            {
                icon: "👃",
                title: "Strong Smell",
                description:
                    "Highly developed sense of smell helped locate prey.",
            },
            {
                icon: "🏃",
                title: "Ambush Hunter",
                description:
                    "Used explosive power rather than long-distance endurance.",
            },
        ],
    },

    // Diet
    diet: {
        category: "Carnivore",

        description:
            "Tyrannosaurus rex primarily hunted large herbivorous dinosaurs but likely scavenged when food was available.",

        favoriteFood: ["Triceratops", "Edmontosaurus", "Ankylosaurus"],

        facts: [
            {
                title: "BITE FORCE",
                value: "35,000–57,000 Newtons",
            },
            {
                title: "TEETH",
                value: "Up to 60 serrated teeth",
            },
            {
                title: "HUNTING STYLE",
                value: "Apex Predator",
            },
            {
                title: "ROLE",
                value: "Top Predator of the Late Cretaceous",
            },
        ],

        image: "",
    },
};

export default dinosaurTemplate;
