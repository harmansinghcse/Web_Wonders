import React from "react";
import { X, Flame, ShieldAlert, Skull, Sparkles, Globe, Sun, Zap } from "lucide-react";

export default function AsteroidImpactModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-red-500/40 bg-[#0A0606] text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Impact Cover Header */}
                <div className="relative h-44 w-full bg-gradient-to-r from-red-950 via-amber-950 to-black p-6 flex flex-col justify-end border-b border-red-500/30 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.35)_0%,transparent_60%)]" />
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 cursor-pointer"
                    >
                        <X size={18} />
                    </button>

                    <div className="relative z-10 space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-[11px] font-extrabold text-red-400 uppercase tracking-widest">
                            <Flame size={13} className="text-red-500" />
                            66 Million Years Ago • K-Pg Boundary
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-black text-amber-200">
                            Chicxulub Asteroid Cataclysm
                        </h2>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                    {/* Impact Spec Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-red-400">Asteroid Diameter</p>
                            <p className="font-serif text-lg font-black text-amber-300 mt-0.5">10–15 km</p>
                        </div>
                        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-red-400">Entry Velocity</p>
                            <p className="font-serif text-lg font-black text-amber-300 mt-0.5">20 km/s</p>
                        </div>
                        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-red-400">Yield Energy</p>
                            <p className="font-serif text-xs font-black text-amber-300 mt-2">100M Megatons</p>
                        </div>
                        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-red-400">Global Extinction</p>
                            <p className="font-serif text-lg font-black text-red-400 mt-0.5">75% Species</p>
                        </div>
                    </div>

                    {/* Sequential Cataclysm Stages */}
                    <div className="space-y-3">
                        <h3 className="font-serif text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert size={16} className="text-red-500" />
                            Chronology of Global Disaster
                        </h3>

                        <div className="space-y-2.5">
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex gap-3 items-start">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold text-[11px] shrink-0 mt-0.5">
                                    1
                                </span>
                                <div>
                                    <h4 className="font-bold text-white">Instant Thermal Blast (0 - 10 Minutes)</h4>
                                    <p className="text-stone-300 text-[11px] mt-0.5">
                                        Impact vaporized rock and water in the Gulf of Mexico, creating a thermal fireball brighter than the sun that incinerated organisms within thousands of kilometers.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex gap-3 items-start">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold text-[11px] shrink-0 mt-0.5">
                                    2
                                </span>
                                <div>
                                    <h4 className="font-bold text-white">Mega-Tsunamis & Shockwaves (Hours 1 - 24)</h4>
                                    <p className="text-stone-300 text-[11px] mt-0.5">
                                        100-meter-high megatsunamis radiated outward across global oceans, while magnitude 11+ earthquakes shattered continental tectonic boundaries.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex gap-3 items-start">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold text-[11px] shrink-0 mt-0.5">
                                    3
                                </span>
                                <div>
                                    <h4 className="font-bold text-white">Impact Winter & Photosynthesis Halt (Years 1 - 10)</h4>
                                    <p className="text-stone-300 text-[11px] mt-0.5">
                                        Billions of tons of sulfur aerosols and soot choked the stratosphere, blocking sunlight. Global temperatures plummeted by 15°C and collapse of food webs ended the non-avian dinosaur lineage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Evolutionary Dawn Note */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 to-emerald-950/40 p-3.5 text-amber-200">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={16} className="text-amber-400" />
                            <h4 className="font-bold text-xs">The Surviving Lineages</h4>
                        </div>
                        <p className="text-[11px] leading-relaxed text-stone-300">
                            Small burrowing mammals, aquatic crocodilians, turtles, and avian feathered dinosaurs survived the nuclear winter—paving the way for the Rise of Mammals and modern Birds!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
