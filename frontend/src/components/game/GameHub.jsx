import { useState } from "react";
import Navbar from "../home_components/hero/Navbar";
import { Play, Trophy, Sparkles, Gamepad2, Award, Zap, Compass, Star } from "lucide-react";
import MemoryMatchGame from "./MemoryMatchGame";
import FossilHunterGame from "./FossilHunterGame";
import DinoRunnerGame from "./DinoRunnerGame";

export default function GameHub({ initialGame = "hub" }) {
    const [activeGame, setActiveGame] = useState(initialGame);

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

    return (
        <div className="relative min-h-screen bg-[#0e1711] text-[#e4dac6] font-sans selection:bg-[#52B788] selection:text-black">
            
            {/* Background Image */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/jurassic_game_bg.jpg"
                    alt="Jurassic Games Background"
                    className="h-full w-full object-cover object-center filter brightness-50 contrast-110"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-stone-900/40 to-[#0e1711]" />
            </div>

            {/* Navigation Header */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Main Hub Area */}
            <main className="relative z-10 max-w-7xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col space-y-10">
                
                {/* Hero Title Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2.5 bg-[#1b3827]/80 border border-[#52B788]/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                        <Gamepad2 size={18} className="text-[#52B788]" />
                        <span className="text-xs font-serif font-bold tracking-widest text-[#52B788] uppercase">
                            JURASSIC ARCADE HUB
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black font-serif text-white tracking-tight drop-shadow-md">
                        PREHISTORIC GAME CENTER
                    </h1>

                    <p className="text-base sm:text-lg text-emerald-200/90 font-medium">
                        Test your memory, unearth fossilized dinosaur bones, or escape dangerous volcanic trails!
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    
                    {/* Game 1: Jurassic Memory Match */}
                    <div className="group relative rounded-3xl bg-[#142418]/90 border border-[#2b4c34] p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between hover:border-[#52B788] transition-all duration-300 hover:-translate-y-1">
                        <div className="space-y-4">
                            <div className="w-full h-44 rounded-2xl bg-gradient-to-b from-[#2b2419] to-[#16120b] border border-amber-500/20 overflow-hidden relative flex items-center justify-center">
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                    🎴
                                </span>
                                <div className="absolute top-3 right-3 bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 uppercase">
                                    Memory & Logic
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#52B788] transition-colors">
                                    Jurassic Memory Match
                                </h3>
                                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                    Flip 3D prehistoric cards, match species pairs, unlock dinosaur trivia facts, and beat the clock!
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            {memoryBest > 0 && (
                                <div className="flex items-center justify-between text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
                                    <span className="text-gray-400">Best Score</span>
                                    <span className="text-amber-300 font-bold">{memoryBest} pts</span>
                                </div>
                            )}

                            <button
                                onClick={() => setActiveGame("memory-match")}
                                className="w-full py-3.5 rounded-2xl bg-[#1b3827] group-hover:bg-[#52B788] text-white group-hover:text-[#0a180e] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                            >
                                <Play size={16} />
                                <span>Play Memory Match</span>
                            </button>
                        </div>
                    </div>

                    {/* Game 2: Fossil Excavator */}
                    <div className="group relative rounded-3xl bg-[#142418]/90 border border-[#2b4c34] p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between hover:border-[#52B788] transition-all duration-300 hover:-translate-y-1">
                        <div className="space-y-4">
                            <div className="w-full h-44 rounded-2xl bg-gradient-to-b from-[#2b2419] to-[#16120b] border border-amber-500/20 overflow-hidden relative flex items-center justify-center">
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                    ⛏️
                                </span>
                                <div className="absolute top-3 right-3 bg-emerald-400/20 border border-emerald-400/40 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-300 uppercase">
                                    Excavation
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#52B788] transition-colors">
                                    Fossil Excavator
                                </h3>
                                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                    Dig up ancient buried dinosaur bones, assemble full skeletons, and avoid solid bedrock hazards.
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            <button
                                onClick={() => setActiveGame("fossil-hunter")}
                                className="w-full py-3.5 rounded-2xl bg-[#1b3827] group-hover:bg-[#52B788] text-white group-hover:text-[#0a180e] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                            >
                                <Compass size={16} />
                                <span>Play Excavator</span>
                            </button>
                        </div>
                    </div>

                    {/* Game 3: Dino Escape Runner */}
                    <div className="group relative rounded-3xl bg-[#142418]/90 border border-[#2b4c34] p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between hover:border-[#52B788] transition-all duration-300 hover:-translate-y-1">
                        <div className="space-y-4">
                            <div className="w-full h-44 rounded-2xl bg-gradient-to-b from-[#2b2419] to-[#16120b] border border-amber-500/20 overflow-hidden relative flex items-center justify-center">
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                    🏃‍♂️
                                </span>
                                <div className="absolute top-3 right-3 bg-red-400/20 border border-red-400/40 px-2.5 py-1 rounded-full text-[10px] font-bold text-red-300 uppercase">
                                    Action & Speed
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#52B788] transition-colors">
                                    Jurassic Dino Escape
                                </h3>
                                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                    Run through volcanic landscapes, jump over lava rocks, dodge Pterodactyls, and collect Amber Gems!
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            {runnerBest > 0 && (
                                <div className="flex items-center justify-between text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
                                    <span className="text-gray-400">Best Distance</span>
                                    <span className="text-amber-300 font-bold">{runnerBest} m</span>
                                </div>
                            )}

                            <button
                                onClick={() => setActiveGame("dino-runner")}
                                className="w-full py-3.5 rounded-2xl bg-[#1b3827] group-hover:bg-[#52B788] text-white group-hover:text-[#0a180e] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                            >
                                <Zap size={16} />
                                <span>Play Dino Escape</span>
                            </button>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
