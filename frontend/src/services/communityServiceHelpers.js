const LOCAL_STORAGE_POSTS_KEY = "jurassic_community_posts";
const LOCAL_STORAGE_FOLLOWS_KEY = "jurassic_community_follows";

const INITIAL_POSTS = [
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
        isLiked: false,
        isSaved: false,
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
        isLiked: false,
        isSaved: false,
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
        isLiked: false,
        isSaved: false,
        comments: [
            { id: "c4", user: "Karan", text: "Awesome footage!", timestamp: "18 hours ago" }
        ],
        tags: ["#Expeditions", "#JurassicJourney", "#Art"]
    }
];

export const getStoredPosts = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(INITIAL_POSTS));
        return INITIAL_POSTS;
    } catch {
        return INITIAL_POSTS;
    }
};

export const savePostsToStorage = (posts) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
        console.error("Error saving posts to localStorage", e);
    }
};

export const getStoredFollows = () => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_FOLLOWS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const saveFollowsToStorage = (follows) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_FOLLOWS_KEY, JSON.stringify(follows));
    } catch (e) {
        console.error("Error saving follows to localStorage", e);
    }
};
