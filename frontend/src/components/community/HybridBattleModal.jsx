import React, { useState } from "react";
import { X, Swords, Dna, Shield, Flame, Zap, Trophy } from "lucide-react";

export default function HybridBattleModal({ hybrid, allPosts = [], onClose }) {
    if (!hybrid) return null;

    // Filter list of other hybrids to battle against
    const otherHybrids = allPosts.filter(
        (p) => (p.type === "hybrid" || p.badge === "Hybrid") && p.id !== hybrid.id
    );

    const defaultOpponent = {
        id: "op-default",
        title: "Indominus Prime",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=300",
        stats: { attack: 92, defense: 88, speed: 78, size: "Huge" },
        author: { name: "Dr. Wu" },
    };

    const [opponent, setOpponent] = useState(otherHybrids[0] || defaultOpponent);

    const stat1 = hybrid.stats || { attack: 85, defense: 90, speed: 65, size: "Huge" };
    const stat2 = opponent.stats || { attack: 80, defense: 85, speed: 70, size: "Huge" };

    const score1 = stat1.attack + stat1.defense + stat1.speed;
    const score2 = stat2.attack + stat2.defense + stat2.speed;

    const winner = score1 > score2 ? hybrid.title : score2 > score1 ? opponent.title : "Tie Game!";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E6E4D9] bg-[#0E1A11] text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#16291C] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <Swords className="text-amber-400" size={22} />
                        <h3 className="font-serif text-lg font-bold text-white">
                            Hybrid Specimen Showdown
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Opponent Selector */}
                    {otherHybrids.length > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-stone-300">Select Opponent:</span>
                            <select
                                value={opponent.id}
                                onChange={(e) => {
                                    const found = otherHybrids.find((h) => h.id === e.target.value);
                                    if (found) setOpponent(found);
                                }}
                                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white font-bold focus:outline-none cursor-pointer"
                            >
                                {otherHybrids.map((h) => (
                                    <option key={h.id} value={h.id} className="bg-[#0E1A11] text-white">
                                        {h.title} (by {h.author?.name})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Battle Arena Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
                        {/* Hybrid 1 */}
                        <div className="sm:col-span-5 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent p-4 text-center space-y-3">
                            <img
                                src={hybrid.image || "/tyrastego_hybrid.jpg"}
                                alt={hybrid.title}
                                className="h-36 w-full rounded-xl object-cover border border-amber-500/30"
                            />
                            <div>
                                <h4 className="font-serif text-lg font-bold text-amber-300">{hybrid.title}</h4>
                                <p className="text-[10px] text-stone-300">by {hybrid.author?.name || "Explorer"}</p>
                            </div>
                            <div className="rounded-xl bg-amber-500/20 border border-amber-400/30 py-2">
                                <p className="text-[10px] uppercase font-bold text-amber-300">Power Rating</p>
                                <p className="font-serif text-xl font-black text-amber-200">{score1}</p>
                            </div>
                        </div>

                        {/* VS Badge */}
                        <div className="sm:col-span-1 flex flex-col items-center justify-center my-2 sm:my-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-red-600 font-black text-white shadow-lg text-sm border-2 border-white">
                                VS
                            </div>
                        </div>

                        {/* Hybrid 2 */}
                        <div className="sm:col-span-5 rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-transparent p-4 text-center space-y-3">
                            <img
                                src={opponent.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=300"}
                                alt={opponent.title}
                                className="h-36 w-full rounded-xl object-cover border border-blue-500/30"
                            />
                            <div>
                                <h4 className="font-serif text-lg font-bold text-blue-300">{opponent.title}</h4>
                                <p className="text-[10px] text-stone-300">by {opponent.author?.name || "Explorer"}</p>
                            </div>
                            <div className="rounded-xl bg-blue-500/20 border border-blue-400/30 py-2">
                                <p className="text-[10px] uppercase font-bold text-blue-300">Power Rating</p>
                                <p className="font-serif text-xl font-black text-blue-200">{score2}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Breakdown Comparison Bars */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 text-xs">
                        <h5 className="font-bold text-amber-300 uppercase tracking-wider text-center mb-2">
                            Attribute Showdown
                        </h5>

                        {/* Attack */}
                        <div className="space-y-1">
                            <div className="flex justify-between font-bold text-stone-300">
                                <span>Attack: {stat1.attack}</span>
                                <span className="text-red-400">⚔️ Strike Power</span>
                                <span>Attack: {stat2.attack}</span>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10">
                                <div style={{ width: `${(stat1.attack / (stat1.attack + stat2.attack)) * 100}%` }} className="bg-amber-500" />
                                <div style={{ width: `${(stat2.attack / (stat1.attack + stat2.attack)) * 100}%` }} className="bg-blue-500" />
                            </div>
                        </div>

                        {/* Defense */}
                        <div className="space-y-1">
                            <div className="flex justify-between font-bold text-stone-300">
                                <span>Defense: {stat1.defense}</span>
                                <span className="text-blue-400">🛡️ Armor Plating</span>
                                <span>Defense: {stat2.defense}</span>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10">
                                <div style={{ width: `${(stat1.defense / (stat1.defense + stat2.defense)) * 100}%` }} className="bg-amber-500" />
                                <div style={{ width: `${(stat2.defense / (stat1.defense + stat2.defense)) * 100}%` }} className="bg-blue-500" />
                            </div>
                        </div>

                        {/* Speed */}
                        <div className="space-y-1">
                            <div className="flex justify-between font-bold text-stone-300">
                                <span>Speed: {stat1.speed}</span>
                                <span className="text-yellow-400">⚡ Agility</span>
                                <span>Speed: {stat2.speed}</span>
                            </div>
                            <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10">
                                <div style={{ width: `${(stat1.speed / (stat1.speed + stat2.speed)) * 100}%` }} className="bg-amber-500" />
                                <div style={{ width: `${(stat2.speed / (stat1.speed + stat2.speed)) * 100}%` }} className="bg-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Winner Banner */}
                    <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 p-3 text-center">
                        <p className="text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5">
                            <Trophy size={16} className="text-amber-400" />
                            Predicted Victor: <strong className="text-white text-sm">{winner}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
