const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const Dinosaur = require("../models/Dinosaur");
require("dotenv").config();

// Pattern types
const PATTERNS = [
    "fact",
    "image_obs",
    "question",
    "opinion",
    "fossil",
    "comparison",
    "history",
    "debate",
    "paleo_explain",
    "casual",
    "image_caption",
    "did_you_know",
    "hypothetical",
    "museum",
    "deep_dive"
];

// Jaccard similarity check to prevent duplicates
function getJaccardSimilarity(str1, str2) {
    const tokenize = (str) => new Set(str.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean));
    const set1 = tokenize(str1);
    const set2 = tokenize(str2);
    if (set1.size === 0 || set2.size === 0) return 0;
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

// Check if a post is similar to any existing generated posts
function isDuplicate(newDescription, existingPosts, threshold = 0.55) {
    for (const post of existingPosts) {
        if (getJaccardSimilarity(newDescription, post.description) > threshold) {
            return true;
        }
    }
    return false;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate realistic description text based on pattern and dinosaur ground truth
function generatePostContent(pattern, dino, altDino = null) {
    const stats = dino.stats || {};
    const name = dino.name;
    const period = stats.period || "Mesozoic";
    const diet = stats.diet || "Omnivore";
    const location = stats.location || "global regions";
    const speed = stats.speed || "varying speeds";
    const length = stats.length || "various sizes";
    const weight = stats.weight || "massive tonnage";
    const lifespan = stats.lifespan || "unknown years";
    const height = stats.height || "varying heights";
    const firstDiscovered = dino.fossil?.firstDiscovered || "the past";
    const discoveredBy = dino.fossil?.discoveredBy || "paleontologists";

    switch (pattern) {
        case "fact":
            return {
                title: `Fascinating facts about ${name}`,
                description: `Did you know that ${name} lived during the ${period} period? Paleontologists estimate its maximum speed was around ${speed}. It's quite impressive how an animal of its physical stature was adapted so well for survival in prehistoric ${location}.`,
                postType: "fact",
                category: "Dino Facts"
            };
        case "image_obs":
            return {
                title: `Visual analysis of ${name}`,
                description: `Sharing a detailed observation of ${name}. Based on its skeletal structure, you can see how it was perfectly adapted to its ${diet.toLowerCase()} diet. The skull arrangement and teeth spacing tell a rich story of ecological adaptation during the ${period}.`,
                postType: "image",
                category: "Photo Upload"
            };
        case "question":
            return {
                title: `Metabolic questions on ${name}`,
                description: `I was thinking about the massive size of ${name} today. With a length of ${length} and weight estimated at ${weight}, how much food did it actually need to consume daily to maintain its metabolism? Sauropod/theropod digestion is such an interesting field.`,
                postType: "question",
                category: "Explorer Journal"
            };
        case "opinion":
            return {
                title: `My take on ${name}`,
                description: `Hot take: ${name} is one of the most underrated animals of the ${period} period. The biomechanics of how it defended itself or moved with a length of ${length} are way more interesting than standard theropods get credit for. What do you all think?`,
                postType: "opinion",
                category: "Explorer Journal"
            };
        case "fossil":
            return {
                title: `Fossil hunting for ${name}`,
                description: `Let's discuss the fossil records for ${name}. Most specimens have been recovered in ${location}, with the first major discovery tracing back to ${firstDiscovered} by ${discoveredBy}. The preservation quality there is exceptional.`,
                postType: "discovery",
                category: "Fossil Talk"
            };
        case "comparison":
            if (altDino) {
                return {
                    title: `Comparing ${name} and ${altDino.name}`,
                    description: `It is highly educational to compare ${name} with ${altDino.name} from the ${period} period. While ${name} was a ${diet.toLowerCase()} that reached a length of ${length}, ${altDino.name} occupied a different niche. The biodiversity of prehistoric ${location} was incredible.`,
                    postType: "comparison",
                    category: "Specimen Compare"
                };
            }
            return {
                title: `Niche comparison: ${name}`,
                description: `It is interesting to compare ${name} with other animals of its time. While some species relied on sheer size, ${name} seems to have evolved for agility, with a top speed of ${speed} and a weight of ${weight}.`,
                postType: "comparison",
                category: "Specimen Compare"
            };
        case "history":
            return {
                title: `Historical impact of ${name}`,
                description: `Historical records show that the first specimen of ${name} was a major discovery. Finding an animal that grew up to ${height} tall completely changed our view of prehistoric ecosystems in ${location} during the ${period} epoch.`,
                postType: "discovery",
                category: "Fossil Talk"
            };
        case "debate":
            return {
                title: `The social behaviors of ${name}`,
                description: `There's still an active debate regarding ${name}'s social behavior. Did they travel or hunt in packs, or were they solitary creatures? Given its ${diet.toLowerCase()} diet and the environment of ${location}, herd behavior seems very likely.`,
                postType: "discussion",
                category: "Explorer Journal"
            };
        case "paleo_explain":
            return {
                title: `Analyzing the lifespan of ${name}`,
                description: `When we analyze ${name} fossils, the bone density gives us clues about its lifespan, which is estimated to be ${lifespan}. Paleontologists use histology to count growth rings, similar to tree rings, to determine this.`,
                postType: "educational",
                category: "Educational Deep-Dive"
            };
        case "casual":
            return {
                title: `Late night reading about ${name}`,
                description: `Just spent three hours reading about ${name}. Honestly, the fact that it lived in ${location} during the ${period} is mind-blowing. Prehistoric Earth was a wild place, especially with animals weighing ${weight}!`,
                postType: "casual",
                category: "Explorer Journal"
            };
        case "image_caption":
            return {
                title: `Skeletal reconstruction of ${name}`,
                description: `A stunning look at ${name}. Notice the skeletal reconstruction showing its impressive ${length} length. The articulation of the vertebrae is spectacular.`,
                postType: "image",
                category: "Photo Upload"
            };
        case "did_you_know":
            return {
                title: `Quick facts: ${name}`,
                description: `Quick fact: ${name} belonged to the ${period} period. Weighing in at ${weight} and standing ${height} tall, it was a true giant of its ecosystem in prehistoric ${location}.`,
                postType: "fact",
                category: "Dino Facts"
            };
        case "hypothetical":
            return {
                title: `Encountering a ${name}`,
                description: `If you were to encounter ${name} in its natural habitat in prehistoric ${location}, do you think its ${speed} speed would make it impossible to escape from? Or would its size make it easy to spot from a distance?`,
                postType: "discussion",
                category: "Explorer Journal"
            };
        case "museum":
            return {
                title: `Seeing ${name} in person`,
                description: `If you ever get the chance, go see the ${name} fossil mount. Seeing its actual ${height} height and ${length} length in person gives you a completely different appreciation for its biomechanics.`,
                postType: "casual",
                category: "Fossil Talk"
            };
        case "deep_dive":
            return {
                title: `Evolutionary niche of ${name}`,
                description: `Let's dive deep into ${name}. Living in the ${period} period, this ${diet.toLowerCase()} represents an amazing evolutionary path. Its physical features, including a length of ${length} and location in ${location}, show how it successfully filled its ecological niche.`,
                postType: "educational",
                category: "Educational Deep-Dive"
            };
        default:
            return {
                title: `Reflections on ${name}`,
                description: `Reflecting on the history of ${name} and how it survived in prehistoric ${location}.`,
                postType: "text",
                category: "Explorer Journal"
            };
    }
}

const COMMENT_TEMPLATES = [
    "This is incredibly interesting! Thanks for sharing.",
    "I completely agree with this take. Prehistoric fauna deserves more appreciation!",
    "I read a recent paper arguing that Spinosaurus was a shoreline wader rather than an active swimmer. Biomechanics are tricky!",
    "Amazing read! Fossil hunting in that region is definitely on my bucket list.",
    "Great point about the hip structure. It's one of those taxonomy quirks that always surprises people.",
    "That specimen is absolutely breathtaking in person. You'll love it!",
    "I think the crest was definitely for communication. Must have sounded like a trombone!",
    "Interesting theory! I wonder how their cardiovascular systems adapted.",
    "Good point. I think we underestimate how much Deccan volcanism contributed to global cooling."
];

async function seedCommunity() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clean up previously seeded community posts (v1 or v2)
        console.log("Cleaning up old seeded posts...");
        const deleteRes = await Post.deleteMany({
            $or: [
                { seedMarker: "community-seed" },
                { description: /during fossil analysis/ } // match legacy v1 posts
            ]
        });
        console.log(`Deleted ${deleteRes.deletedCount} old seeded posts.`);

        const users = await User.find({});
        if (users.length === 0) {
            console.error("No users found. Please register users first.");
            process.exit(1);
        }

        const dinosaurs = await Dinosaur.find({});
        if (dinosaurs.length === 0) {
            console.error("No dinosaurs found. Please seed dinosaurs first.");
            process.exit(1);
        }

        console.log(`Available: ${users.length} users, ${dinosaurs.length} dinosaurs.`);

        const postsToInsert = [];
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // Distribute posts evenly/probabilistically across all users
        const targetPostCount = 120;
        let generatedPosts = [];

        for (let i = 0; i < targetPostCount; i++) {
            const user = users[i % users.length];
            const dino = dinosaurs[Math.floor(Math.random() * dinosaurs.length)];
            const altDino = dinosaurs[Math.floor(Math.random() * dinosaurs.length)];
            const pattern = PATTERNS[i % PATTERNS.length];

            const content = generatePostContent(pattern, dino, dino._id.toString() !== altDino._id.toString() ? altDino : null);

            // Set tags dynamically
            const tags = [dino.name];
            if (dino.stats?.period) tags.push(dino.stats.period);
            if (dino.stats?.diet) tags.push(dino.stats.diet);
            
            // Jaccard similarity duplicate check
            if (isDuplicate(content.description, generatedPosts, 0.55)) {
                // If it is duplicate, try once more with a different dinosaur
                const fallbackDino = dinosaurs[(Math.floor(Math.random() * dinosaurs.length) + 1) % dinosaurs.length];
                const newContent = generatePostContent(pattern, fallbackDino);
                content.title = newContent.title;
                content.description = newContent.description;
            }

            // Assign image if the pattern indicates an image post (image_obs, image_caption)
            let image = "";
            let type = "text";
            if ((pattern === "image_obs" || pattern === "image_caption") && dino.images?.heroBackground) {
                image = dino.images.heroBackground;
                type = "photo";
            }

            const postDate = getRandomDate(ninetyDaysAgo, new Date());

            // Generate likes
            const numLikes = Math.floor(Math.random() * Math.min(users.length, 6));
            const likes = [];
            const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
            for (let l = 0; l < numLikes; l++) {
                if (shuffledUsers[l]._id.toString() !== user._id.toString()) {
                    likes.push(shuffledUsers[l]._id);
                }
            }

            // Generate comments
            const numComments = Math.floor(Math.random() * 3);
            const comments = [];
            for (let c = 0; c < numComments; c++) {
                const commentAuthor = users[Math.floor(Math.random() * users.length)];
                const commentText = COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)];
                const commentDate = getRandomDate(postDate, new Date());
                comments.push({
                    author: commentAuthor._id,
                    text: commentText,
                    createdAt: commentDate,
                    updatedAt: commentDate
                });
            }

            const postDoc = {
                author: user._id,
                dinosaur: dino._id,
                title: content.title,
                description: content.description,
                category: content.category,
                type: type,
                postType: content.postType,
                image: image,
                tags: tags,
                likes: likes,
                comments: comments,
                seedMarker: "community-seed",
                seedVersion: "v2",
                createdAt: postDate,
                updatedAt: postDate
            };

            generatedPosts.push(postDoc);
            postsToInsert.push(postDoc);
        }

        console.log(`Inserting ${postsToInsert.length} smart dinosaur posts...`);
        const inserted = await Post.insertMany(postsToInsert);

        console.log("\nCommunity Seeder 2.0 Stats");
        console.log("--------------------------");
        console.log(`Users found: ${users.length}`);
        console.log(`Dinosaurs found: ${dinosaurs.length}`);
        console.log(`Posts inserted: ${inserted.length}`);

        // Distribution stats
        const dist = {};
        inserted.forEach(p => {
            dist[p.author.toString()] = (dist[p.author.toString()] || 0) + 1;
        });
        console.log("\nDistribution per user:");
        for (const user of users) {
            console.log(`${user.name} → ${dist[user._id.toString()] || 0} posts`);
        }

        console.log("\nSeeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedCommunity();
