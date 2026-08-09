import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Messages from "./Messages";
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
    ShieldCheck,
    Users
} from "lucide-react";

import Navbar from "../components/home_components/hero/Navbar";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/profileService";
import {
    fetchPostsService,
    createPostService,
    updatePostService,
    deletePostService,
    likePostService,
    addCommentService,
    deleteCommentService,
    updateCommentService,
    fetchCommentsService,
    followUserService,
    unfollowUserService,
    getFollowersService,
    getFollowingService,
    getSuggestedExplorersService,
    searchUsersService,
    factCheckPostService,
} from "../services/communityService";
import { getStoredFollows, saveFollowsToStorage } from "../services/communityServiceHelpers";
import { getAllDinosaurs } from "../services/dinosaurService";

// Community subcomponents
import ExplorerProfileModal from "../components/community/ExplorerProfileModal";
import HybridBattleModal from "../components/community/HybridBattleModal";
import NotificationsModal from "../components/community/NotificationsModal";
import CreatePostModal from "../components/community/CreatePostModal";

const Avatar = ({ user, className = "h-10 w-10 border border-[#1E3A23]/30" }) => {
    const [hasError, setHasError] = useState(false);
    
    // Reset hasError if the user avatar changes
    React.useEffect(() => {
        setHasError(false);
    }, [user?.avatar]);

    if (user?.avatar && !hasError) {
        return (
            <img
                src={user.avatar}
                alt={user.name || "Explorer"}
                onError={() => setHasError(true)}
                className={`${className} rounded-full object-cover shrink-0`}
            />
        );
    }
    return (
        <div className={`${className} rounded-full bg-[#E4ECE3] flex items-center justify-center text-[#2A5231] shrink-0`}>
            <User className="h-1/2 w-1/2" />
        </div>
    );
};

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
                avatar: u.avatar || "",
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
                    avatar: parsed.avatar || "",
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
            avatar: "",
            bio: "Dedicated Jurassic Explorer and Prehistoric Geneticist.",
            id: "user-default",
        };
    }, [authUser, apiProfile]);

    const isLoggedIn = !!authUser || !!apiProfile;

    const navigate = useNavigate();
    const { tab } = useParams();
    const [searchParams] = useSearchParams();
    const targetPostId = searchParams.get("postId");
    const targetCommentId = searchParams.get("commentId");

    const [highlightedCommentId, setHighlightedCommentId] = useState(null);

    useEffect(() => {
        if (targetCommentId) {
            setHighlightedCommentId(targetCommentId);
            const timer = setTimeout(() => {
                setHighlightedCommentId(null);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [targetCommentId]);

    useEffect(() => {
        if (targetPostId && posts.length > 0) {
            const foundPost = posts.find(p => p.id === targetPostId || p._id === targetPostId);
            if (foundPost) {
                const loadCommentsForTarget = async () => {
                    try {
                        const res = await fetchCommentsService(targetPostId);
                        if (res.success) {
                            setActiveCommentPost({
                                ...foundPost,
                                comments: res.comments
                            });
                        }
                    } catch (e) {
                        console.error(e);
                    }
                };
                loadCommentsForTarget();
            }
        }
    }, [targetPostId, posts]);

    useEffect(() => {
        if (activeCommentPost && targetCommentId) {
            setTimeout(() => {
                const el = document.getElementById(`comment-${targetCommentId}`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 500);
        }
    }, [activeCommentPost, targetCommentId]);

    useEffect(() => {
        if (tab === "following") {
            setActiveTab("following");
        } else if (tab === "discover") {
            setActiveTab("feed");
        } else if (tab === "messages") {
            setActiveTab("messages");
        } else {
            setActiveTab("feed");
        }
    }, [tab]);

    const navigateToProfile = (userObj) => {
        if (!userObj) return;
        const targetId = userObj.id || userObj._id || userObj;
        if (!targetId || targetId === "user-default" || targetId === "user-logged" || targetId === currentUser?.id) {
            navigate("/profile");
        } else {
            navigate(`/profile/${targetId}`);
        }
    };

    const ensureAuth = () => {
        if (!isLoggedIn) {
            showToast("Please log in first!");
            return false;
        }
        return true;
    };

    // Posts state
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
    const [postToEdit, setPostToEdit] = useState(null);
    const [activeMenuPostId, setActiveMenuPostId] = useState(null);

    const [activeProfileExplorer, setActiveProfileExplorer] = useState(null);
    const [activeBattleHybrid, setActiveBattleHybrid] = useState(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Comment Modal State
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [newCommentText, setNewCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

    // Remix Modal State
    const [activeRemixPost, setActiveRemixPost] = useState(null);
    const [remixAttack, setRemixAttack] = useState(85);
    const [remixDefense, setRemixDefense] = useState(90);

    // Quick Composer Text State
    const [quickPostText, setQuickPostText] = useState("");

    // Filter states
    const [selectedPostType, setSelectedPostType] = useState("all");
    const [selectedDinosaurId, setSelectedDinosaurId] = useState("");
    const [selectedSort, setSelectedSort] = useState("newest");
    const [dinosaursList, setDinosaursList] = useState([]);
    const [factcheckingPostId, setFactcheckingPostId] = useState(null);
    const [expandedFactcheckPostIds, setExpandedFactcheckPostIds] = useState(new Set());

    const toggleFactcheckExpand = (postId) => {
        setExpandedFactcheckPostIds(prev => {
            const next = new Set(prev);
            if (next.has(postId)) {
                next.delete(postId);
            } else {
                next.add(postId);
            }
            return next;
        });
    };

    // Follow state (persisted in database)
    const [followedUserIds, setFollowedUserIds] = useState([]);
    const [followPendingId, setFollowPendingId] = useState(null);

    // Suggested explorers state
    const [suggestedExplorers, setSuggestedExplorers] = useState([]);
    const [suggestedLoading, setSuggestedLoading] = useState(false);

    // User Search state
    const [userSearchInput, setUserSearchInput] = useState("");
    const [userSearchSuggestions, setUserSearchSuggestions] = useState([]);

    // Right Sidebar Search state
    const [rightSearchInput, setRightSearchInput] = useState("");
    const [rightSearchSuggestions, setRightSearchSuggestions] = useState([]);

    // Toast Notification
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Load following IDs list
    const loadFollowedUserIds = async () => {
        if (!isLoggedIn || !currentUser.id || currentUser.id === "user-default") return;
        try {
            const res = await getFollowingService(currentUser.id);
            if (res.success) {
                setFollowedUserIds(res.data.map(u => u.id));
            }
        } catch (e) {
            console.error("Error loading following list:", e);
        }
    };

    // Load suggested explorers list
    const loadSuggestedExplorers = async () => {
        if (!isLoggedIn) return;
        try {
            setSuggestedLoading(true);
            const res = await getSuggestedExplorersService();
            if (res.success) {
                setSuggestedExplorers(res.data);
            }
        } catch (e) {
            console.error("Error loading suggested explorers:", e);
        } finally {
            setSuggestedLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            loadFollowedUserIds();
            loadSuggestedExplorers();
        }
    }, [isLoggedIn, currentUser.id]);

    // Simple search debounce effect
    useEffect(() => {
        if (!userSearchInput.trim()) {
            setUserSearchSuggestions([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await searchUsersService(userSearchInput);
                if (res.success) {
                    setUserSearchSuggestions(res.data);
                }
            } catch (e) {
                console.error("Error searching users:", e);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [userSearchInput]);

    // Simple search debounce effect for right sidebar search
    useEffect(() => {
        if (!rightSearchInput.trim()) {
            setRightSearchSuggestions([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await searchUsersService(rightSearchInput);
                if (res.success) {
                    setRightSearchSuggestions(res.data);
                }
            } catch (e) {
                console.error("Error searching users:", e);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [rightSearchInput]);

    // Fetch dinosaurs list on mount
    useEffect(() => {
        const fetchDinos = async () => {
            try {
                const list = await getAllDinosaurs();
                if (list) {
                    setDinosaursList(list);
                }
            } catch (err) {
                console.error("Failed to load dinosaurs list:", err);
            }
        };
        fetchDinos();
    }, []);

    // Load initial posts with pagination and tab filter
    const loadFeedData = async (pageNum = 1, append = false, currentTab = activeTab) => {
        try {
            setLoading(true);
            const queryOptions = {
                feedMode: currentTab,
                postType: selectedPostType,
                dinosaurId: selectedDinosaurId,
                sort: selectedSort,
            };
            const res = await fetchPostsService(pageNum, 20, queryOptions);
            if (res.success) {
                if (append) {
                    setPosts((prev) => {
                        const mergedMap = new Map();
                        [...prev, ...res.data].forEach(p => mergedMap.set(p.id, p));
                        return Array.from(mergedMap.values());
                    });
                } else {
                    setPosts(res.data);
                }
                setTotalPages(res.pagination?.totalPages || 1);
                setPage(pageNum);
            }
        } catch (err) {
            console.error("Error loading feed:", err);
            showToast("Failed to load community feed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeedData(1, false, activeTab);
    }, [activeTab, selectedPostType, selectedDinosaurId, selectedSort]);

    // Dynamic Trending Hybrids
    const trendingHybrids = useMemo(() => {
        return posts.filter(
            (p) => p.type === "hybrid" || p.badge === "Hybrid" || p.tags?.includes("#Hybrids")
        )
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 3);
    }, [posts]);

    // Dynamic Recent Fossil Finds
    const recentFossils = useMemo(() => {
        return posts.filter(
            (p) =>
                p.type === "fossil" ||
                p.badge === "Fossil" ||
                p.tags?.includes("#Fossils") ||
                p.tags?.includes("#FossilFind")
        ).slice(0, 3);
    }, [posts]);

    // Publish/Create/Edit Post Handler
    const handlePublishPost = async (formData) => {
        if (!ensureAuth()) return;
        try {
            if (postToEdit) {
                const res = await updatePostService(postToEdit.id, formData);
                if (res.success) {
                    setPosts((prev) => prev.map((p) => p.id === postToEdit.id ? res.data : p));
                    setPostToEdit(null);
                    setIsCreateOpen(false);
                    showToast("🎉 Post updated successfully!");
                }
            } else {
                const res = await createPostService(formData);
                if (res.success) {
                    setPosts((prev) => [res.data, ...prev]);
                    setIsCreateOpen(false);
                    showToast("🎉 Published discovery note!");
                }
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to submit post.");
        }
    };

    // Quick Composer Submit
    const handleQuickPostSubmit = async (e) => {
        e.preventDefault();
        if (!quickPostText.trim()) return;
        if (!ensureAuth()) return;

        const formData = new FormData();
        formData.append("type", "text");
        formData.append("title", "Explorer Note");
        formData.append("description", quickPostText.trim());
        formData.append("category", "Explorer Journal");
        formData.append("tags", JSON.stringify(["#JurassicJourney"]));

        try {
            await handlePublishPost(formData);
            setQuickPostText("");
        } catch (err) {
            console.error(err);
        }
    };

    // Dynamic Like Handler
    const handleLike = async (postId) => {
        if (!ensureAuth()) return;
        try {
            const res = await likePostService(postId);
            if (res.success) {
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === postId) {
                            return {
                                ...p,
                                likes: res.likesCount,
                                isLiked: res.isLiked,
                            };
                        }
                        return p;
                    })
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Dynamic Comment Handler
    const handleAddComment = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!newCommentText.trim() || !activeCommentPost) return;
        if (!ensureAuth()) return;

        try {
            const res = await addCommentService(activeCommentPost.id, newCommentText.trim());
            if (res.success) {
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === activeCommentPost.id) {
                            return {
                                ...p,
                                commentsCount: res.commentsCount,
                                comments: res.comments,
                            };
                        }
                        return p;
                    })
                );
                setActiveCommentPost((prev) => ({
                    ...prev,
                    commentsCount: res.commentsCount,
                    comments: res.comments,
                }));
                setNewCommentText("");
                showToast("Comment published!");
            }
        } catch (err) {
            showToast("Failed to add comment.");
        }
    };

    // Delete Comment Handler
    const handleDeleteComment = async (postId, commentId) => {
        if (!ensureAuth()) return;
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const res = await deleteCommentService(postId, commentId);
            if (res.success) {
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === postId) {
                            return {
                                ...p,
                                commentsCount: res.commentsCount,
                                comments: res.comments,
                            };
                        }
                        return p;
                    })
                );
                setActiveCommentPost((prev) => ({
                    ...prev,
                    commentsCount: res.commentsCount,
                    comments: res.comments,
                }));
                showToast("Comment deleted!");
            }
        } catch (err) {
            showToast("Failed to delete comment.");
        }
    };

    // Edit Comment Handler
    const handleEditComment = async (postId, commentId) => {
        if (!ensureAuth()) return;
        if (!editingCommentText || !editingCommentText.trim()) {
            showToast("Comment text cannot be empty.");
            return;
        }
        try {
            const res = await updateCommentService(postId, commentId, editingCommentText.trim());
            if (res.success) {
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === postId) {
                            return {
                                ...p,
                                commentsCount: res.commentsCount,
                                comments: res.comments,
                            };
                        }
                        return p;
                    })
                );
                setActiveCommentPost((prev) => ({
                    ...prev,
                    commentsCount: res.commentsCount,
                    comments: res.comments,
                }));
                setEditingCommentId(null);
                setEditingCommentText("");
                showToast("Comment updated!");
            }
        } catch (err) {
            showToast("Failed to edit comment.");
        }
    };

    // Delete Post Handler
    const handleDeletePost = async (postId) => {
        if (!ensureAuth()) return;
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await deletePostService(postId);
            if (res.success) {
                setPosts((prev) => prev.filter((p) => p.id !== postId));
                showToast("🗑️ Post deleted successfully.");
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete post.");
        }
    };

    // Fact Check Handler
    const handleFactCheckPost = async (postId) => {
        if (!ensureAuth()) return;
        setFactcheckingPostId(postId);
        try {
            const res = await factCheckPostService(postId);
            if (res.success) {
                setPosts((prev) =>
                    prev.map((p) => {
                        if (p.id === postId) {
                            return {
                                ...p,
                                factCheck: res.data,
                            };
                        }
                        return p;
                    })
                );
                showToast("✓ Post successfully fact-checked by Professor Ross!");
            }
        } catch (err) {
            console.error("Fact-check failed:", err);
            showToast("Failed to verify post fact-check.");
        } finally {
            setFactcheckingPostId(null);
        }
    };

    // Dynamic Save / Bookmark Handler
    const handleToggleSave = (postId) => {
        if (!ensureAuth()) return;
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id === postId) {
                    const nextSaved = !p.isSaved;
                    showToast(nextSaved ? "Saved to your bookmarks!" : "Removed from bookmarks");
                    return { ...p, isSaved: nextSaved };
                }
                return p;
            })
        );
    };

    // Dynamic Remix Handler
    const handlePublishRemix = async () => {
        if (!activeRemixPost) return;
        if (!ensureAuth()) return;

        const formData = new FormData();
        formData.append("type", "hybrid");
        formData.append("title", `${activeRemixPost.title} Prime`);
        formData.append("description", `Custom remixed variant engineered by ${currentUser.name}! Attack: ${remixAttack}, Defense: ${remixDefense}.`);
        formData.append("category", "Remixed a hybrid");
        formData.append("image", activeRemixPost.image || "");
        formData.append("stats", JSON.stringify({
            attack: remixAttack,
            defense: remixDefense,
            speed: 75,
            size: "Huge",
        }));
        formData.append("tags", JSON.stringify(["#Hybrids", "#Remix"]));

        try {
            const res = await createPostService(formData);
            if (res.success) {
                setPosts((prev) => [res.data, ...prev]);
                setActiveTab("feed");
                setActiveRemixPost(null);
                showToast(`🎉 Published ${activeRemixPost.title} Prime remix!`);
            }
        } catch (err) {
            showToast("Failed to publish remix.");
        }
    };

    // Dynamic Follow Handler
    const handleFollow = async (targetId) => {
        if (!ensureAuth()) return;
        if (followPendingId === targetId) return;

        const alreadyFollowing = followedUserIds.includes(targetId);

        try {
            setFollowPendingId(targetId);
            // Optimistic UI updates
            setFollowedUserIds(prev => 
                alreadyFollowing ? prev.filter(id => id !== targetId) : [...prev, targetId]
            );
            setSuggestedExplorers(prev => 
                prev.map(u => u.id === targetId ? { ...u, isFollowing: !alreadyFollowing } : u)
            );

            if (alreadyFollowing) {
                await unfollowUserService(targetId);
                showToast("Unfollowed explorer.");
            } else {
                await followUserService(targetId);
                showToast("Successfully followed explorer!");
            }
            
            // Refresh suggestion list and following state
            loadSuggestedExplorers();
            loadFollowedUserIds();
        } catch (err) {
            showToast("Failed to complete follow action.");
            loadFollowedUserIds();
        } finally {
            setFollowPendingId(null);
        }
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
                {tab === "messages" ? (
                    <div className="space-y-4">
                        {/* Subnav */}
                        <div className="flex gap-2 rounded-2xl border border-white/60 bg-white/95 p-2 shadow-sm mb-5">
                            {["feed", "following", "discover", "messages"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => navigate(`/community/${t === "feed" ? "" : t}`)}
                                    className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                        t === "messages"
                                            ? "bg-[#1E3A23] text-white shadow-sm"
                                            : "text-[#4A554B] hover:bg-[#FAF9F5] hover:text-[#1E3A23]"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <Messages />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    
                    {/* LEFT SIDEBAR (3 cols) */}
                    <aside className="space-y-5 lg:col-span-3">
                        {/* Search Users Widget */}
                        <div className="relative rounded-2xl border border-white/60 bg-white/95 p-3.5 shadow-md backdrop-blur-md">
                            <div className="flex items-center gap-2 border border-[#E6E4D9] bg-[#FAF9F5] rounded-xl px-3 py-2">
                                <Search size={16} className="text-[#6D7A6F]" />
                                <input
                                    type="text"
                                    value={userSearchInput}
                                    onChange={(e) => setUserSearchInput(e.target.value)}
                                    placeholder="Search explorers..."
                                    className="w-full bg-transparent text-xs font-semibold text-[#1E3A23] placeholder-[#8A968C] focus:outline-none"
                                />
                            </div>

                            {/* Search Suggestions Dropdown */}
                            {userSearchSuggestions.length > 0 && (
                                <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-2xl border border-[#E6E4D9] bg-white shadow-xl max-h-52 overflow-y-auto p-1.5 space-y-1">
                                    {userSearchSuggestions.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => {
                                                setActiveProfileExplorer(user);
                                                setUserSearchInput("");
                                                setUserSearchSuggestions([]);
                                            }}
                                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#FAF9F5] transition cursor-pointer"
                                        >
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="h-8 w-8 rounded-lg object-cover border border-[#1E3A23]/10"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-lg bg-[#E4ECE3] flex items-center justify-center text-[#2A5231] font-bold text-xs">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0 text-left">
                                                <h4 className="text-xs font-bold text-[#1E3A23] truncate leading-tight">
                                                    {user.name}
                                                </h4>
                                                <span className="text-[9px] text-[#6D7A6F] font-bold leading-none mt-0.5 block">
                                                    {user.handle}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Current User Quick Badge */}
                        <div
                            onClick={() => navigateToProfile(currentUser)}
                            className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-3.5 shadow-md backdrop-blur-md cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
                        >
                            <Avatar user={currentUser} className="h-12 w-12 rounded-xl" />
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
                                onClick={() => { setActiveTab("trending"); setSelectedTag(null); setSearchQuery(""); }}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                    activeTab === "trending"
                                        ? "bg-[#1E3A23] text-white shadow-xs"
                                        : "text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                }`}
                            >
                                <Sparkles size={18} />
                                <span>Trending</span>
                            </button>

                            <button
                                onClick={() => { setActiveTab("following"); setSelectedTag(null); setSearchQuery(""); }}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                                    activeTab === "following"
                                        ? "bg-[#1E3A23] text-white shadow-xs"
                                        : "text-[#4A554B] hover:bg-[#EFEFE6] hover:text-[#1E3A23]"
                                }`}
                            >
                                <Users size={18} />
                                <span>Following</span>
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
                            </button>
                        </div>
                    </aside>

                    {/* CENTER MAIN FEED (6 cols) */}
                    <section className="space-y-5 lg:col-span-6">
                        {/* Sub-navigation bar */}
                        <div className="flex gap-2 rounded-2xl border border-white/60 bg-white/95 p-2 shadow-sm">
                            {["feed", "following", "discover", "messages"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => {
                                        if (t === "messages") {
                                            navigate("/community/messages");
                                        } else {
                                            navigate(`/community/${t === "feed" ? "" : t}`);
                                        }
                                    }}
                                    className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                        (t === "feed" && (!tab || tab === "discover")) || tab === t
                                            ? "bg-[#1E3A23] text-white shadow-sm"
                                            : "text-[#4A554B] hover:bg-[#FAF9F5] hover:text-[#1E3A23]"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Interactive Quick Feed Composer */}
                        <form
                            onSubmit={handleQuickPostSubmit}
                            className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md"
                        >
                            <div className="flex items-start gap-3">
                                <Avatar
                                    user={currentUser}
                                    className="h-11 w-11 border-2 border-[#1E3A23]/30 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <textarea
                                        rows={2}
                                        value={quickPostText}
                                        onChange={(e) => setQuickPostText(e.target.value)}
                                        placeholder="What's on your mind, Explorer?"
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

                        {/* Feed Filters Bar */}
                        <div className="flex flex-wrap gap-2.5 items-center justify-between bg-white/70 backdrop-blur-md border border-[#EBE8DB] rounded-2xl p-4 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Post Type Filter */}
                                <select
                                    value={selectedPostType}
                                    onChange={(e) => setSelectedPostType(e.target.value)}
                                    className="rounded-xl border border-[#E1DEC9] bg-white px-3 py-1.5 text-xs text-[#4A554B] focus:border-[#1E3A23] focus:outline-none cursor-pointer"
                                >
                                    <option value="all">All Types</option>
                                    <option value="text">Text Posts</option>
                                    <option value="image">Image Posts</option>
                                    <option value="question">Questions</option>
                                    <option value="opinion">Opinions</option>
                                    <option value="discovery">Discoveries</option>
                                    <option value="educational">Educational</option>
                                    <option value="discussion">Discussions</option>
                                    <option value="fact">Facts</option>
                                </select>

                                {/* Dinosaur Filter */}
                                <select
                                    value={selectedDinosaurId}
                                    onChange={(e) => setSelectedDinosaurId(e.target.value)}
                                    className="rounded-xl border border-[#E1DEC9] bg-white px-3 py-1.5 text-xs text-[#4A554B] focus:border-[#1E3A23] focus:outline-none cursor-pointer max-w-[150px]"
                                >
                                    <option value="">All Dinosaurs</option>
                                    {dinosaursList.map(d => (
                                        <option key={d._id} value={d._id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Filter */}
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="rounded-xl border border-[#E1DEC9] bg-white px-3 py-1.5 text-xs text-[#4A554B] focus:border-[#1E3A23] focus:outline-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Engaging</option>
                            </select>
                        </div>

                        {/* Feed Items */}
                        {loading ? (
                            <div className="rounded-2xl border border-white/60 bg-white/90 p-8 text-center shadow-md">
                                <span className="text-4xl animate-bounce">🦖</span>
                                <p className="mt-3 text-sm font-bold text-[#1E3A23]">Loading Prehistoric Feed...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="rounded-2xl border border-white/60 bg-white/90 p-8 text-center shadow-md space-y-3">
                                <span className="text-4xl">🦖</span>
                                <h3 className="text-base font-bold text-[#1E3A23]">No community posts yet</h3>
                                <p className="text-xs text-[#687A6C]">
                                    Be the first to share something!
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
                                            onClick={() => navigateToProfile(post.author || currentUser)}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            {post.author?.avatar ? (
                                                <img
                                                    src={post.author.avatar}
                                                    alt={post.author?.name || "Explorer"}
                                                    className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/30 group-hover:border-[#2F7D4D] transition"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-[#E4ECE3] flex items-center justify-center border border-[#1E3A23]/30 group-hover:border-[#2F7D4D] transition font-bold text-xs text-[#2A5231]">
                                                    {post.author?.name ? post.author.name[0].toUpperCase() : "E"}
                                                </div>
                                            )}
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

                                        <div className="relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                                                }}
                                                className="rounded-full p-1.5 text-[#6D7A6F] hover:bg-[#F7F6F0] cursor-pointer"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                            {activeMenuPostId === post.id && (
                                                <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-[#EBE8DB] bg-white p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                                                    {(post.permissions?.canEdit || post.author?.id === currentUser?.id || post.author?.name === currentUser?.name) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPostToEdit(post);
                                                                setCreateModalType(post.type || "text");
                                                                setCreateModalTitle(post.title || "");
                                                                setIsCreateOpen(true);
                                                                setActiveMenuPostId(null);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-[#4A554B] hover:bg-[#FAF9F5] hover:text-[#1E3A23] cursor-pointer"
                                                        >
                                                            Edit Post
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFactCheckPost(post.id);
                                                            setActiveMenuPostId(null);
                                                        }}
                                                        disabled={factcheckingPostId === post.id}
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-[#1E3A23] hover:bg-[#FAF9F5] cursor-pointer disabled:opacity-50"
                                                    >
                                                        {factcheckingPostId === post.id ? "Fact-checking..." : "Fact-check with Ross"}
                                                    </button>
                                                    {(post.permissions?.canDelete || post.author?.id === currentUser?.id || post.author?.name === currentUser?.name || currentUser?.role === "admin") && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePost(post.id);
                                                                setActiveMenuPostId(null);
                                                            }}
                                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                                                        >
                                                            Delete Post
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
                                                        {post.factCheck && (
                                                            <div className="mt-2 rounded-xl border border-[#D1E2D3] bg-[#EBF5EE] p-2 text-[11px] text-[#1E3A23]">
                                                                <div 
                                                                    onClick={() => toggleFactcheckExpand(post.id)}
                                                                    className="flex items-center justify-between font-bold cursor-pointer hover:text-[#2F7D4D]"
                                                                >
                                                                    <div className="flex items-center gap-1.5">
                                                                        <ShieldCheck size={14} className="text-[#10B981]" />
                                                                        <span>Fact-checked by Ross: <span className="underline">{post.factCheck.verdict}</span></span>
                                                                    </div>
                                                                    <span>{expandedFactcheckPostIds.has(post.id) ? "▲" : "▼"}</span>
                                                                </div>
                                                                {expandedFactcheckPostIds.has(post.id) && (
                                                                    <div className="mt-1.5 border-t border-[#D1E2D3]/60 pt-1.5 leading-relaxed text-[#4A554B]">
                                                                        <p className="font-semibold mb-0.5">Verdict: {post.factCheck.verdict}</p>
                                                                        <p>{post.factCheck.explanation}</p>
                                                                        <p className="text-[9px] text-[#6D7A6F] mt-1 italic">Checked by {post.factCheck.checkedBy}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
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
                                                {post.factCheck && (
                                                    <div className="mt-2 rounded-xl border border-[#D1E2D3] bg-[#EBF5EE] p-2 text-[11px] text-[#1E3A23]">
                                                        <div 
                                                            onClick={() => toggleFactcheckExpand(post.id)}
                                                            className="flex items-center justify-between font-bold cursor-pointer hover:text-[#2F7D4D]"
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                <ShieldCheck size={14} className="text-[#10B981]" />
                                                                <span>Fact-checked by Ross: <span className="underline">{post.factCheck.verdict}</span></span>
                                                            </div>
                                                            <span>{expandedFactcheckPostIds.has(post.id) ? "▲" : "▼"}</span>
                                                        </div>
                                                        {expandedFactcheckPostIds.has(post.id) && (
                                                            <div className="mt-1.5 border-t border-[#D1E2D3]/60 pt-1.5 leading-relaxed text-[#4A554B]">
                                                                <p className="font-semibold mb-0.5">Verdict: {post.factCheck.verdict}</p>
                                                                <p>{post.factCheck.explanation}</p>
                                                                <p className="text-[9px] text-[#6D7A6F] mt-1 italic">Checked by {post.factCheck.checkedBy}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
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
                                                onClick={async () => {
                                                    setActiveCommentPost(post);
                                                    try {
                                                        const res = await fetchCommentsService(post.id);
                                                        if (res.success) {
                                                            setActiveCommentPost(prev => prev && prev.id === post.id ? {
                                                                ...prev,
                                                                comments: res.comments
                                                            } : prev);
                                                        }
                                                    } catch (e) {
                                                        console.error("Failed to fetch full comments:", e);
                                                    }
                                                }}
                                                className="flex items-center gap-1.5 transition hover:text-[#1E3A23] cursor-pointer"
                                            >
                                                <MessageSquare size={16} />
                                                <span>{post.commentsCount || 0}</span>
                                            </button>

                                            <button
                                                onClick={() => handleSharePost(post)}
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
                        {page < totalPages && (
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => loadFeedData(page + 1, true)}
                                    className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] hover:bg-[#EFEFE6] px-6 py-2.5 text-xs font-bold text-[#1E3A23] shadow-md cursor-pointer transition"
                                >
                                    Load More Posts
                                </button>
                            </div>
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
                                {trendingHybrids.length > 0 ? (
                                    trendingHybrids.map((hybrid, idx) => {
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
                                    })
                                ) : (
                                    <p className="text-center text-[10px] text-[#6D7A6F] py-2">No trending hybrids engineered yet.</p>
                                )}
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
                                {recentFossils.length > 0 ? (
                                    recentFossils.map((fossil, idx) => (
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
                                    ))
                                ) : (
                                    <p className="text-center text-[10px] text-[#6D7A6F] py-2">No fossil finds reported yet.</p>
                                )}
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

                        {/* User Search Widget */}
                        <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-md backdrop-blur-md">
                            <h3 className="pb-3 font-serif text-sm font-bold text-[#1E3A23]">
                                Search Explorers
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={rightSearchInput}
                                    onChange={(e) => setRightSearchInput(e.target.value)}
                                    placeholder="Search by name..."
                                    className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] px-3.5 py-2 text-xs text-[#2C352E] focus:border-[#1E3A23] focus:bg-white focus:outline-none"
                                />
                                {rightSearchInput && (
                                    <button 
                                        onClick={() => { setRightSearchInput(""); setRightSearchSuggestions([]); }}
                                        className="absolute right-2.5 top-2 text-[#859487] hover:text-[#1E3A23] cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            {rightSearchInput && (
                                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                    {rightSearchSuggestions.length > 0 ? (
                                        rightSearchSuggestions.map((u) => (
                                            <div
                                                key={u.id}
                                                onClick={() => {
                                                    setActiveProfileExplorer(u);
                                                    setRightSearchInput("");
                                                    setRightSearchSuggestions([]);
                                                }}
                                                className="flex items-center gap-2.5 cursor-pointer group hover:bg-[#FAF9F5] p-1.5 rounded-lg border border-transparent hover:border-[#F0ECE1] transition"
                                            >
                                                <Avatar user={u} className="h-7 w-7" />
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-[#1E3A23] group-hover:text-[#2F7D4D] truncate">
                                                        {u.name}
                                                    </h4>
                                                    <p className="text-[9px] text-[#6D7A6F] truncate">
                                                        {u.handle}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-[10px] text-[#6D7A6F]">No members found</p>
                                    )}
                                </div>
                            )}
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
                                        className="flex items-center justify-between gap-2"
                                    >
                                        <div
                                            onClick={() => setActiveProfileExplorer(exp)}
                                            className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1"
                                        >
                                            <Avatar user={exp} className="h-8 w-8" />
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-[#1E3A23] group-hover:text-[#2F7D4D] truncate">
                                                    {exp.name}
                                                </h4>
                                                <p className="text-[9px] text-[#6D7A6F] truncate">
                                                    {exp.handle}
                                                </p>
                                                {exp.mutualText && (
                                                    <p className="text-[8px] text-[#2F7D4D] font-bold truncate leading-none mt-0.5">
                                                        🤝 {exp.mutualText}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleFollow(exp.id)}
                                            className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer shrink-0 ${
                                                followedUserIds.includes(exp.id)
                                                    ? "border border-[#1E3A23] bg-white text-[#1E3A23]"
                                                    : "bg-[#1E3A23] text-white hover:bg-[#152A19]"
                                            }`}
                                        >
                                            {followedUserIds.includes(exp.id) ? "Following" : "Follow"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
                )}
            </main>

            {/* DYNAMIC CREATE POST MODAL */}
            {isCreateOpen && (
                <CreatePostModal
                    currentUser={currentUser}
                    initialType={createModalType}
                    initialTitle={createModalTitle}
                    initialTag={createModalTag}
                    onSubmit={handlePublishPost}
                    onClose={() => { setIsCreateOpen(false); setPostToEdit(null); }}
                    postToEdit={postToEdit}
                />
            )}

            {/* DYNAMIC EXPLORER PROFILE PASSPORT MODAL */}
            {activeProfileExplorer && (
                <ExplorerProfileModal
                    explorerId={activeProfileExplorer.id || activeProfileExplorer._id}
                    currentUser={currentUser}
                    posts={posts}
                    onFollowChanged={(targetId, nextFollowing) => {
                        setFollowedUserIds(prev => 
                            nextFollowing ? [...prev, targetId] : prev.filter(id => id !== targetId)
                        );
                        loadSuggestedExplorers();
                    }}
                    onUserClick={(userId) => {
                        setActiveProfileExplorer({ id: userId });
                    }}
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
                                activeCommentPost.comments.map((c) => {
                                    const isHighlighted = c.id === highlightedCommentId || c._id === highlightedCommentId;
                                    return (
                                        <div
                                            key={c.id}
                                            id={`comment-${c.id}`}
                                            className={`rounded-2xl p-3 border flex justify-between items-start gap-3 transition-all duration-500 ${
                                                isHighlighted 
                                                    ? "bg-[#EBF5EE] border-[#2F7D4D] ring-2 ring-[#2F7D4D]/20 scale-[1.02]" 
                                                    : "bg-[#FAF9F5] border-[#F0ECE1]"
                                            }`}
                                        >
                                        {c.avatar ? (
                                            <img
                                                src={c.avatar}
                                                alt={c.user}
                                                onClick={() => navigateToProfile(c.userId)}
                                                className="h-7 w-7 rounded-full object-cover border border-[#1E3A23]/30 cursor-pointer hover:scale-105 transition"
                                            />
                                        ) : (
                                            <div 
                                                onClick={() => navigateToProfile(c.userId)}
                                                className="h-7 w-7 rounded-full bg-[#E4ECE3] flex items-center justify-center border border-[#1E3A23]/30 cursor-pointer font-bold text-[10px] text-[#2A5231]"
                                            >
                                                {c.user ? c.user[0].toUpperCase() : "E"}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <p 
                                                    onClick={() => navigateToProfile(c.userId)}
                                                    className="text-xs font-bold text-[#1E3A23] cursor-pointer hover:underline"
                                                >
                                                    {c.user}
                                                </p>
                                                <span className="text-[10px] text-[#8A968C]">{c.timestamp || "Just now"}</span>
                                            </div>
                                            {editingCommentId === c.id ? (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <input
                                                        type="text"
                                                        value={editingCommentText}
                                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                                        className="flex-1 rounded-lg border border-[#E1DEC9] bg-white px-2 py-1 text-xs text-[#2C352E] focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleEditComment(activeCommentPost.id, c.id)}
                                                        className="rounded-lg bg-[#1E3A23] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#162D1B]"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="rounded-lg border border-[#E1DEC9] px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="mt-0.5 text-xs text-[#4A554B]">{c.text}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {(c.permissions?.canEdit || c.userId === currentUser.id) && editingCommentId !== c.id && (
                                                <button
                                                    onClick={() => {
                                                        setEditingCommentId(c.id);
                                                        setEditingCommentText(c.text);
                                                    }}
                                                    className="text-[#47613F] hover:text-[#385032] text-[10px] font-bold px-1"
                                                    title="Edit Comment"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {(c.permissions?.canDelete || c.userId === currentUser.id || currentUser.role === "admin") && (
                                                <button
                                                    onClick={() => handleDeleteComment(activeCommentPost.id, c.id)}
                                                    className="text-red-500 hover:text-red-700 p-0.5"
                                                    title="Delete Comment"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })
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
                    {toastMessage.toLowerCase().includes("failed") || toastMessage.toLowerCase().includes("please") || toastMessage.toLowerCase().includes("error") ? (
                        <X size={16} className="text-red-400" />
                    ) : (
                        <Check size={16} className="text-[#A3E635]" />
                    )}
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
