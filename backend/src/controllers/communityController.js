// Controller for Jurassic Explorer Community API

let communityPosts = [
    {
        id: "post-1",
        author: {
            name: "Meshvi",
            handle: "@meshvi",
            role: "Explorer",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        },
        timeAgo: "2 hours ago",
        category: "Shared a hybrid",
        type: "hybrid",
        title: "Tyrastego",
        badge: "Hybrid",
        description:
            "A powerful hybrid of T-Rex and Stegosaurus. Strong armor with a fierce bite!",
        image: "/tyrastego_hybrid.jpg",
        stats: {
            attack: 85,
            defense: 90,
            speed: 65,
            size: "Huge",
        },
        likes: 125,
        commentsCount: 42,
        comments: [
            { id: "c1", user: "Rohan Explorer", text: "That defense score is insane!", timestamp: "1 hour ago" },
            { id: "c2", user: "Palak FossilHunter", text: "Would love to see this in battle!", timestamp: "45 mins ago" }
        ],
        tags: ["#Hybrids", "#DinosaurArt"]
    },
    {
        id: "post-2",
        author: {
            name: "Aarav",
            handle: "@aarav_dinofan",
            role: "Explorer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
        },
        timeAgo: "5 hours ago",
        category: "Fossil Find",
        type: "fossil",
        title: "Spinosaurus Skull",
        badge: "Fossil",
        description:
            "Found this amazing fossil near the river bed during our expedition. #FossilFind",
        image: "/spinosaurus_skull.jpg",
        likes: 98,
        commentsCount: 28,
        comments: [
            { id: "c3", user: "Diya", text: "What a spectacular discovery!", timestamp: "3 hours ago" }
        ],
        tags: ["#Fossils", "#FossilFind", "#Paleontology"]
    },
    {
        id: "post-3",
        author: {
            name: "Diya",
            handle: "@diya_explorer",
            role: "Explorer",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200",
        },
        timeAgo: "1 day ago",
        category: "Expedition Journal",
        type: "journal",
        title: "Expedition Diary - Day 24",
        badge: "Journal",
        description:
            "Today we discovered footprints near the waterfall. An unforgettable moment! #JurassicJourney",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
        likes: 76,
        commentsCount: 18,
        comments: [
            { id: "c4", user: "Karan", text: "Awesome footage!", timestamp: "18 hours ago" }
        ],
        tags: ["#Expeditions", "#JurassicJourney", "#Art"]
    }
];

const getPosts = async (req, res) => {
    try {
        res.json({ success: true, data: communityPosts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const createPost = async (req, res) => {
    try {
        const newPost = {
            id: `post-${Date.now()}`,
            timeAgo: "Just now",
            likes: 1,
            commentsCount: 0,
            comments: [],
            ...req.body
        };
        communityPosts.unshift(newPost);
        res.status(201).json({ success: true, data: newPost });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = communityPosts.find(p => p.id === id);
        if (post) {
            post.likes += 1;
            res.json({ success: true, likes: post.likes });
        } else {
            res.status(404).json({ success: false, message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, text } = req.body;
        const post = communityPosts.find(p => p.id === id);
        if (post) {
            const comment = { id: `c-${Date.now()}`, user, text, timestamp: "Just now" };
            post.comments.push(comment);
            post.commentsCount += 1;
            res.json({ success: true, data: comment, commentsCount: post.commentsCount });
        } else {
            res.status(404).json({ success: false, message: "Post not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getPosts,
    createPost,
    likePost,
    addComment
};
