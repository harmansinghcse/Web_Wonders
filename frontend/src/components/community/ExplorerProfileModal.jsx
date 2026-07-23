import React from "react";
import { X, Trophy, Dna, FileText, Heart, Users, ShieldCheck, Check, Sparkles } from "lucide-react";

export default function ExplorerProfileModal({ explorer, currentUser, posts = [], onFollow, onClose }) {
    if (!explorer) return null;

    const isSelf = explorer.name?.toLowerCase() === currentUser?.name?.toLowerCase() || explorer.handle === currentUser?.handle;

    // Filter user's posts
    const userPosts = posts.filter(
        (p) => p.author?.name?.toLowerCase() === explorer.name?.toLowerCase() || p.author?.handle === explorer.handle
    );
    const userHybridsCount = userPosts.filter((p) => p.type === "hybrid" || p.badge === "Hybrid").length;
    const totalLikesReceived = userPosts.reduce((acc, p) => acc + (p.likes || 0), 0);

    const badges = [
        { label: "Apex Hybridizer", icon: "🧬", color: "bg-purple-100 text-purple-800 border-purple-200" },
        { label: "Master Excavator", icon: "🦴", color: "bg-amber-100 text-amber-800 border-amber-200" },
        { label: "Jurassic Pioneer", icon: "🏆", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#E6E4D9] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Profile Cover Banner */}
                <div className="h-32 w-full bg-gradient-to-r from-[#184D30] via-[#2F7D4D] to-[#122416] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Avatar & Header Section */}
                <div className="px-6 pb-6 pt-0 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
                        <div className="flex items-end gap-4">
                            <img
                                src={explorer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                                alt={explorer.name}
                                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-xl bg-white"
                            />
                            <div className="mb-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-xl font-bold text-[#1E3A23]">
                                        {explorer.name}
                                    </h3>
                                    <ShieldCheck size={18} className="text-[#2F7D4D]" />
                                </div>
                                <p className="text-xs font-semibold text-[#6D7A6F]">
                                    {explorer.handle || "@explorer"} • <span className="text-[#2F7D4D] font-bold">{explorer.role || "Explorer"}</span>
                                </p>
                            </div>
                        </div>

                        {!isSelf && onFollow && (
                            <button
                                onClick={() => onFollow(explorer.id || explorer.name)}
                                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-md cursor-pointer ${
                                    explorer.isFollowing
                                        ? "border border-[#1E3A23] bg-white text-[#1E3A23] hover:bg-[#F4F4EC]"
                                        : "bg-[#1E3A23] text-white hover:bg-[#152A19]"
                                }`}
                            >
                                {explorer.isFollowing ? "Following" : "Follow Explorer"}
                            </button>
                        )}
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#4A554B] leading-relaxed mb-5 bg-[#FAF9F5] p-3 rounded-xl border border-[#EBE8DB]">
                        {explorer.bio || "Dedicated Jurassic Explorer and Prehistoric Geneticist. Researching ancient fossil lineages and engineering hybrid species."}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                        <div className="rounded-2xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-[#6D7A6F]">Posts</p>
                            <p className="font-serif text-lg font-black text-[#1E3A23]">{userPosts.length}</p>
                        </div>
                        <div className="rounded-2xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-[#6D7A6F]">Hybrids</p>
                            <p className="font-serif text-lg font-black text-[#2F7D4D]">{userHybridsCount}</p>
                        </div>
                        <div className="rounded-2xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-[#6D7A6F]">Likes</p>
                            <p className="font-serif text-lg font-black text-[#D9381E]">{totalLikesReceived}</p>
                        </div>
                        <div className="rounded-2xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-[#6D7A6F]">Rank</p>
                            <p className="font-serif text-xs font-black text-[#D97706] mt-1">Lvl 42</p>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <div className="mb-5">
                        <h4 className="text-xs font-bold text-[#1E3A23] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} className="text-[#D97706]" />
                            Prehistoric Badges
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {badges.map((b, idx) => (
                                <span
                                    key={idx}
                                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${b.color}`}
                                >
                                    <span>{b.icon}</span>
                                    <span>{b.label}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Recent Discoveries Showcase */}
                    <div>
                        <h4 className="text-xs font-bold text-[#1E3A23] mb-2 uppercase tracking-wider">
                            Recent Discoveries ({userPosts.length})
                        </h4>
                        {userPosts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3.5 max-h-48 overflow-y-auto pr-1">
                                {userPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2.5 space-y-1.5"
                                    >
                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="h-20 w-full rounded-lg object-cover"
                                            />
                                        )}
                                        <h5 className="text-xs font-bold text-[#1E3A23] truncate">{post.title}</h5>
                                        <div className="flex justify-between items-center text-[10px] text-[#6D7A6F]">
                                            <span className="font-semibold">{post.badge || "Post"}</span>
                                            <span className="flex items-center gap-1 text-red-600 font-bold">
                                                <Heart size={10} className="fill-red-600" /> {post.likes}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-[#6D7A6F] italic bg-[#FAF9F5] p-3 rounded-xl text-center">
                                No public discoveries shared yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
