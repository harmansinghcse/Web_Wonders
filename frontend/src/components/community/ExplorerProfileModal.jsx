import React, { useState, useEffect } from "react";
import { X, Trophy, Heart, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
    getUserProfileService, 
    getFollowersService, 
    getFollowingService, 
    followUserService, 
    unfollowUserService 
} from "../../services/communityService";

export default function ExplorerProfileModal({ explorerId, currentUser, posts = [], onFollowChanged, onUserClick, onClose }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState("profile"); // "profile" | "followers" | "following"
    const [peopleList, setPeopleList] = useState([]);
    const [peopleLoading, setPeopleLoading] = useState(false);
    const [followPending, setFollowPending] = useState(false);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            const res = await getUserProfileService(explorerId);
            if (res.success) {
                setProfile(res.data);
            }
        } catch (e) {
            console.error("Error loading profile details:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (explorerId) {
            loadProfileData();
            setCurrentView("profile");
        }
    }, [explorerId]);

    const isSelf = profile?.id === currentUser?.id;

    // Filter user's posts
    const userPosts = posts.filter(
        (p) => p.author?.id === profile?.id
    );
    const userHybridsCount = userPosts.filter((p) => p.type === "hybrid" || p.badge === "Hybrid").length;
    const totalLikesReceived = userPosts.reduce((acc, p) => acc + (p.likes || 0), 0);

    const handleFollowToggle = async () => {
        if (followPending || !profile) return;
        try {
            setFollowPending(true);
            // Optimistic UI update
            const nextFollowing = !profile.isFollowing;
            setProfile(prev => ({
                ...prev,
                isFollowing: nextFollowing,
                followersCount: nextFollowing ? prev.followersCount + 1 : prev.followersCount - 1
            }));

            if (profile.isFollowing) {
                await unfollowUserService(profile.id);
            } else {
                await followUserService(profile.id);
            }
            if (onFollowChanged) {
                onFollowChanged(profile.id, !profile.isFollowing);
            }
        } catch (err) {
            // Revert state on error
            loadProfileData();
        } finally {
            setFollowPending(false);
        }
    };

    const handlePeopleListFollowToggle = async (targetId, currentIsFollowing) => {
        try {
            setPeopleList(prev => prev.map(p => {
                if (p.id === targetId) {
                    return { ...p, isFollowing: !currentIsFollowing };
                }
                return p;
            }));

            if (currentIsFollowing) {
                await unfollowUserService(targetId);
            } else {
                await followUserService(targetId);
            }

            if (onFollowChanged) {
                onFollowChanged(targetId, !currentIsFollowing);
            }
            // If viewing our own followers/following, refresh counts
            if (isSelf) {
                loadProfileData();
            }
        } catch (err) {
            // Revert list on error
            if (currentView === "followers") {
                loadFollowers();
            } else {
                loadFollowing();
            }
        }
    };

    const loadFollowers = async () => {
        try {
            setPeopleLoading(true);
            const res = await getFollowersService(profile.id);
            if (res.success) {
                setPeopleList(res.data);
            }
        } catch (e) {
            console.error("Error loading followers:", e);
        } finally {
            setPeopleLoading(false);
        }
    };

    const loadFollowing = async () => {
        try {
            setPeopleLoading(true);
            const res = await getFollowingService(profile.id);
            if (res.success) {
                setPeopleList(res.data);
            }
        } catch (e) {
            console.error("Error loading following list:", e);
        } finally {
            setPeopleLoading(false);
        }
    };

    useEffect(() => {
        if (profile && currentView === "followers") {
            loadFollowers();
        } else if (profile && currentView === "following") {
            loadFollowing();
        }
    }, [currentView, profile]);

    const badges = [
        { label: "Apex Hybridizer", icon: "🧬", color: "bg-purple-100/50 text-purple-900 border-purple-200" },
        { label: "Master Excavator", icon: "🦴", color: "bg-amber-100/50 text-amber-900 border-amber-200" },
        { label: "Jurassic Pioneer", icon: "🏆", color: "bg-emerald-100/50 text-emerald-900 border-emerald-200" },
    ];

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className="w-full max-w-xl h-96 flex items-center justify-center rounded-3xl border border-[#E6E4D9] bg-white shadow-2xl">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2F7D4D] border-t-transparent" />
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#E6E4D9] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                
                {/* Profile Cover Banner */}
                <div className="h-28 w-full bg-gradient-to-r from-[#184D30] via-[#2F7D4D] to-[#122416] relative overflow-hidden flex items-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                    
                    {currentView !== "profile" && (
                        <button
                            onClick={() => setCurrentView("profile")}
                            className="absolute left-4 top-4 rounded-xl bg-white/20 p-2 text-white hover:bg-white/30 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        >
                            <ArrowLeft size={16} />
                            <span>Profile</span>
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Profile Info Page */}
                {currentView === "profile" && (
                    <div className="px-6 pb-6 pt-0 relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
                            <div className="flex items-end gap-3.5">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="h-22 w-22 rounded-2xl border-4 border-white object-cover shadow-xl bg-white shrink-0"
                                    />
                                ) : (
                                    <div className="h-22 w-22 rounded-2xl border-4 border-white shadow-xl bg-[#E4ECE3] flex items-center justify-center text-[#2A5231] font-bold text-3xl shrink-0">
                                        {profile.name ? profile.name[0].toUpperCase() : "E"}
                                    </div>
                                )}
                                <div className="mb-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-serif text-lg font-bold text-[#1E3A23]">
                                            {profile.name}
                                        </h3>
                                        <ShieldCheck size={16} className="text-[#2F7D4D]" />
                                    </div>
                                    <p className="text-[11px] font-bold text-[#6D7A6F] leading-tight">
                                        {profile.handle || "@explorer"} • <span className="text-[#2F7D4D]">{profile.role || "Explorer"}</span>
                                    </p>
                                </div>
                            </div>

                            {!isSelf && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleFollowToggle}
                                        disabled={followPending}
                                        className={`rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-md cursor-pointer ${
                                            profile.isFollowing
                                                ? "border border-[#1E3A23] bg-white text-[#1E3A23] hover:bg-[#F4F4EC]"
                                                : "bg-[#1E3A23] text-white hover:bg-[#152A19]"
                                        }`}
                                    >
                                        {profile.isFollowing ? "Following" : "Follow Explorer"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            navigate(`/community/messages?userId=${profile.id}`);
                                        }}
                                        className="rounded-xl px-4 py-2.5 text-xs font-bold bg-white border border-[#EBE8DB] text-[#1E3A23] hover:bg-[#FAF9F5] transition shadow-md cursor-pointer"
                                    >
                                        Message
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bio & Mutual Followers */}
                        <div className="mb-4">
                            <p className="text-xs text-[#4A554B] leading-relaxed bg-[#FAF9F5] p-3 rounded-xl border border-[#EBE8DB]">
                                {profile.bio || "Dedicated Jurassic Explorer and Prehistoric Geneticist. Researching ancient fossil lineages and engineering hybrid species."}
                            </p>
                            {profile.mutualText && (
                                <p className="text-[10px] text-[#2F7D4D] font-bold mt-1.5 ml-1">
                                    🤝 {profile.mutualText}
                                </p>
                            )}
                        </div>

                        {/* Social stats Row (Clickable) */}
                        <div className="grid grid-cols-4 gap-2 mb-4.5">
                            <div className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2.5 text-center">
                                <p className="text-[9px] font-bold uppercase text-[#6D7A6F]">Posts</p>
                                <p className="font-serif text-base font-black text-[#1E3A23]">{userPosts.length}</p>
                            </div>
                            <div className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2.5 text-center">
                                <p className="text-[9px] font-bold uppercase text-[#6D7A6F]">Hybrids</p>
                                <p className="font-serif text-base font-black text-[#2F7D4D]">{userHybridsCount}</p>
                            </div>
                            <button 
                                onClick={() => setCurrentView("followers")}
                                className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2.5 text-center hover:bg-[#EFEFE6] transition cursor-pointer"
                            >
                                <p className="text-[9px] font-bold uppercase text-[#6D7A6F]">Followers</p>
                                <p className="font-serif text-base font-black text-[#1E3A23]">{profile.followersCount}</p>
                            </button>
                            <button 
                                onClick={() => setCurrentView("following")}
                                className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2.5 text-center hover:bg-[#EFEFE6] transition cursor-pointer"
                            >
                                <p className="text-[9px] font-bold uppercase text-[#6D7A6F]">Following</p>
                                <p className="font-serif text-base font-black text-[#1E3A23]">{profile.followingCount}</p>
                            </button>
                        </div>

                        {/* Badges Section */}
                        <div className="mb-4">
                            <h4 className="text-[10px] font-bold text-[#1E3A23] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={12} className="text-[#D97706]" />
                                Prehistoric Badges
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {badges.map((b, idx) => (
                                    <span
                                        key={idx}
                                        className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold ${b.color}`}
                                    >
                                        <span>{b.icon}</span>
                                        <span>{b.label}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Discoveries Showcase */}
                        <div>
                            <h4 className="text-[10px] font-bold text-[#1E3A23] mb-2 uppercase tracking-wider">
                                Recent Discoveries ({userPosts.length})
                            </h4>
                            {userPosts.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1">
                                    {userPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2 space-y-1"
                                        >
                                            {post.image && (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="h-16 w-full rounded-lg object-cover"
                                                />
                                            )}
                                            <h5 className="text-[11px] font-bold text-[#1E3A23] truncate">{post.title}</h5>
                                            <div className="flex justify-between items-center text-[9px] text-[#6D7A6F]">
                                                <span className="font-semibold">{post.badge || "Post"}</span>
                                                <span className="flex items-center gap-1 text-red-600 font-bold">
                                                    <Heart size={9} className="fill-red-600" /> {post.likes}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[11px] text-[#6D7A6F] italic bg-[#FAF9F5] p-3 rounded-xl text-center">
                                    No public discoveries shared yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Followers & Following Lists Page */}
                {currentView !== "profile" && (
                    <div className="p-6">
                        <h4 className="font-serif text-lg font-bold text-[#1E3A23] mb-4">
                            {currentView === "followers" ? "Followers List" : "Following List"}
                        </h4>

                        {peopleLoading ? (
                            <div className="flex h-44 items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#2F7D4D] border-t-transparent" />
                            </div>
                        ) : peopleList.length > 0 ? (
                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                {peopleList.map((person) => {
                                    const isSelfPerson = person.id === currentUser?.id;
                                    return (
                                        <div
                                            key={person.id}
                                            className="flex items-center justify-between p-3 rounded-2xl border border-[#E6E4D9] bg-[#FAF9F5] hover:bg-white transition"
                                        >
                                            <div 
                                                onClick={() => {
                                                    if (onUserClick) {
                                                        onUserClick(person.id);
                                                    }
                                                }}
                                                className="flex items-center gap-3 cursor-pointer"
                                            >
                                                {person.avatar ? (
                                                    <img
                                                        src={person.avatar}
                                                        alt={person.name}
                                                        className="h-10 w-10 rounded-xl object-cover border border-[#1E3A23]/20"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-xl bg-[#E4ECE3] flex items-center justify-center text-[#2A5231] font-bold text-lg">
                                                        {person.name[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs font-bold text-[#1E3A23]">{person.name}</span>
                                                        <ShieldCheck size={12} className="text-[#2F7D4D]" />
                                                    </div>
                                                    <span className="text-[10px] text-[#6D7A6F] block mt-0.5">
                                                        {person.handle} • {person.role}
                                                    </span>
                                                </div>
                                            </div>

                                            {!isSelfPerson && (
                                                <button
                                                    onClick={() => handlePeopleListFollowToggle(person.id, person.isFollowing)}
                                                    className={`rounded-xl px-3 py-1.5 text-[10px] font-bold transition cursor-pointer shadow-xs ${
                                                        person.isFollowing
                                                            ? "border border-[#1E3A23] bg-white text-[#1E3A23]"
                                                            : "bg-[#1E3A23] text-white"
                                                    }`}
                                                >
                                                    {person.isFollowing ? "Following" : "Follow"}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-[#6D7A6F] italic text-center py-10 bg-[#FAF9F5] rounded-2xl">
                                {currentView === "followers" ? "No followers yet." : "Not following anyone yet."}
                            </p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
