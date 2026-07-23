import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Newspaper,
    Dna,
    FileText,
    Bookmark,
    User,
    Settings,
    Heart,
    MessageSquare,
    Share2,
    Repeat,
    MoreHorizontal,
    Image as ImageIcon,
    Target,
    Check,
    X,
    Sparkles,
    Hash,
    Bell,
    Swords,
    Search,
    ShieldCheck
} from "lucide-react";

import Navbar from "../components/home_components/hero/Navbar";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/profileService";
import {
    fetchPostsService,
    createPostService,
    likePostService,
    addCommentService,
    toggleSaveService,
    toggleFollowService
} from "../services/communityService";
import { getStoredFollows } from "../services/communityServiceHelpers";

// Community subcomponents
import ExplorerProfileModal from "../components/community/ExplorerProfileModal";
import HybridBattleModal from "../components/community/HybridBattleModal";
import NotificationsModal from "../components/community/NotificationsModal";
import CreatePostModal from "../components/community/CreatePostModal";

export default function Community() {
    // 1. DYNAMIC CURRENT USER STATE (from AuthContext, backend API /api/profile, or localStorage)
    const { user: authUser } = useAuth();
    const [apiProfile, setApiProfile] = useState(null);

    // Fetch user profile from API as well to guarantee fresh profile name & avatar
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getProfile();
                if (res && res.profile) {
                    setApiProfile(res.profile);
                }
            } catch (e) {
                // Silently fallback if not logged in via cookie
            }
        };
        loadProfile();
    }, []);

    const currentUser = useMemo(() => {
        const u = authUser || apiProfile;
        if (u) {
            const rawName = u.name || u.username || u.email?.split("@")[0] || "Explorer";
            return {
                name: rawName,
                handle: `@${rawName.toLowerCase().replace(/\s+/g, "_")}`,
                role: u.role || u.rank || "Explorer",
                avatar: u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
                bio: u.bio || "Dedicated Jurassic Explorer and Prehistoric Geneticist.",
                id: u._id || u.id || "user-logged",
            };
        }
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                const rawName = parsed.name || parsed.username || parsed.email?.split("@")[0] || "Explorer";
                return {
                    name: rawName,
                    handle: `@${rawName.toLowerCase().replace(/\s+/g, "_")}`,
                    role: parsed.role || parsed.rank || "Explorer",
                    avatar: parsed.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
                    bio: parsed.bio || "Dedicated Jurassic Explorer and Prehistoric Geneticist.",
                    id: parsed._id || parsed.id || "user-logged",
                };
            }
        } catch (e) {
            // fallback
        }
        return {
            name: "Explorer",
            handle: "@explorer",
            role: "Explorer",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
            bio: "Dedicated Jurassic Explorer and Prehistoric Geneticist.",
            id: "user-default",
        };
    }, [authUser, apiProfile]);

    // Posts state
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sidebar active navigation tab ('feed', 'hybrids', 'myposts', 'saved')
    const [activeTab, setActiveTab] = useState("feed");

    // Search query & tag filter
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createModalType, setCreateModalType] = useState("text");
    const [createModalTitle, setCreateModalTitle] = useState("");
    const [createModalTag, setCreateModalTag] = useState("");

    const [activeProfileExplorer, setActiveProfileExplorer] = useState(null);
    const [activeBattleHybrid, setActiveBattleHybrid] = useState(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Comment Modal State
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [newCommentText, setNewCommentText] = useState("");

    // Remix Modal State
    const [activeRemixPost, setActiveRemixPost] = useState(null);
    const [remixAttack, setRemixAttack] = useState(85);
    const [remixDefense, setRemixDefense] = useState(90);

    // Quick Composer Text State
    const [quickPostText, setQuickPostText] = useState("");

    // Suggested Explorers State
    const [suggestedExplorers, setSuggestedExplorers] = useState([
        {
            id: "exp-1",
            name: "Rohan Explorer",
            handle: "@rohan_explore",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
            role: "Senior Paleontologist",
            bio: "Specializing in Jurassic sauropod bone structures and fossil excavations.",
            isFollowing: false,
        },
        {
            id: "exp-2",
            name: "Palak FossilHunter",
            handle: "@palak_fossil",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250",
            role: "Fossil Analyst",
            bio: "Uncovering ancient amber specimens and Cretaceous footprints.",
            isFollowing: false,
        },
        {
            id: "exp-3",
            name: "Aarav DinoFan",
            handle: "@aarav_dinofan",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
            role: "Genetic Engineer",
            bio: "Designing apex predator hybrids with reinforced defensive armor.",
            isFollowing: false,
        },
    ]);

    // Toast Notification
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Load initial posts & sync stored follows on mount
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const fetchedPosts = await fetchPostsService();
            setPosts(fetchedPosts);

            const follows = getStoredFollows();
            if (follows.length > 0) {
                setSuggestedExplorers((prev) =>
                    prev.map((exp) => ({ ...exp, isFollowing: follows.includes(exp.id) }))
                );
            }
            setLoading(false);
        };
        loadInitialData();
    }, []);

    // Dynamic Trending Hybrids
    const trendingHybrids = useMemo(() => {
        const hybrids = posts.filter(
            (p) => p.type === "hybrid" || p.badge === "Hybrid" || p.tags?.includes("#Hybrids")
        );

        const defaultHybrids = [
            {
                id: "trend-1",
                title: "Dracorex",
                author: { name: "Rohan Explorer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250" },
                likes: 230,
                image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=100",
                stats: { attack: 88, defense: 82, speed: 75, size: "Large" }
            },
            {
                id: "trend-2",
                title: "Velocirhino",
                author: { name: "Palak FossilHunter", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250" },
                likes: 189,
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=100",
                stats: { attack: 94, defense: 70, speed: 90, size: "Medium" }
            },
        ];

        const combinedMap = new Map();
        [...hybrids, ...defaultHybrids].forEach((item) => {
            const key = item.title?.trim().toLowerCase() || item.id;
            if (!combinedMap.has(key)) {
                combinedMap.set(key, item);
            } else if ((item.likes || 0) > (combinedMap.get(key).likes || 0)) {
                combinedMap.set(key, item);
            }
        });

        return Array.from(combinedMap.values())
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 3);
    }, [posts]);

    // Dynamic Recent Fossil Finds
    const recentFossils = useMemo(() => {
        const fossils = posts.filter(
            (p) =>
                p.type === "fossil" ||
                p.badge === "Fossil" ||
                p.tags?.includes("#Fossils") ||
                p.tags?.includes("#FossilFind")
        );

        const defaultFossils = [
            {
                id: "fossil-1",
                title: "Triceratops Horn Fossil",
                author: { name: "Aarav DinoFan" },
                likes: 132,
                image: "/spinosaurus_skull.jpg",
            },
            {
                id: "fossil-2",
                title: "Ammonite Shell",
                author: { name: "Palak FossilHunter" },
                likes: 98,
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=100",
            },
        ];

        const combinedMap = new Map();
        [...fossils, ...defaultFossils].forEach((item) => {
            const key = item.title?.trim().toLowerCase() || item.id;
            if (!combinedMap.has(key)) combinedMap.set(key, item);
        });

        return Array.from(combinedMap.values()).slice(0, 3);
    }, [posts]);

    // Publish New Post Handler (Attributed dynamically to currentUser)
    const handlePublishPost = async (newPostData) => {
        // Ensure author is explicitly current user
        const postToSave = {
            ...newPostData,
            author: currentUser,
        };

        setPosts((prev) => [postToSave, ...prev]);
        setActiveTab("feed");
        setSelectedTag(null);
        setSearchQuery("");
        setIsCreateOpen(false);

        showToast(`🎉 Published as ${currentUser.name}!`);

        try {
            await createPostService(postToSave);
        } catch (err) {
            console.error("Async save post error:", err);
        }
    };

    // Quick Composer Submit
    const handleQuickPostSubmit = (e) => {
        e.preventDefault();
        if (!quickPostText.trim()) return;

        handlePublishPost({
            id: `post-${Date.now()}`,
            author: currentUser,
            timeAgo: "Just now",
            category: "Explorer Journal",
            type: "text",
            title: "Explorer Note",
            badge: "Post",
            description: quickPostText.trim(),
            likes: 1,
            commentsCount: 0,
            isLiked: true,
            isSaved: false,
            comments: [],
            tags: ["#JurassicJourney"],
        });

        setQuickPostText("");
    };

    // Dynamic Like Handler
    const handleLike = async (postId) => {
        const updated = await likePostService(postId, posts);
        setPosts(updated);
    };

    // Dynamic Comment Handler
    const handleAddComment = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!newCommentText.trim() || !activeCommentPost) return;

        const commentObj = {
            id: `c-${Date.now()}`,
            user: currentUser.name,
            text: newCommentText.trim(),
            timestamp: "Just now",
        };

        const updated = await addCommentService(activeCommentPost.id, commentObj, posts);
        setPosts(updated);

        setActiveCommentPost((prev) => ({
            ...prev,
            commentsCount: (prev.commentsCount || 0) + 1,
            comments: [...(prev.comments || []), commentObj],
        }));

        setNewCommentText("");
        showToast("Comment published!");
    };

    // Dynamic Save / Bookmark Handler
    const handleToggleSave = (postId) => {
        const updated = toggleSaveService(postId, posts);
        setPosts(updated);
        const target = updated.find((p) => p.id === postId);
        showToast(target?.isSaved ? "Saved to your bookmarks!" : "Removed from bookmarks");
    };

    // Dynamic Remix Handler
    const handlePublishRemix = async () => {
        if (!activeRemixPost) return;

        const remixedPost = {
            id: `post-remix-${Date.now()}`,
            author: currentUser,
            timeAgo: "Just now",
            category: "Remixed a hybrid",
            type: "hybrid",
            title: `${activeRemixPost.title} Prime`,
            badge: "Remix",
            description: `Custom remixed variant engineered by ${currentUser.name}! Attack: ${remixAttack}, Defense: ${remixDefense}.`,
            image: activeRemixPost.image,
            stats: {
                attack: remixAttack,
                defense: remixDefense,
                speed: 75,
                size: "Huge",
            },
            likes: 1,
            commentsCount: 0,
            isLiked: true,
            isSaved: false,
            comments: [],
            tags: ["#Hybrids", "#Remix"],
        };

        setPosts((prev) => [remixedPost, ...prev]);
        setActiveTab("feed");
        setActiveRemixPost(null);
        showToast(`🎉 Published ${activeRemixPost.title} Prime remix as ${currentUser.name}!`);

        try {
            await createPostService(remixedPost);
        } catch (err) {
            console.error("Async remix save error:", err);
        }
    };

    // Dynamic Follow Handler
    const handleFollow = (expId) => {
        const { updatedExplorers } = toggleFollowService(expId, suggestedExplorers);
        setSuggestedExplorers(updatedExplorers);
        const target = updatedExplorers.find((e) => e.id === expId);
        showToast(target?.isFollowing ? `You are now following ${target.name}` : `Unfollowed ${target?.name}`);
    };

    // Filter Posts dynamically by Sidebar Tab, Search, and Tag
    const filteredPosts = posts.filter((post) => {
        // Tab filtering
        if (activeTab === "hybrids") {
            // Show hybrids created by currentUser OR all hybrids if user has none
            const userHybrids = posts.filter(
                (p) => (p.type === "hybrid" || p.badge === "Hybrid") &&
                (p.author?.name?.toLowerCase() === currentUser.name.toLowerCase() || p.author?.handle === currentUser.handle)
            );
            if (userHybrids.length > 0) {
                if (post.author?.name?.toLowerCase() !== currentUser.name.toLowerCase() && post.author?.handle !== currentUser.handle) {
                    return false;
                }
            } else if (post.type !== "hybrid" && post.badge !== "Hybrid") {
                return false;
            }
        }

        if (activeTab === "myposts") {
            if (post.author?.name?.toLowerCase() !== currentUser.name.toLowerCase() && post.author?.handle !== currentUser.handle) {
                return false;
            }
        }

        if (activeTab === "saved") {
            if (!post.isSaved) return false;
        }

        // Hashtag filtering
        if (selectedTag && !post.tags?.includes(selectedTag) && !post.description?.includes(selectedTag)) {
            return false;
        }

        // Search query filtering
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesTitle = post.title?.toLowerCase().includes(q);
            const matchesDesc = post.description?.toLowerCase().includes(q);
            const matchesAuthor = post.author?.name?.toLowerCase().includes(q);
            if (!matchesTitle && !matchesDesc && !matchesAuthor) return false;
        }

        return true;
    });

    return (
        <div className="relative min-h-screen font-sans text-[#2C352E]">
            {/* FRONT PAGE PARCHMENT & ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/jurrasic-home-bg.png"
                    alt="Jurassic Background"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0E1A11]/60 via-[#F8F6F1]/80 to-[#F8F6F1]/95 backdrop-blur-[3px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#FFFFFF_0%,transparent_60%)] opacity-40" />
            </div>

            {/* TOP FLOATING NAVBAR */}
            <header className="relative z-30 pt-4 pb-2">
                <Navbar />
            </header>

            {/* MAIN COMMUNITY HUB CONTENT */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* LEFT SIDEBAR (3 cols) */}
                    <aside className="space-y-5 lg:col-span-3">
                        {/* Current User Quick Badge */}
                        <div
                            onClick={() => setActiveProfileExplorer(currentUser)}
                            className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-3.5 shadow-md backdrop-blur-md cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
                        >
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="h-12 w-12 rounded-xl object-cover border-2 border-[#1E3A23]/30 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-sm font-bold text-[#1E3A23] truncate">
                                        {currentUser.name}
                                    </h3>
                                    <ShieldCheck size={14} className="text-[#2F7D4D] shrink-0" />
                                </div>
                                <p className="text-[11px] text-[#6D7A6F] font-semibold truncate">
                                    {currentUser.handle} • <span className="text-[#2F7D4D] font-bold">{currentUser.role}</span>
                                </p>
                            </div>
                        </div>

                        {/* Primary Action Button */}
                        <button
                            onClick={() => {
                                setCreateModalType("text");
                                setCreateModalTitle("");
                                setCreateModalTag("");
                                setIsCreateOpen(true);
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#184D30] via-[#1F5C38] to-[#2F7D4D] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-98 cursor-pointer"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            <span>Create Post</span>
                        </button>

                        {/* Sidebar Navigation Links */}
                        <div className="rounded-2xl border border-white/60 bg-white/85 p-3 shadow-md backdrop-blur-md space-y-1">
                            <button
                                onClick={() => { setActiveTab("feed"); setSelectedTag(null); setSearchQuery(""); }}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                    activeTab === "feed"
                                        ? "bg-[#1E3A23] text-white shadow-xs"
                                        : "text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                }`}
                            >
                                <Newspaper size={18} />
                                <span>Feed</span>
                            </button>

                            <button
                                onClick={() => { setActiveTab("hybrids"); setSelectedTag(null); setSearchQuery(""); }}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                    activeTab === "hybrids"
                                        ? "bg-[#1E3A23] text-white shadow-xs"
                                        : "text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                }`}
                            >
                                <Dna size={18} />
                                <span>My Hybrids</span>
                            </button>

                            <button
                                onClick={() => { setActiveTab("myposts"); setSelectedTag(null); setSearchQuery(""); }}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                    activeTab === "myposts"
                                        ? "bg-[#1E3A23] text-white shadow-xs"
                                        : "text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                }`}
                            >
                                <FileText size={18} />
                                <span>My Posts</span>
                            </button>

                            <button
                                onClick={() => { setActiveTab("saved"); setSelectedTag(null); setSearchQuery(""); }}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                    activeTab === "saved"
                                        ? "bg-[#1E3A23] text-white shadow-xs"
                                        : "text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                }`}
                            >
                                <Bookmark size={18} />
                                <span>Saved Posts</span>
                            </button>

                            <button
                                onClick={() => setActiveProfileExplorer(currentUser)}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-[#4A554B] transition hover:bg-[#EFEFE6] hover:text-[#1E3A23] cursor-pointer"
                            >
                                <User size={18} />
                                <span>My Passport</span>
                            </button>

                            <button
                                onClick={() => setIsNotificationsOpen(true)}
                                className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold text-[#4A554B] transition hover:bg-[#EFEFE6] hover:text-[#1E3A23] cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <Bell size={18} />
                                    <span>Notifications</span>
                                </div>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9381E] text-[10px] font-extrabold text-white">
                                    2
                                </span>
                            </button>
                        </div>
                    </aside>

                    {/* CENTER MAIN FEED (6 cols) */}
                    <section className="space-y-5 lg:col-span-6">
                        
                        {/* Interactive Quick Feed Composer */}
                        <form
                            onSubmit={handleQuickPostSubmit}
                            className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md"
                        >
                            <div className="flex items-start gap-3">
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    onClick={() => setActiveProfileExplorer(currentUser)}
                                    className="h-11 w-11 rounded-full object-cover border-2 border-[#1E3A23]/30 shrink-0 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <textarea
                                        rows={2}
                                        value={quickPostText}
                                        onChange={(e) => setQuickPostText(e.target.value)}
                                        placeholder={`What's on your mind, ${currentUser.name}?`}
                                        className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] px-4 py-2.5 text-sm text-[#2C352E] placeholder-[#819083] transition focus:border-[#1E3A23] focus:bg-white focus:outline-none resize-none"
                                    />

                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0EFE8] pt-3">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => { setCreateModalType("text"); setIsCreateOpen(true); }}
                                                className="flex items-center gap-1.5 rounded-lg border border-[#E1DEC9] bg-[#FBFBF8] px-3 py-1.5 text-xs font-semibold text-[#4A554B] hover:bg-[#EFEFE6] cursor-pointer"
                                            >
                                                <FileText size={14} className="text-[#627265]" />
                                                <span>Text</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setCreateModalType("hybrid"); setIsCreateOpen(true); }}
                                                className="flex items-center gap-1.5 rounded-lg border border-[#E1DEC9] bg-[#FBFBF8] px-3 py-1.5 text-xs font-semibold text-[#4A554B] hover:bg-[#EFEFE6] cursor-pointer"
                                            >
                                                <Dna size={14} className="text-[#2F7D4D]" />
                                                <span>Share Hybrid</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setCreateModalType("photo"); setIsCreateOpen(true); }}
                                                className="flex items-center gap-1.5 rounded-lg border border-[#E1DEC9] bg-[#FBFBF8] px-3 py-1.5 text-xs font-semibold text-[#4A554B] hover:bg-[#EFEFE6] cursor-pointer"
                                            >
                                                <ImageIcon size={14} className="text-[#3B82F6]" />
                                                <span>Photo</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setCreateModalType("fossil"); setIsCreateOpen(true); }}
                                                className="flex items-center gap-1.5 rounded-lg border border-[#E1DEC9] bg-[#FBFBF8] px-3 py-1.5 text-xs font-semibold text-[#4A554B] hover:bg-[#EFEFE6] cursor-pointer"
                                            >
                                                <Target size={14} className="text-[#D97706]" />
                                                <span>Fossil Find</span>
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            className="rounded-xl bg-[#1E3A23] px-6 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#152A19] active:scale-95 cursor-pointer"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Search & Tag Active Filter Banner */}
                        {(selectedTag || searchQuery || activeTab !== "feed") && (
                            <div className="flex items-center justify-between rounded-xl bg-[#1E3A23] px-4 py-2.5 text-xs font-bold text-white shadow-xs">
                                <div className="flex items-center gap-2">
                                    <Hash size={14} />
                                    <span>
                                        {activeTab === "myposts"
                                            ? `Showing My Posts (${filteredPosts.length})`
                                            : activeTab === "hybrids"
                                            ? `Showing My Hybrids (${filteredPosts.length})`
                                            : activeTab === "saved"
                                            ? `Showing Saved Bookmarks (${filteredPosts.length})`
                                            : selectedTag
                                            ? `Tag Filter: ${selectedTag}`
                                            : `Search: "${searchQuery}"`}
                                    </span>
                                </div>
                                <button
                                    onClick={() => { setActiveTab("feed"); setSelectedTag(null); setSearchQuery(""); }}
                                    className="rounded-md bg-white/20 p-1 hover:bg-white/30 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Feed Items */}
                        {loading ? (
                            <div className="rounded-2xl border border-white/60 bg-white/90 p-8 text-center shadow-md">
                                <span className="text-4xl animate-bounce">🦖</span>
                                <p className="mt-3 text-sm font-bold text-[#1E3A23]">Loading Prehistoric Feed...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="rounded-2xl border border-white/60 bg-white/90 p-8 text-center shadow-md space-y-3">
                                <span className="text-4xl">🦖</span>
                                <h3 className="text-base font-bold text-[#1E3A23]">No community posts found</h3>
                                <p className="text-xs text-[#687A6C]">
                                    {activeTab === "myposts"
                                        ? `You haven't created any posts as ${currentUser.name} yet!`
                                        : activeTab === "hybrids"
                                        ? `You haven't engineered any hybrid species yet!`
                                        : activeTab === "saved"
                                        ? "You haven't bookmarked any posts yet."
                                        : "Try resetting your search query or tag filters."}
                                </p>
                                <div className="flex justify-center gap-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setCreateModalType(activeTab === "hybrids" ? "hybrid" : "text");
                                            setIsCreateOpen(true);
                                        }}
                                        className="rounded-xl bg-[#1E3A23] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#152A19] cursor-pointer"
                                    >
                                        Create New Post
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab("feed"); setSelectedTag(null); setSearchQuery(""); }}
                                        className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] px-4 py-2.5 text-xs font-bold text-[#556358] cursor-pointer"
                                    >
                                        Reset View
                                    </button>
                                </div>
                            </div>
                        ) : (
                            filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-md backdrop-blur-md transition duration-200 hover:shadow-lg"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between p-4 pb-3">
                                        <div
                                            onClick={() => setActiveProfileExplorer(post.author || currentUser)}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <img
                                                src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                                                alt={post.author?.name || "Explorer"}
                                                className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/30 group-hover:border-[#2F7D4D] transition"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-[#1E3A23] group-hover:text-[#2F7D4D] transition">
                                                        {post.author?.name || "Explorer"}
                                                    </h4>
                                                    <span className="rounded-md bg-[#E4ECE3] px-2 py-0.5 text-[10px] font-bold text-[#2A5231]">
                                                        {post.author?.role || "Explorer"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#6D7A6F]">
                                                    {post.timeAgo} • {post.category}
                                                </p>
                                            </div>
                                        </div>

                                        <button className="rounded-full p-1.5 text-[#6D7A6F] hover:bg-[#F7F6F0] cursor-pointer">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>

                                    {/* Card Body */}
                                    {post.type === "hybrid" ? (
                                        /* HYBRID SPLIT CARD LAYOUT */
                                        <div className="px-4 pb-3">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {/* Left Specimen Image */}
                                                <div className="overflow-hidden rounded-xl border border-[#E1DEC9] bg-[#0E1A11] relative">
                                                    <img
                                                        src={post.image || "/tyrastego_hybrid.jpg"}
                                                        alt={post.title}
                                                        className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                </div>

                                                {/* Right Info & Stats */}
                                                <div className="flex flex-col justify-between space-y-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-serif text-lg font-bold text-[#1E3A23]">
                                                                {post.title}
                                                            </h3>
                                                            <span className="rounded-full bg-[#E2EFE0] px-2.5 py-0.5 text-[10px] font-bold text-[#27482D]">
                                                                {post.badge || "Hybrid"}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-xs leading-relaxed text-[#4A554B]">
                                                            {post.description}
                                                        </p>
                                                    </div>

                                                    {/* 4 Stat Cards */}
                                                    {post.stats && (
                                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                                            <div className="rounded-xl bg-[#FDF2F2] p-2.5 text-center border border-[#F8D7D7]">
                                                                <p className="text-[10px] font-medium text-[#9B1C1C]">Attack</p>
                                                                <p className="text-base font-extrabold text-[#C53030]">{post.stats.attack}</p>
                                                            </div>
                                                            <div className="rounded-xl bg-[#EBF8FF] p-2.5 text-center border border-[#BEE3F8]">
                                                                <p className="text-[10px] font-medium text-[#2C5282]">Defense</p>
                                                                <p className="text-base font-extrabold text-[#2B6CB0]">{post.stats.defense}</p>
                                                            </div>
                                                            <div className="rounded-xl bg-[#FEFCBF] p-2.5 text-center border border-[#FAF089]">
                                                                <p className="text-[10px] font-medium text-[#744210]">Speed</p>
                                                                <p className="text-base font-extrabold text-[#B7791F]">{post.stats.speed}</p>
                                                            </div>
                                                            <div className="rounded-xl bg-[#EDF2F7] p-2.5 text-center border border-[#E2E8F0]">
                                                                <p className="text-[10px] font-medium text-[#4A554B]">Size</p>
                                                                <p className="text-sm font-extrabold text-[#2D3748] mt-0.5">{post.stats.size}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* STANDARD POST LAYOUT */
                                        <div className="space-y-3 px-4 pb-3">
                                            {post.image && (
                                                <div className="overflow-hidden rounded-xl border border-[#E1DEC9]">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-serif text-base font-bold text-[#1E3A23]">
                                                    {post.title}
                                                </h3>
                                                <p className="mt-1 text-xs leading-relaxed text-[#4A554B]">
                                                    {post.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Bar Footer */}
                                    <div className="flex items-center justify-between border-t border-[#F0EFE8] px-4 py-2.5 bg-[#FAF9F5]/90">
                                        <div className="flex items-center gap-4 text-xs font-semibold text-[#556358]">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className={`flex items-center gap-1.5 transition cursor-pointer ${
                                                    post.isLiked ? "text-[#D9381E]" : "hover:text-[#D9381E]"
                                                }`}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={post.isLiked ? "fill-[#D9381E]" : ""}
                                                />
                                                <span>{post.likes}</span>
                                            </button>

                                            <button
                                                onClick={() => setActiveCommentPost(post)}
                                                className="flex items-center gap-1.5 transition hover:text-[#1E3A23] cursor-pointer"
                                            >
                                                <MessageSquare size={16} />
                                                <span>{post.commentsCount || 0}</span>
                                            </button>

                                            <button
                                                onClick={() => showToast("Post link copied to clipboard!")}
                                                className="flex items-center gap-1.5 transition hover:text-[#1E3A23] cursor-pointer"
                                            >
                                                <Share2 size={16} />
                                                <span className="hidden sm:inline">Share</span>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {post.type === "hybrid" && (
                                                <button
                                                    onClick={() => setActiveBattleHybrid(post)}
                                                    className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 transition hover:bg-amber-100 cursor-pointer"
                                                >
                                                    <Swords size={14} className="text-amber-700" />
                                                    <span>Compare</span>
                                                </button>
                                            )}

                                            {post.type === "hybrid" ? (
                                                <button
                                                    onClick={() => {
                                                        setActiveRemixPost(post);
                                                        setRemixAttack(post.stats?.attack || 85);
                                                        setRemixDefense(post.stats?.defense || 90);
                                                    }}
                                                    className="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-bold text-[#2C352E] shadow-2xs transition hover:bg-[#EFEFE6] hover:border-[#1E3A23] cursor-pointer"
                                                >
                                                    <Repeat size={14} />
                                                    <span>Remix</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleSave(post.id)}
                                                    className={`p-1 transition cursor-pointer ${
                                                        post.isSaved ? "text-[#1E3A23]" : "text-[#859487] hover:text-[#1E3A23]"
                                                    }`}
                                                >
                                                    <Bookmark size={18} className={post.isSaved ? "fill-[#1E3A23]" : ""} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </section>

                    {/* RIGHT SIDEBAR (3 cols) */}
                    <aside className="space-y-5 lg:col-span-3">
                        
                        {/* DYNAMIC TRENDING HYBRIDS WIDGET */}
                        <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
                            <div className="flex items-center justify-between pb-3">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles size={16} className="text-[#D97706]" />
                                    <h3 className="font-serif text-sm font-bold text-[#1E3A23]">
                                        Trending Hybrids
                                    </h3>
                                </div>
                                <button
                                    onClick={() => { setActiveTab("hybrids"); setSelectedTag(null); }}
                                    className="text-xs font-bold text-[#1E3A23] hover:underline cursor-pointer"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {trendingHybrids.map((hybrid, idx) => {
                                    const rankBadgeColor =
                                        idx === 0
                                            ? "bg-[#F59E0B]"
                                            : idx === 1
                                            ? "bg-[#94A3B8]"
                                            : "bg-[#D97706]";

                                    return (
                                        <div
                                            key={hybrid.id || idx}
                                            onClick={() => {
                                                setSearchQuery(hybrid.title);
                                                setActiveTab("feed");
                                            }}
                                            className="flex items-center justify-between rounded-xl bg-[#FAF9F5] p-2 border border-[#F0ECE1] transition hover:bg-[#EFEFE6] cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${rankBadgeColor} text-[10px] font-extrabold text-white`}>
                                                    {idx + 1}
                                                </span>
                                                <img
                                                    src={
                                                        hybrid.image ||
                                                        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=100"
                                                    }
                                                    alt={hybrid.title}
                                                    className="h-9 w-9 shrink-0 rounded-lg object-cover border border-[#1E3A23]/20"
                                                />
                                                <div className="truncate">
                                                    <h4 className="text-xs font-bold text-[#1E3A23] truncate">
                                                        {hybrid.title}
                                                    </h4>
                                                    <p className="text-[10px] text-[#6D7A6F] truncate">
                                                        by {hybrid.author?.name || "Explorer"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-[#D9381E] shrink-0">
                                                <Heart size={12} className="fill-[#D9381E]" />
                                                <span>{hybrid.likes || 0}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DYNAMIC RECENT FOSSIL FINDS WIDGET */}
                        <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
                            <div className="flex items-center justify-between pb-3">
                                <div className="flex items-center gap-1.5">
                                    <Target size={16} className="text-[#D97706]" />
                                    <h3 className="font-serif text-sm font-bold text-[#1E3A23]">
                                        Recent Fossil Finds
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedTag("#FossilFind")}
                                    className="text-xs font-bold text-[#1E3A23] hover:underline cursor-pointer"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {recentFossils.map((fossil, idx) => (
                                    <div
                                        key={fossil.id || idx}
                                        onClick={() => {
                                            setSelectedTag("#FossilFind");
                                            setActiveTab("feed");
                                        }}
                                        className="flex items-center justify-between rounded-xl bg-[#FAF9F5] p-2 border border-[#F0ECE1] transition hover:bg-[#EFEFE6] cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                                            {fossil.image ? (
                                                <img
                                                    src={fossil.image}
                                                    alt={fossil.title}
                                                    className="h-9 w-9 shrink-0 rounded-lg object-cover border border-[#1E3A23]/20"
                                                />
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F2E6] text-base">
                                                    🦴
                                                </div>
                                            )}
                                            <div className="truncate">
                                                <h4 className="text-xs font-bold text-[#1E3A23] truncate">
                                                    {fossil.title}
                                                </h4>
                                                <p className="text-[10px] text-[#6D7A6F] truncate">
                                                    by {fossil.author?.name || "Explorer"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-[#D9381E] shrink-0">
                                            <Heart size={12} className="fill-[#D9381E]" />
                                            <span>{fossil.likes || 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Popular Tags Widget */}
                        <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
                            <h3 className="pb-3 font-serif text-sm font-bold text-[#1E3A23]">
                                Popular Tags
                            </h3>

                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    "#Hybrids",
                                    "#Fossils",
                                    "#DinosaurArt",
                                    "#Expeditions",
                                    "#JurassicJourney",
                                    "#FossilFind",
                                    "#Paleontology",
                                ].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                                            selectedTag === tag
                                                ? "bg-[#1E3A23] text-white"
                                                : "bg-[#F3F2EB] text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Suggested Explorers Widget */}
                        <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="font-serif text-sm font-bold text-[#1E3A23]">
                                    Suggested Explorers
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {suggestedExplorers.map((exp) => (
                                    <div
                                        key={exp.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div
                                            onClick={() => setActiveProfileExplorer(exp)}
                                            className="flex items-center gap-2.5 cursor-pointer group"
                                        >
                                            <img
                                                src={exp.avatar}
                                                alt={exp.name}
                                                className="h-8 w-8 rounded-full object-cover border border-[#1E3A23]/30 group-hover:border-[#2F7D4D]"
                                            />
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-[#1E3A23] group-hover:text-[#2F7D4D] truncate">
                                                    {exp.name}
                                                </h4>
                                                <p className="text-[10px] text-[#6D7A6F] truncate">
                                                    {exp.handle}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleFollow(exp.id)}
                                            className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                                                exp.isFollowing
                                                    ? "border border-[#1E3A23] bg-white text-[#1E3A23]"
                                                    : "bg-[#1E3A23] text-white hover:bg-[#152A19]"
                                            }`}
                                        >
                                            {exp.isFollowing ? "Following" : "Follow"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* DYNAMIC CREATE POST MODAL */}
            {isCreateOpen && (
                <CreatePostModal
                    currentUser={currentUser}
                    initialType={createModalType}
                    initialTitle={createModalTitle}
                    initialTag={createModalTag}
                    onSubmit={handlePublishPost}
                    onClose={() => setIsCreateOpen(false)}
                />
            )}

            {/* DYNAMIC EXPLORER PROFILE PASSPORT MODAL */}
            {activeProfileExplorer && (
                <ExplorerProfileModal
                    explorer={activeProfileExplorer}
                    currentUser={currentUser}
                    posts={posts}
                    onFollow={handleFollow}
                    onClose={() => setActiveProfileExplorer(null)}
                />
            )}

            {/* DYNAMIC HYBRID BATTLE COMPARISON MODAL */}
            {activeBattleHybrid && (
                <HybridBattleModal
                    hybrid={activeBattleHybrid}
                    allPosts={posts}
                    onClose={() => setActiveBattleHybrid(null)}
                />
            )}

            {/* DYNAMIC NOTIFICATIONS MODAL */}
            {isNotificationsOpen && (
                <NotificationsModal
                    currentUser={currentUser}
                    onClose={() => setIsNotificationsOpen(false)}
                />
            )}

            {/* DYNAMIC COMMENT MODAL */}
            {activeCommentPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E6E4D9]">
                        <div className="flex items-center justify-between border-b border-[#F0EFE8] px-5 py-3.5 bg-[#FAF9F5]">
                            <h3 className="font-serif text-base font-bold text-[#1E3A23]">
                                Discussion ({activeCommentPost.commentsCount || 0})
                            </h3>
                            <button
                                onClick={() => setActiveCommentPost(null)}
                                className="rounded-full p-1 text-[#6D7A6F] hover:bg-[#EFEFE6] cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                            {activeCommentPost.comments?.length > 0 ? (
                                activeCommentPost.comments.map((c) => (
                                    <div key={c.id} className="rounded-2xl bg-[#FAF9F5] p-3 border border-[#F0ECE1]">
                                        <div className="flex justify-between">
                                            <p className="text-xs font-bold text-[#1E3A23]">{c.user}</p>
                                            <span className="text-[10px] text-[#8A968C]">{c.timestamp || "Just now"}</span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-[#4A554B]">{c.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-xs text-[#8A968C] py-4">No comments yet. Be the first to comment!</p>
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="flex items-center gap-2 border-t border-[#F0EFE8] p-3 bg-[#FAF9F5]">
                            <input
                                type="text"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder={`Comment as ${currentUser.name}...`}
                                className="flex-1 rounded-xl border border-[#E1DEC9] bg-white px-3.5 py-2 text-xs text-[#2C352E] focus:border-[#1E3A23] focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-[#1E3A23] px-4 py-2 text-xs font-bold text-white hover:bg-[#162D1B] cursor-pointer"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* DYNAMIC REMIX MODAL */}
            {activeRemixPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E6E4D9]">
                        <div className="flex items-center justify-between border-b border-[#F0EFE8] px-5 py-3.5 bg-[#FAF9F5]">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-[#D97706]" />
                                <h3 className="font-serif text-base font-bold text-[#1E3A23]">
                                    Remix {activeRemixPost.title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setActiveRemixPost(null)}
                                className="rounded-full p-1 text-[#6D7A6F] hover:bg-[#EFEFE6] cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <p className="text-xs text-[#4A554B]">
                                Re-engineer {activeRemixPost.title} with custom attributes. Output will be published as a new specimen created by <strong className="text-[#1E3A23]">{currentUser.name}</strong>!
                            </p>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-[#C53030]">
                                    <span>Attack Power</span>
                                    <span>{remixAttack}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={remixAttack}
                                    onChange={(e) => setRemixAttack(Number(e.target.value))}
                                    className="mt-1 w-full accent-[#C53030]"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-[#2B6CB0]">
                                    <span>Armor & Defense</span>
                                    <span>{remixDefense}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={remixDefense}
                                    onChange={(e) => setRemixDefense(Number(e.target.value))}
                                    className="mt-1 w-full accent-[#2B6CB0]"
                                />
                            </div>

                            <button
                                onClick={handlePublishRemix}
                                className="w-full rounded-xl bg-[#1E3A23] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#162D1B] cursor-pointer"
                            >
                                Publish Remixed Hybrid
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#1E3A23] px-4 py-3 text-xs font-bold text-white shadow-2xl border border-white/20">
                    <Check size={16} className="text-[#A3E635]" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
