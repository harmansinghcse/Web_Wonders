const mongoose = require("mongoose");
const Topic = require("../models/QuizModals/Topic");
const Question = require("../models/QuizModals/Questions");
require("dotenv").config();

const topicsData = [
    {
        title: "Fossils",
        slug: "fossils",
        description: "Discover how ancient life is preserved through millions of years.",
        estimatedTime: 10,
        order: 1,
    },
    {
        title: "Dinosaurs",
        slug: "dinosaurs",
        description: "Meet the incredible giants that once ruled the Earth.",
        estimatedTime: 15,
        order: 2,
    },
    {
        title: "Extinction",
        slug: "extinction",
        description: "Learn what caused Earth's greatest extinction events.",
        estimatedTime: 12,
        order: 3,
    },
    {
        title: "Evolution",
        slug: "evolution",
        description: "Understand how prehistoric life evolved over time.",
        estimatedTime: 15,
        order: 4,
    }
];

const questionsData = {
    fossils: [
        // Easy
        {
            difficulty: "easy",
            question: "What is a fossilized tree resin known as?",
            options: ["Amber", "Coal", "Copal", "Petrified Wood"],
            correctAnswer: 0,
            explanation: "Amber is fossilized tree resin, which has been appreciated for its color and natural beauty since Neolithic times.",
            hint: "It has a golden yellow color and is often used in jewelry.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Which type of fossil shows the footprint or nest of an animal rather than the animal itself?",
            options: ["Body fossil", "Trace fossil", "Cast fossil", "Microfossil"],
            correctAnswer: 1,
            explanation: "Trace fossils (coprolites, footprints, tracks, burrows) record the activity of organisms rather than their physical body parts.",
            hint: "It leaves a 'trace' of their movement.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "What is the study of fossils called?",
            options: ["Archeology", "Paleontology", "Geology", "Anthropology"],
            correctAnswer: 1,
            explanation: "Paleontology is the scientific study of life that existed prior to, and sometimes including, the start of the Holocene Epoch, based on fossils.",
            hint: "Starts with Paleo-.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "In which type of rock are most fossils found?",
            options: ["Igneous", "Metamorphic", "Sedimentary", "Volcanic"],
            correctAnswer: 2,
            explanation: "Sedimentary rocks are formed by the accumulation of sediments, which gently cover organic remains over time, preserving them.",
            hint: "Formed from layers of sand, mud, and pebbles.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "What are coprolites?",
            options: ["Fossilized teeth", "Fossilized footprints", "Fossilized dinosaur dung", "Fossilized leaves"],
            correctAnswer: 2,
            explanation: "Coprolites are fossilized feces. They are classified as trace fossils and provide clues about an animal's diet.",
            hint: "It represents digested waste material.",
            points: 10
        },
        // Medium
        {
            difficulty: "medium",
            question: "What process occurs when minerals replace the organic matter in a decaying organism, turning it to stone?",
            options: ["Carbonization", "Permineralization", "Recrystallization", "Mummification"],
            correctAnswer: 1,
            explanation: "Permineralization is a process of fossilization in which mineral deposits form internal casts of organisms.",
            hint: "Minerals fill the pores of the organic tissues.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which of the following is considered a 'living fossil' because it has remained virtually unchanged for millions of years?",
            options: ["Coelacanth", "Dodo", "Trilobite", "Ammonite"],
            correctAnswer: 0,
            explanation: "The coelacanth is a famous living fossil that was thought to have gone extinct 66 million years ago until one was caught in 1938.",
            hint: "It is a deep-sea lobe-finned fish.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What are index fossils used for?",
            options: ["Determining the weight of a dinosaur", "Dating rock layers", "Finding oil deposits", "Reconstructing plant leaf structures"],
            correctAnswer: 1,
            explanation: "Index fossils are fossils used to define and identify geologic periods. They must be widely distributed and short-lived.",
            hint: "They help establish the age of surrounding stratigraphy.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What is carbonization in fossilization?",
            options: ["Conversion of bone to calcium carbon", "An outline of carbon residue left by compressed organisms", "Dating fossils using carbon-14 isotopes", "The chemical wash used to clean fossils"],
            correctAnswer: 1,
            explanation: "Carbonization (or distillation) leaves a detailed dark silhouette of the organism, commonly seen in leaf or fish fossils.",
            hint: "A thin film of black element is left behind under extreme pressure.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which soft-bodied fossil location in Canada is famous for preserving exceptional details from the Cambrian period?",
            options: ["La Brea Tar Pits", "Burgess Shale", "Green River Formation", "Solnhofen Limestone"],
            correctAnswer: 1,
            explanation: "The Burgess Shale is famous for its exceptional preservation of Cambrian soft-bodied organisms.",
            hint: "Located in the Canadian Rockies.",
            points: 15
        },
        // Hard
        {
            difficulty: "hard",
            question: "Which type of fossil preservation preserves the actual original skeleton or shell material with little chemical change?",
            options: ["Unaltered remains", "Mold and cast", "Petrifaction", "Pyritization"],
            correctAnswer: 0,
            explanation: "Unaltered remains preserve the original mineralogy/materials of the organism (e.g. aragonite shells or mammoth bones in permafrost).",
            hint: "No mineral exchange or carbon film left behind.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which mineral is commonly involved in the replacement process that turns ammonites into metallic-looking gold-colored fossils?",
            options: ["Quartz", "Calcite", "Pyrite", "Hematite"],
            correctAnswer: 2,
            explanation: "Pyritization occurs when iron sulfide (pyrite or fool's gold) replaces the organic tissues or shell minerals.",
            hint: "Commonly known as fool's gold.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What represents the oldest known fossil evidence of life on Earth, formed by layers of cyanobacteria?",
            options: ["Trilobites", "Stromatolites", "Acanthodians", "Dickinsonia"],
            correctAnswer: 1,
            explanation: "Stromatolites are layered sedimentary structures formed by the trapping and binding of biofilms of cyanobacteria, dating back 3.5 billion years.",
            hint: "Rock-like structures built by micro-organisms in shallow water.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What does the term 'taphonomy' refer to?",
            options: ["The scientific classification of prehistoric animals", "The study of how organisms decay and become fossilized", "The excavation techniques of paleontology", "The reconstruction of fossil footprints"],
            correctAnswer: 1,
            explanation: "Taphonomy is the study of the transition of organic remains from the biosphere to the lithosphere, including death, decay, and burial.",
            hint: "Literally translates to 'laws of burial'.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which enigmatic Precambrian fossil group includes flat, segmented, leaf-like organisms like Dickinsonia?",
            options: ["Burgess fauna", "Ediacaran biota", "Chengjiang fauna", "Mazon Creek fauna"],
            correctAnswer: 1,
            explanation: "The Ediacaran biota are tubular and frond-like, mostly sessile organisms that lived during the Ediacaran Period (c. 635-541 Mya).",
            hint: "Named after the Ediacara Hills in South Australia.",
            points: 20
        }
    ],
    dinosaurs: [
        // Easy
        {
            difficulty: "easy",
            question: "Which dinosaur name translates to 'Tyrant Lizard King'?",
            options: ["Velociraptor", "Tyrannosaurus Rex", "Triceratops", "Brachiosaurus"],
            correctAnswer: 1,
            explanation: "Tyrannosaurus Rex comes from Greek and Latin words meaning 'tyrant lizard king'.",
            hint: "The most famous predator with tiny arms.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Which dinosaur had three prominent horns on its face?",
            options: ["Stegosaurus", "Ankylosaurus", "Triceratops", "Spinosaurus"],
            correctAnswer: 2,
            explanation: "Triceratops literally means 'three-horned face', derived from its two large brow horns and a smaller nose horn.",
            hint: "Tri- means three.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Was the Brachiosaurus a herbivore or a carnivore?",
            options: ["Carnivore", "Herbivore", "Omnivore", "Piscivore"],
            correctAnswer: 1,
            explanation: "Brachiosaurus was a sauropod dinosaur, which were long-necked plant eaters (herbivores).",
            hint: "It used its long neck to eat leaves high up in trees.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Which dinosaur had flat upright plates along its back and spikes on its tail?",
            options: ["Ankylosaurus", "Stegosaurus", "Parasaurolophus", "Spinosaurus"],
            correctAnswer: 1,
            explanation: "Stegosaurus is well-known for the distinctive double row of kite-shaped plates along its back and its spiked tail (thagomizer).",
            hint: "Roof lizard with a brain the size of a walnut.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Approximately when did dinosaurs go extinct?",
            options: ["10,000 years ago", "66 million years ago", "250 million years ago", "2 million years ago"],
            correctAnswer: 1,
            explanation: "The Cretaceous-Paleogene extinction event wiped out non-avian dinosaurs about 66 million years ago.",
            hint: "Ended the Cretaceous period.",
            points: 10
        },
        // Medium
        {
            difficulty: "medium",
            question: "Which dinosaur is currently believed to have been the largest semi-aquatic carnivore, possessing a large sail on its back?",
            options: ["Tyrannosaurus", "Giganotosaurus", "Spinosaurus", "Allosaurus"],
            correctAnswer: 2,
            explanation: "Spinosaurus was a giant predatory dinosaur with a large neural spine sail, adapted for swimming and catching fish.",
            hint: "Featured in Jurassic Park III fighting a T-Rex.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What does the name 'Velociraptor' mean?",
            options: ["Swift seizer / robber", "Ferocious hunter", "Leaping lizard", "Feathered killer"],
            correctAnswer: 0,
            explanation: "Velociraptor is derived from the Latin words 'velox' (swift) and 'raptor' (robber or seizer).",
            hint: "Combines speed with grasping arms.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which dinosaur possessed a thick, bony dome skull, which it likely used for head-butting?",
            options: ["Pachycephalosaurus", "Ankylosaurus", "Iguanodon", "Deinonychus"],
            correctAnswer: 0,
            explanation: "Pachycephalosaurus had an extremely thick skull roof (up to 9 inches thick) used for flank-butting or head-butting.",
            hint: "Name translates to 'thick-headed lizard'.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which dinosaur is known for its heavily armored body and a large, bone-like club at the end of its tail?",
            options: ["Stegosaurus", "Ankylosaurus", "Ceratosaurus", "Diplodocus"],
            correctAnswer: 1,
            explanation: "Ankylosaurus was a tank-like dinosaur covered in osteoderms, with a heavy tail club used for defense.",
            hint: "Fused lizard.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What group of long-necked, massive dinosaurs includes Argentinosaurus and Brachiosaurus?",
            options: ["Theropods", "Ceratopsians", "Sauropods", "Ornithopods"],
            correctAnswer: 2,
            explanation: "Sauropods are an infraorder of saurischian dinosaurs characterized by very long necks, long tails, small heads, and four thick legs.",
            hint: "Lizard-footed giants.",
            points: 15
        },
        // Hard
        {
            difficulty: "hard",
            question: "Which dinosaur discovery in the 1960s revolutionized paleontology by suggesting dinosaurs were active, warm-blooded animals (leading to the Dinosaur Renaissance)?",
            options: ["Deinonychus", "Archaeopteryx", "Hadrosaurus", "Megalosaurus"],
            correctAnswer: 0,
            explanation: "John Ostrom's discovery of Deinonychus in 1964 showed a sleek, highly active raptor that could not have been a sluggish, cold-blooded reptile.",
            hint: "Terrible claw.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What is the primary anatomical difference between Saurischian and Ornithischian dinosaurs?",
            options: ["The structure of their teeth", "The structure of their hip bones", "The length of their necks", "The presence of feathers"],
            correctAnswer: 1,
            explanation: "Saurischians ('lizard-hipped') have a pubis that points forward, while Ornithischians ('bird-hipped') have a pubis that points backward parallel to the ischium.",
            hint: "Hips don't lie.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which theropod dinosaur is famous for having a pair of distinctive, semi-circular crests on its head, and was wrongly depicted as spitting acid in Jurassic Park?",
            options: ["Dilophosaurus", "Coelophysis", "Ceratosaurus", "Carnotaurus"],
            correctAnswer: 0,
            explanation: "Dilophosaurus was a large predator of the Early Jurassic. It had double crests but no neck frill or venom-spitting abilities.",
            hint: "Two-crested lizard.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which Cretaceous theropod had horns over its eyes, tiny arms even smaller than a T-Rex's, and forward-facing eyes?",
            options: ["Carnotaurus", "Albertosaurus", "Tarbosaurus", "Giganotosaurus"],
            correctAnswer: 0,
            explanation: "Carnotaurus is a genus of large theropod dinosaur that lived in South America. It is notable for its bull-like horns and extremely reduced forelimbs.",
            hint: "Meat-eating bull.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which dinosaur was discovered with a fossilized 'four-winged' structure, suggesting that early ancestors of birds had flight feathers on both arms and legs?",
            options: ["Microraptor", "Archaeopteryx", "Yi Qi", "Anchiornis"],
            correctAnswer: 0,
            explanation: "Microraptor was a small dromaeosaurid with long flight feathers on both its forelimbs and hindlimbs, acting as a glider or flyer.",
            hint: "Small seizer.",
            points: 20
        }
    ],
    extinction: [
        // Easy
        {
            difficulty: "easy",
            question: "Which celestial object is blamed for the extinction of the dinosaurs?",
            options: ["Comet", "Asteroid", "Solar flare", "Black hole"],
            correctAnswer: 1,
            explanation: "An asteroid impact approximately 6 miles (10 km) in diameter is the leading cause of the Cretaceous-Paleogene extinction.",
            hint: "A rocky body orbiting the sun.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Where is the crater from the asteroid impact that killed the dinosaurs located?",
            options: ["Siberia", "Mexico", "Arizona", "South Africa"],
            correctAnswer: 1,
            explanation: "The Chicxulub crater is located buried underneath the Yucatán Peninsula in Mexico.",
            hint: "Home to the Maya civilization and tacos.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Which chemical element, rare on Earth's surface but common in asteroids, is found in a clay layer worldwide marking the extinction boundary?",
            options: ["Iridium", "Gold", "Uranium", "Platinum"],
            correctAnswer: 0,
            explanation: "The 'Iridium anomaly' at the K-Pg boundary layer is a key piece of evidence supporting the asteroid impact theory.",
            hint: "Atomic number 77, symbol Ir.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Besides dinosaurs, which major marine reptile group went extinct at the end of the Cretaceous?",
            options: ["Sharks", "Ammonites", "Plesiosaurs", "Whales"],
            correctAnswer: 2,
            explanation: "Long-necked plesiosaurs and mosasaurs went extinct alongside the dinosaurs during the Cretaceous-Paleogene boundary event.",
            hint: "Often depicted as the Loch Ness Monster.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "What survived the dinosaur extinction and went on to dominate the Cenozoic era?",
            options: ["Trilobites", "Mammals", "Ammonites", "Pterosaurs"],
            correctAnswer: 1,
            explanation: "Small mammals survived the asteroid fallout and diversified, filling the ecological niches vacated by dinosaurs.",
            hint: "Warm-blooded, fur-bearing creatures that nurse their young.",
            points: 10
        },
        // Medium
        {
            difficulty: "medium",
            question: "What is the name of the massive volcanic activity in India that is debated to have contributed to the K-Pg extinction?",
            options: ["Siberian Traps", "Deccan Traps", "Yellowstone Caldera", "Campanian Ignimbrite"],
            correctAnswer: 1,
            explanation: "The Deccan Traps are a large volcanic province in West-Central India. Their eruptions released greenhouse gases and sulfur prior to the impact.",
            hint: "Deccan refers to the southern peninsula of India.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "How many major 'Mass Extinction' events has Earth experienced in its geological history?",
            options: ["Three", "Five", "Eight", "Ten"],
            correctAnswer: 1,
            explanation: "Earth has experienced five major mass extinction events, often called the 'Big Five'.",
            hint: "We are currently believed to be entering the sixth.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What is the name of the largest mass extinction event in Earth's history, which wiped out over 90% of all marine species?",
            options: ["Cretaceous-Paleogene", "Permian-Triassic", "Late Devonian", "Ordovician-Silurian"],
            correctAnswer: 1,
            explanation: "The Permian-Triassic extinction, also known as 'The Great Dying' (c. 252 Mya), was the most severe extinction event.",
            hint: "Occurred right before the Mesozoic era (Age of Dinosaurs) began.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What primary global climate effect occurred immediately (weeks to months) after the Chicxulub impact?",
            options: ["Extreme global warming", "Nuclear/Impact winter (darkness and cooling)", "Acid rain storms that flooded the earth", "Oxygen levels doubling"],
            correctAnswer: 1,
            explanation: "Soot and dust thrown into the stratosphere blocked sunlight, stopping photosynthesis and causing temperatures to plunge.",
            hint: "Blocks out the sun, mimicking a nuclear fallout.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which of the following dinosaur-adjacent groups actually survived the K-Pg extinction?",
            options: ["Pterosaurs (flying reptiles)", "Mosasaurs (marine reptiles)", "Crocodilians", "Ammonites"],
            correctAnswer: 2,
            explanation: "Crocodilians and turtles survived, likely due to their freshwater habitats and slower metabolisms.",
            hint: "Semi-aquatic armor-plated reptiles alive today.",
            points: 15
        },
        // Hard
        {
            difficulty: "hard",
            question: "Who was the father-son team that proposed the asteroid impact hypothesis in 1980 based on iridium layers?",
            options: ["The Alvarez Team", "The Darwin Team", "The Marsh and Cope Team", "The Leakey Team"],
            correctAnswer: 0,
            explanation: "Luis Alvarez (a physicist) and Walter Alvarez (a geologist) discovered the iridium layer and proposed the impact theory.",
            hint: "Starts with A-.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What volcanic eruption is linked to the Permian-Triassic extinction ('The Great Dying')?",
            options: ["Siberian Traps", "Deccan Traps", "Laki Eruption", "Krakatoa"],
            correctAnswer: 0,
            explanation: "The Siberian Traps erupted massive amounts of magma, releasing carbon dioxide and methane, acidifying oceans and causing runaway warming.",
            hint: "Located in the cold, northern Russian region.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What physical evidence of extreme pressure, found near impact craters, is characterized by intersecting lamellae in quartz grains?",
            options: ["Tektites", "Shocked quartz", "Spherules", "Breccia"],
            correctAnswer: 1,
            explanation: "Shocked quartz is formed under sudden, intense pressure. Its structure is deformed along crystalline planes.",
            hint: "Quartz that has been 'startled' by high pressure.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which mass extinction event was primarily driven by the evolution of land plants, causing ocean eutrophication and anoxia?",
            options: ["Late Devonian", "Permian-Triassic", "Triassic-Jurassic", "Ordovician-Silurian"],
            correctAnswer: 0,
            explanation: "The Late Devonian extinction (c. 375 Mya) is believed to have been triggered by deep-rooting land plants causing nutrient runoffs, algal blooms, and oxygen depletion in oceans.",
            hint: "Occurred during the 'Age of Fish'.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What are micro-tektites, often found in sediment layers representing the K-Pg boundary?",
            options: ["Tiny fragments of dinosaur bones", "Small glass beads formed from cooled rock vaporized during impact", "Fossilized plankton shells", "Cosmic dust particles"],
            correctAnswer: 1,
            explanation: "Tektites/spherules are gravel-sized bodies of silica glass formed from terrestrial debris ejected during meteorite impacts, which melted and cooled in flight.",
            hint: "Molten rock droplets that solidified in the air.",
            points: 20
        }
    ],
    evolution: [
        // Easy
        {
            difficulty: "easy",
            question: "Which modern animal group is directly descended from theropod dinosaurs?",
            options: ["Lizards", "Birds", "Crocodiles", "Mammals"],
            correctAnswer: 1,
            explanation: "Birds are modern feathered dinosaurs, classified under avian theropods.",
            hint: "They fly, have feathers, and lay eggs.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "Who wrote 'On the Origin of Species', laying the foundation of evolution?",
            options: ["Charles Darwin", "Gregor Mendel", "Alfred Wallace", "Jean-Baptiste Lamarck"],
            correctAnswer: 0,
            explanation: "Charles Darwin published 'On the Origin of Species' in 1859, proposing natural selection.",
            hint: "Traveled on the HMS Beagle.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "What is the process where organisms better adapted to their environment tend to survive and produce more offspring?",
            options: ["Mutation", "Natural Selection", "Genetic Drift", "Artificial Selection"],
            correctAnswer: 1,
            explanation: "Natural selection is the key mechanism of evolution, driving adaptation and speciation.",
            hint: "Often summarized as 'survival of the fittest'.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "What structures on dinosaurs were originally used for insulation or display before being used for flight?",
            options: ["Scales", "Feathers", "Spikes", "Horns"],
            correctAnswer: 1,
            explanation: "Many non-avian dinosaurs (like velociraptor) had feathers used for thermoregulation and mating rituals, not flight.",
            hint: "Birds are covered in them.",
            points: 10
        },
        {
            difficulty: "easy",
            question: "What are changes in the DNA sequence that introduce new genetic traits called?",
            options: ["Replications", "Mutations", "Selections", "Hybrids"],
            correctAnswer: 1,
            explanation: "Mutations are changes in the genomic sequence, acting as the primary source of genetic variation.",
            hint: "Can be neutral, harmful, or beneficial.",
            points: 10
        },
        // Medium
        {
            difficulty: "medium",
            question: "Which transitional fossil, discovered in Germany, has characteristics of both non-avian reptiles and modern birds?",
            options: ["Archaeopteryx", "Pterodactyl", "Ichthyornis", "Hesperornis"],
            correctAnswer: 0,
            explanation: "Archaeopteryx lived in the Late Jurassic. It had wings and feathers like a bird, but teeth and a bony tail like a dinosaur.",
            hint: "Translates to 'ancient wing'.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What is 'homology' in evolutionary biology?",
            options: ["The extinction of species due to similar traits", "Similarity in characteristics resulting from shared ancestry", "The random mutation of genes in a population", "The cloning of prehistoric organisms"],
            correctAnswer: 1,
            explanation: "Homologous structures share a common origin (e.g. human arm bones, bat wings, whale flippers) but may serve different functions.",
            hint: "Homo- means same.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which early land-dwelling fish fossil represents the transition from fish to tetrapods (four-limbed land animals)?",
            options: ["Coelacanth", "Tiktaalik", "Eusthenopteron", "Acanthostega"],
            correctAnswer: 1,
            explanation: "Tiktaalik is a monospecific genus of extinct sarcopterygian (lobe-finned fish) from the late Devonian period, representing a link to tetrapods.",
            hint: "Fish-apod.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "What evolutionary phenomenon occurs when unrelated species develop similar traits due to adapting to similar environments (e.g. sharks and dolphins)?",
            options: ["Divergent evolution", "Convergent evolution", "Coevolution", "Parallel evolution"],
            correctAnswer: 1,
            explanation: "Convergent evolution is the independent evolution of similar features in species of different lineages.",
            hint: "Different lineages 'converge' on a similar solution.",
            points: 15
        },
        {
            difficulty: "medium",
            question: "Which hominid fossil, discovered in Ethiopia in 1974, is a famous early ancestor of humans belonging to Australopithecus afarensis?",
            options: ["Ardi", "Lucy", "Taung Child", "Handy Man"],
            correctAnswer: 1,
            explanation: "Lucy is the common name of AL 288-1, a several hundred pieces of bone fossils representing about 40% of the skeleton of a female.",
            hint: "Named after a famous Beatles song playing in camp.",
            points: 15
        },
        // Hard
        {
            difficulty: "hard",
            question: "Which evolutionary theory proposes that species remain stable for long periods, punctuated by brief intervals of rapid change?",
            options: ["Gradualism", "Punctuated equilibrium", "Orthogenesis", "Saltation"],
            correctAnswer: 1,
            explanation: "Proposed by Niles Eldredge and Stephen Jay Gould in 1972, punctuated equilibrium explains gaps in the fossil record.",
            hint: "Contrast of stasis punctuated by change.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What group of synapsids, often called 'mammal-like reptiles', includes animals like Dimetrodon that are ancestral to mammals?",
            options: ["Pelycosaurs", "Therapsids", "Anapsids", "Sauropsids"],
            correctAnswer: 0,
            explanation: "Pelycosaurs (and later Therapsids) are synapsid lineages that eventually led to true mammals. Dimetrodon is more closely related to us than to dinosaurs.",
            hint: "Dimetrodon is a famous sailed member of this Paleozoic group.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What morphological feature in theropod skulls, which is also shared by modern birds, helps lighten the head and provide space for air sacs?",
            options: ["Mandibular fenestra", "Antorbital fenestra", "Temporal fossa", "Sclerotic ring"],
            correctAnswer: 1,
            explanation: "The antorbital fenestra is an opening in the skull that is in front of the eye sockets, reducing skull weight.",
            hint: "Opens up space 'in front of the orbit'.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "What refers to the evolutionary developmental process where juvenile characteristics of ancestors are retained in adult descendants?",
            options: ["Peramorphosis", "Neoteny / Paedomorphosis", "Atavism", "Vestigialization"],
            correctAnswer: 1,
            explanation: "Paedomorphosis (or neoteny) is the phylogenetic change in which individuals of a species retain juvenile traits of their ancestors into adulthood.",
            hint: "Seen in axolotls retaining gills.",
            points: 20
        },
        {
            difficulty: "hard",
            question: "Which gene family, highly conserved across animals, controls the head-to-tail anatomical blueprint during embryonic development?",
            options: ["BRCA genes", "Hox genes", "Pax genes", "MyoD genes"],
            correctAnswer: 1,
            explanation: "Hox genes (homeobox genes) specify segment identity along the anterior-posterior axis of animals.",
            hint: "Short for homeobox.",
            points: 20
        }
    ]
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for Seeding Quizzes");

        // Clear existing Quiz content to prevent duplicates
        await Topic.deleteMany({});
        await Question.deleteMany({});
        console.log("Cleared existing topics and questions.");

        // Insert topics
        const topicsMap = {};
        for (const topicData of topicsData) {
            const topic = await Topic.create(topicData);
            topicsMap[topic.slug] = topic._id;
            console.log(`Seeded Topic: ${topic.title} (${topic._id})`);
        }

        // Insert questions
        let questionsCount = 0;
        for (const [slug, questionsList] of Object.entries(questionsData)) {
            const topicId = topicsMap[slug];
            if (!topicId) continue;

            const preppedQuestions = questionsList.map((q) => ({
                ...q,
                topic: topicId,
            }));

            await Question.insertMany(preppedQuestions);
            questionsCount += preppedQuestions.length;
            console.log(`Seeded ${preppedQuestions.length} questions for topic: ${slug}`);
        }

        console.log(`Successfully seeded ${questionsCount} questions in total.`);
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
