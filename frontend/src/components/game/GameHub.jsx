import { useState } from "react";
import Navbar from "../home_components/hero/Navbar";
import { Play, Trophy, Sparkles, Gamepad2, Award, Zap, Compass, Star, Flame } from "lucide-react";
import MemoryMatchGame from "./MemoryMatchGame";
import FossilHunterGame from "./FossilHunterGame";
import DinoRunnerGame from "./DinoRunnerGame";
import Cursor from "./Cursor";

export default function GameHub({ initialGame = "hub" }) {
    const [activeGame, setActiveGame] = useState(initialGame);
    const [hoveredGame, setHoveredGame] = useState(null);

    const memoryBest = localStorage.getItem("jurassic_memory_best") || "0";
    const runnerBest = localStorage.getItem("jurassic_runner_high") || "0";

    if (activeGame === "memory-match") {
        return <MemoryMatchGame onBackToHub={() => setActiveGame("hub")} />;
    }

    if (activeGame === "fossil-hunter") {
        return <FossilHunterGame onBackToHub={() => setActiveGame("hub")} />;
    }

    if (activeGame === "dino-runner") {
        return <DinoRunnerGame onBackToHub={() => setActiveGame("hub")} />;
    }

    // Dynamic background style based on active/hovered game vibe
    const getHubVibe = () => {
        if (hoveredGame === "memory-match") {
            return {
                gradient: "from-[#051a11] via-[#092c1d] to-[#04120b]",
                radial: "radial-gradient(circle at 30% 40%, rgba(82, 183, 136, 0.35) 0%, transparent 60%)",
                badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                text: "Mystical Emerald & Relic Sanctuary Vibe",
                accentColor: "#52B788"
            };
        }
        if (hoveredGame === "fossil-hunter") {
            return {
                gradient: "from-[#1d1209] via-[#2d1b0a] to-[#0f0904]",
                radial: "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.35) 0%, transparent 60%)",
                badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                text: "Warm Earthy Desert Excavation Vibe",
                accentColor: "#f59e0b"
            };
        }
        if (hoveredGame === "dino-runner") {
            return {
                gradient: "from-[#240808] via-[#3a0c0c] to-[#0d0303]",
                radial: "radial-gradient(circle at 70% 60%, rgba(239, 68, 68, 0.35) 0%, transparent 60%)",
                badge: "bg-red-500/20 text-red-300 border-red-500/40",
                text: "Fiery Volcanic Magma Action Vibe",
                accentColor: "#ef4444"
            };
        }
        return {
            gradient: "from-stone-950 via-[#0e1711] to-black",
            radial: "radial-gradient(circle at 50% 30%, rgba(82, 183, 136, 0.18) 0%, transparent 70%)",
            badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
            text: "Prehistoric Arcade Hub",
            accentColor: "#52B788"
        };
    };

    const currentVibe = getHubVibe();

    return (
        <div className={`game-page relative min-h-screen font-sans selection:bg-[#52B788] selection:text-black transition-colors duration-700 bg-gradient-to-b ${currentVibe.gradient} text-[#e4dac6]`}>
            <Cursor />
            
            {/* Dynamic Background Image & Color Vibe Overlay */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-700">
                <img
                    src="/jurassic_game_bg.jpg"
                    alt="Jurassic Games Background"
                    className="h-full w-full object-cover object-center filter brightness-80 contrast-110 opacity-85 transition-all duration-700 scale-105"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                
                {/* Dynamic Atmosphere Tint Layer */}
                <div 
                    className="absolute inset-0 transition-all duration-700 pointer-events-none"
                    style={{ background: currentVibe.radial }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-[#0e1711]/80 pointer-events-none" />
            </div>

            {/* Navigation Header */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Main Hub Area */}
            <main className="relative z-10 max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col space-y-10">
                
                {/* Hero Title Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 ${currentVibe.badge}`}>
                        <Gamepad2 size={18} style={{ color: currentVibe.accentColor }} />
                        <span className="text-xs font-serif font-extrabold tracking-widest uppercase">
                            {currentVibe.text}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black font-serif text-white tracking-tight drop-shadow-md">
                        PREHISTORIC GAME CENTER
                    </h1>

                    <p className="text-base sm:text-lg text-emerald-200/90 font-medium">
                        Choose your adventure level. Hover over games to experience their distinct atmospheric vibes!
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    
                    {/* Game 1: Jurassic Memory Match */}
                    <div 
                        onMouseEnter={() => setHoveredGame("memory-match")}
                        onMouseLeave={() => setHoveredGame(null)}
                        className={`group relative rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 border ${
                            hoveredGame === "memory-match"
                                ? "bg-[#0a2016]/95 border-emerald-400 shadow-[0_0_40px_rgba(82,183,136,0.35)] scale-[1.02]"
                                : "bg-[#142418]/90 border-[#2b4c34] hover:border-emerald-500/60"
                        }`}
                    >
                        <div className="space-y-4">
                            <div className="w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#0b291c] via-[#071d12] to-[#04140c] border border-emerald-500/30 overflow-hidden relative flex items-center justify-center group-hover:border-emerald-400/80 transition-all duration-500 shadow-xl">
                                <img 
                                    src="/game_memory_match.jpg" 
                                    alt="Jurassic Memory Match Artwork"
                                    className="w-full h-full object-cover scale-[1.05] group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-400/60 px-3 py-1 rounded-full text-xs font-extrabold text-emerald-300 uppercase tracking-wider backdrop-blur-md shadow-md">
                                    Memory & Logic
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                                    Jurassic Memory Match
                                </h3>
                                <p className="text-sm text-gray-200 mt-2 leading-relaxed font-medium">
                                    Flip 3D prehistoric cards, match species pairs, unlock dinosaur trivia facts, and beat the clock!
                                </p>

                                {/* Difficulty Tags */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Easy (12)</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Moderate (16)</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">Hard (20)</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            {memoryBest > 0 && (
                                <div className="flex items-center justify-between text-xs sm:text-sm bg-emerald-950/50 px-3.5 py-2 rounded-xl border border-emerald-500/30 font-mono">
                                    <span className="text-gray-300">Best Score</span>
                                    <span className="text-emerald-300 font-bold">{memoryBest} pts</span>
                                </div>
                            )}

                            <button
                                onClick={() => setActiveGame("memory-match")}
                                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group-hover:shadow-[0_0_25px_rgba(82,183,136,0.6)]"
                            >
                                <Play size={20} className="fill-current" />
                                <span>Play Memory Match</span>
                            </button>
                        </div>
                    </div>

                    {/* Game 2: Fossil Excavator */}
                    <div 
                        onMouseEnter={() => setHoveredGame("fossil-hunter")}
                        onMouseLeave={() => setHoveredGame(null)}
                        className={`group relative rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 border ${
                            hoveredGame === "fossil-hunter"
                                ? "bg-[#20150a]/95 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.35)] scale-[1.02]"
                                : "bg-[#1d1610]/90 border-[#4a3420] hover:border-amber-500/60"
                        }`}
                    >
                        <div className="space-y-4">
                            <div className="w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#42240d] via-[#241306] to-[#120902] border border-amber-500/40 overflow-hidden relative flex items-center justify-center group-hover:border-amber-400 transition-all duration-500 shadow-xl">
                                <img 
                                    src="/game_fossil_excavator.jpg" 
                                    alt="Fossil Excavator Artwork"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 contrast-95"
                                />
                                <div className="absolute top-3 right-3 bg-amber-950/80 border border-amber-400/60 px-3 py-1 rounded-full text-xs font-extrabold text-amber-300 uppercase tracking-wider backdrop-blur-md shadow-md">
                                    Excavation
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">
                                    Fossil Excavator
                                </h3>
                                <p className="text-sm text-gray-200 mt-2 leading-relaxed font-medium">
                                    Dig up ancient buried dinosaur bones, assemble full skeletons, and avoid solid bedrock hazards.
                                </p>

                                {/* Difficulty Tags */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Easy (20 Digs)</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Moderate (15)</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">Hard (10)</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            <button
                                onClick={() => setActiveGame("fossil-hunter")}
                                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
                            >
                                <Compass size={20} />
                                <span>Play Excavator</span>
                            </button>
                        </div>
                    </div>

                    {/* Game 3: Dino Escape Runner */}
                    <div 
                        onMouseEnter={() => setHoveredGame("dino-runner")}
                        onMouseLeave={() => setHoveredGame(null)}
                        className={`group relative rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 border ${
                            hoveredGame === "dino-runner"
                                ? "bg-[#250a0a]/95 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.35)] scale-[1.02]"
                                : "bg-[#201010]/90 border-[#4a2020] hover:border-red-500/60"
                        }`}
                    >
                        <div className="space-y-4">
                            <div className="w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-br from-[#471212] via-[#260909] to-[#120303] border border-red-500/40 overflow-hidden relative flex items-center justify-center group-hover:border-red-400 transition-all duration-500 shadow-xl">
                                <img 
                                    src="/game_dino_escape.jpg" 
                                    alt="Jurassic Dino Escape Artwork"
                                    className="w-full h-full object-cover scale-[1.05] group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-red-950/80 border border-red-400/60 px-3 py-1 rounded-full text-xs font-extrabold text-red-300 uppercase tracking-wider backdrop-blur-md shadow-md">
                                    Action & Speed
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white group-hover:text-red-300 transition-colors tracking-tight">
                                    Jurassic Dino Escape
                                </h3>
                                <p className="text-sm text-gray-200 mt-2 leading-relaxed font-medium">
                                    Run through volcanic landscapes, jump over lava rocks, dodge Pterodactyls, and collect Amber Gems!
                                </p>

                                {/* Difficulty Tags */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Easy (5 Shields)</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">Moderate (3)</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">Hard (1)</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            {runnerBest > 0 && (
                                <div className="flex items-center justify-between text-xs sm:text-sm bg-red-950/50 px-3.5 py-2 rounded-xl border border-red-500/30 font-mono">
                                    <span className="text-gray-300">Best Distance</span>
                                    <span className="text-red-300 font-bold">{runnerBest} m</span>
                                </div>
                            )}

                            <button
                                onClick={() => setActiveGame("dino-runner")}
                                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer group-hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]"
                            >
                                <Zap size={20} />
                                <span>Play Dino Escape</span>
                            </button>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
