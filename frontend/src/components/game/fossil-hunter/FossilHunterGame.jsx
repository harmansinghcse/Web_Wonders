import { useState, useEffect } from "react";
import Navbar from "../../home_components/hero/Navbar";
import { ArrowLeft, RefreshCw, Volume2, VolumeX, Compass, Play, Award } from "lucide-react";
import Cursor from "../common/Cursor";

// Synthesized sound effects for Fossil Hunter
const playSound = (type, enabled = true) => {
    if (!enabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === "dig") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === "fossil") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === "rock") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(120, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    } catch (e) {}
};

const FOSSIL_TYPES = [
    { type: "skull", name: "Tyrannosaur Skull", points: 500, icon: "💀" },
    { type: "ribs", name: "Armored Rib Cage", points: 300, icon: "🫁" },
    { type: "claw", name: "Sickle Hunting Claw", points: 350, icon: "🦅" },
    { type: "tail", name: "Ankylosaur Club Tail", points: 400, icon: "🔨" },
    { type: "spine", name: "Spinosaurus Spine", points: 450, icon: "⚡" },
];

export default function FossilHunterGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("landing"); // 'landing' | 'playing' | 'gameover'
    const [difficulty, setDifficulty] = useState("moderate"); // 'easy' | 'moderate' | 'hard'
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(15);
    const [maxAttempts, setMaxAttempts] = useState(15);
    const [fossilsFound, setFossilsFound] = useState(0);
    const [totalFossils, setTotalFossils] = useState(6);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [discoveredLogs, setDiscoveredLogs] = useState([]);

    // Get difficulty parameters
    const getDiffConfig = (diff = difficulty) => {
        if (diff === "easy") {
            return { maxDigs: 20, fossilCount: 4, rockCount: 3, gridCols: 5, totalSize: 25 };
        } else if (diff === "moderate") {
            return { maxDigs: 15, fossilCount: 6, rockCount: 5, gridCols: 5, totalSize: 25 };
        } else {
            // hard
            return { maxDigs: 10, fossilCount: 8, rockCount: 7, gridCols: 5, totalSize: 25 };
        }
    };

    // Initialize Dig Site Grid
    const initGrid = (selectedDiff = difficulty) => {
        const config = getDiffConfig(selectedDiff);
        const size = config.totalSize;

        let newGrid = Array(size).fill(null).map((_, idx) => ({
            id: idx,
            revealed: false,
            content: "dirt", // 'dirt' | 'fossil' | 'rock'
            fossilInfo: null,
        }));

        // Place fossils
        let placedFossils = 0;
        setTotalFossils(config.fossilCount);

        while (placedFossils < config.fossilCount) {
            const randomIdx = Math.floor(Math.random() * size);
            if (newGrid[randomIdx].content === "dirt") {
                const randomFossil = FOSSIL_TYPES[Math.floor(Math.random() * FOSSIL_TYPES.length)];
                newGrid[randomIdx].content = "fossil";
                newGrid[randomIdx].fossilInfo = randomFossil;
                placedFossils++;
            }
        }

        // Place rocks (hazards)
        let placedRocks = 0;
        while (placedRocks < config.rockCount) {
            const randomIdx = Math.floor(Math.random() * size);
            if (newGrid[randomIdx].content === "dirt") {
                newGrid[randomIdx].content = "rock";
                placedRocks++;
            }
        }

        setGrid(newGrid);
        setScore(0);
        setAttempts(config.maxDigs);
        setMaxAttempts(config.maxDigs);
        setFossilsFound(0);
        setDiscoveredLogs([]);
        setGameState("playing");
    };

    // Handle Dig Tile Click
    const handleTileClick = (idx) => {
        if (gameState !== "playing") return;
        const tile = grid[idx];
        if (tile.revealed || attempts <= 0) return;

        const nextAttempts = attempts - 1;
        setAttempts(nextAttempts);

        const updatedGrid = [...grid];
        updatedGrid[idx] = { ...tile, revealed: true };
        setGrid(updatedGrid);

        if (tile.content === "fossil") {
            playSound("fossil", soundEnabled);
            const foundCount = fossilsFound + 1;
            setFossilsFound(foundCount);
            const gainedScore = tile.fossilInfo.points;
            setScore((prev) => prev + gainedScore);
            setDiscoveredLogs((prev) => [
                `Uncovered ${tile.fossilInfo.name} (+${gainedScore} pts)`,
                ...prev,
            ]);

            if (foundCount >= totalFossils) {
                setGameState("gameover");
            }
        } else if (tile.content === "rock") {
            playSound("rock", soundEnabled);
            setScore((prev) => Math.max(0, prev - 100));
            setDiscoveredLogs((prev) => [`Hit dense bedrock rock! (-100 pts)`, ...prev]);
        } else {
            playSound("dig", soundEnabled);
        }

        if (nextAttempts <= 0 && fossilsFound < totalFossils) {
            setGameState("gameover");
        }
    };

    return (
        <div className="game-page relative min-h-screen bg-[#140b04] text-[#fbf0da] font-sans select-none overflow-x-hidden">
            <Cursor />
            {/* REALISTIC VISIBLE FOSSIL BONES & EXCAVATION SITE BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
                {/* Realistic Excavation Background Image - High Clarity & Vibrancy */}
                <img
                    src="/jurassic_realistic_game_bg.jpg"
                    alt="Jurassic Fossil Excavator Background"
                    className="h-full w-full object-cover object-center scale-105 filter brightness-90 contrast-110 saturate-110 opacity-90"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                
                {/* Natural Translucent Warm Earth & Torchlight Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2a1708]/50 via-transparent to-[#0c0602]/80 backdrop-brightness-95" />
                
                {/* Organic Realistic Fossil Skull & Bones Artwork Overlay - Smooth & Natural */}
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    {/* Realistic Fossil Skull & Bones Silhouettes (No Synthetic Dots or Dashes) */}
                    <g stroke="rgba(245, 158, 11, 0.45)" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* T-Rex Skull Contour Top-Right */}
                        <path d="M700 80 Q760 40 820 90 Q880 130 920 120 Q950 150 920 190 Q850 220 780 200 Q730 180 700 130 Z" fill="rgba(245, 158, 11, 0.08)" />
                        <circle cx="760" cy="110" r="14" fill="rgba(0,0,0,0.5)" stroke="rgba(245, 158, 11, 0.5)" />
                        <path d="M720 140 L740 180 M760 145 L780 185 M800 145 L820 185 M840 140 L860 180" strokeWidth="3" />
                        
                        {/* Spine & Ribs Contour Bottom-Left */}
                        <path d="M50 600 Q150 550 250 620 T450 580" strokeWidth="4" />
                        <path d="M100 580 Q120 500 80 440" />
                        <path d="M160 570 Q190 490 150 430" />
                        <path d="M220 590 Q260 510 220 450" />
                        <path d="M280 600 Q330 520 290 460" />
                        <path d="M340 590 Q390 510 350 450" />
                        
                        {/* Ancient Shell / Ammonite Fossil Top-Left */}
                        <path d="M120 150 A50 50 0 0 1 220 150 A40 40 0 0 1 140 150 A30 30 0 0 1 200 150 A20 20 0 0 1 160 150" strokeWidth="2.5" />
                    </g>
                </svg>

                {/* Warm Natural Torchlight Glow Layers */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(245,158,11,0.25)_0%,transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(180,83,9,0.18)_0%,transparent_50%)] animate-pulse" />
            </div>

            {/* Navigation Header */}
            {gameState === "landing" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* LANDING / DIFFICULTY SELECTOR SCREEN */}
            {gameState === "landing" && (
                <main className="relative z-10 max-w-4xl mx-auto pt-28 pb-16 px-4 flex flex-col items-center justify-center min-h-screen text-center space-y-8">
                    
                    {onBackToHub && (
                        <button
                            onClick={onBackToHub}
                            className="inline-flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-md"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Game Hub</span>
                        </button>
                    )}

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-[#1b3827]/80 border border-[#52B788]/40 px-4 py-1 rounded-full text-xs font-serif font-bold text-[#52B788] uppercase backdrop-blur-md">
                            <span>⛏️ EXCAVATION GAME</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-md">
                            JURASSIC FOSSIL EXCAVATOR
                        </h1>
                        <p className="text-sm sm:text-base text-emerald-200/90 max-w-lg mx-auto font-medium">
                            Unearth ancient dinosaur bones, avoid dense bedrock hazards, and assemble complete prehistoric skeletons!
                        </p>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="w-full max-w-md bg-[#18291c]/95 border border-[#2b4c34] p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-md">
                        <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
                            SELECT DIFFICULTY LEVEL
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: "easy", name: "Easy", digs: "20 Digs", fossils: "4 Fossils", rocks: "3 Rocks" },
                                { id: "moderate", name: "Moderate", digs: "15 Digs", fossils: "6 Fossils", rocks: "5 Rocks" },
                                { id: "hard", name: "Hard", digs: "10 Digs", fossils: "8 Fossils", rocks: "7 Rocks" },
                            ].map((diff) => (
                                <button
                                    key={diff.id}
                                    onClick={() => setDifficulty(diff.id)}
                                    className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center space-y-1 cursor-pointer border ${
                                        difficulty === diff.id
                                            ? "bg-[#52B788] text-slate-950 border-[#52B788] shadow-lg scale-105"
                                            : "bg-white/5 text-emerald-200 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <span className="font-extrabold uppercase">{diff.name}</span>
                                    <span className="text-[10px] opacity-80">{diff.digs}</span>
                                    <span className="text-[9px] opacity-70">{diff.fossils}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => initGrid(difficulty)}
                            className="w-full py-4 rounded-2xl bg-[#52B788] text-slate-950 hover:bg-[#64cca2] font-black text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            <Play size={18} />
                            <span>START EXCAVATION</span>
                        </button>
                    </div>

                </main>
            )}

            {/* ACTIVE GAMEPLAY & GAME OVER SCREENS */}
            {(gameState === "playing" || gameState === "gameover") && (
                <main className="relative z-10 max-w-5xl mx-auto pt-8 pb-12 px-4 sm:px-6 flex flex-col space-y-6">
                    
                    {/* Top HUD Header */}
                    <div className="flex items-center justify-between bg-[#192b1e]/95 border border-[#2b4c34] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-3.5">
                            <button
                                onClick={onBackToHub || (() => setGameState("landing"))}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer hover:scale-105"
                                title="Return to Game Center"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-lg sm:text-xl font-serif font-black text-amber-200 uppercase tracking-wider">
                                        FOSSIL EXCAVATOR
                                    </h1>
                                    <span className="bg-[#52B788]/20 border border-[#52B788]/50 px-3 py-0.5 rounded-full text-xs font-black text-[#52B788] uppercase tracking-wider">
                                        {difficulty}
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-300/90 font-medium">Unearth ancient dinosaur bones!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="bg-[#0b160f] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[80px]">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Digs Left</span>
                                <span className="text-lg font-mono font-black text-amber-300">{attempts} / {maxAttempts}</span>
                            </div>
                            <div className="bg-[#0b160f] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[80px]">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Fossils</span>
                                <span className="text-lg font-mono font-black text-emerald-400">{fossilsFound} / {totalFossils}</span>
                            </div>
                            <div className="bg-[#0b160f] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[80px]">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Score</span>
                                <span className="text-lg font-mono font-black text-white">{score}</span>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                            >
                                {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Main Play Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Left: Dig Site Grid */}
                        <div className="lg:col-span-8 bg-[#18291c]/90 border border-[#2b4c34] rounded-2xl p-6 shadow-2xl flex flex-col items-center backdrop-blur-md">
                            <h2 className="text-base font-serif font-bold text-amber-300 tracking-wider uppercase mb-5 flex items-center gap-2">
                                <Compass size={20} />
                                <span>EXCAVATION GRID (CLICK TILE TO DIG)</span>
                            </h2>

                            <div className="grid grid-cols-5 gap-3.5 w-full max-w-lg aspect-square">
                                {grid.map((tile, idx) => (
                                    <button
                                        key={tile.id}
                                        onClick={() => handleTileClick(idx)}
                                        disabled={tile.revealed || attempts <= 0 || gameState === "gameover"}
                                        className={`relative w-full h-full rounded-2xl border-2 transition-all duration-300 flex items-center justify-center text-3xl shadow-lg cursor-pointer ${
                                            !tile.revealed
                                                ? "bg-gradient-to-b from-[#4a3f31] to-[#2e261c] border-[#6b5a45] hover:border-amber-400 hover:scale-105"
                                                : tile.content === "fossil"
                                                ? "bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
                                                : tile.content === "rock"
                                                ? "bg-stone-800 border-red-500/50"
                                                : "bg-[#142017] border-[#203a27]"
                                        }`}
                                    >
                                        {!tile.revealed ? (
                                            <span className="opacity-60 text-sm font-mono font-bold text-amber-200">⛏️</span>
                                        ) : tile.content === "fossil" ? (
                                            <span className="animate-bounce" style={{ animationDuration: "2s" }}>
                                                {tile.fossilInfo.icon}
                                            </span>
                                        ) : tile.content === "rock" ? (
                                            <span>🪨</span>
                                        ) : (
                                            <span className="text-stone-600 text-sm font-bold">·</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Excavation Log & Actions */}
                        <div className="lg:col-span-4 bg-[#18291c]/90 border border-[#2b4c34] rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-5 backdrop-blur-md">
                            <div>
                                <h3 className="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider mb-3">
                                    EXCAVATION LOG
                                </h3>
                                <div className="bg-[#0e1710] border border-white/10 rounded-xl p-3.5 h-56 overflow-y-auto space-y-2 text-xs font-mono">
                                    {discoveredLogs.length === 0 ? (
                                        <p className="text-gray-500 italic">No digs recorded yet. Click tiles to excavate!</p>
                                    ) : (
                                        discoveredLogs.map((log, index) => (
                                            <p key={index} className="text-emerald-300 border-b border-white/5 pb-1 leading-relaxed">
                                                {log}
                                            </p>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <button
                                    onClick={() => initGrid(difficulty)}
                                    className="w-full py-3.5 rounded-xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                                >
                                    <RefreshCw size={18} />
                                    <span>Reset Site</span>
                                </button>

                                <button
                                    onClick={() => setGameState("landing")}
                                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Change Level
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* STANDARDIZED JURASSIC COMPLETION MODAL */}
                    {gameState === "gameover" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
                            <div className="w-full max-w-lg bg-gradient-to-b from-[#14261a] to-[#0b160f] border-2 border-emerald-400 rounded-3xl p-8 shadow-[0_0_50px_rgba(82,183,136,0.3)] text-center space-y-6 text-white">
                                <div className="text-6xl mb-1 drop-shadow-lg animate-bounce">
                                    {fossilsFound >= totalFossils ? "🦖" : "🦴"}
                                </div>
                                
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-serif font-black tracking-wider text-amber-300 uppercase drop-shadow">
                                        {fossilsFound >= totalFossils ? "LEVEL COMPLETE!" : "EXCAVATION ENDED"}
                                    </h2>
                                    <p className="text-sm font-medium text-emerald-200/90 italic">
                                        {fossilsFound >= totalFossils ? "Excellent excavation, Paleontologist!" : "Nice dig effort! Give it another try."}
                                    </p>
                                </div>

                                <div className="bg-[#071109] p-5 rounded-2xl border border-emerald-500/30 grid grid-cols-2 gap-4 font-mono shadow-inner">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <span className="text-xs text-gray-400 block uppercase font-bold">Total Score</span>
                                        <span className="text-2xl font-black text-emerald-400">{score}</span>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <span className="text-xs text-gray-400 block uppercase font-bold">Fossils Found</span>
                                        <span className="text-2xl font-black text-amber-300">{fossilsFound} / {totalFossils}</span>
                                    </div>
                                </div>

                                {/* Three Actions Navigation Grid */}
                                <div className="space-y-3 pt-2">
                                    {/* Primary Highlighted Button: NEXT LEVEL */}
                                    <button
                                        onClick={() => {
                                            if (difficulty === "easy") {
                                                setDifficulty("moderate");
                                                initGrid("moderate");
                                            } else if (difficulty === "moderate") {
                                                setDifficulty("hard");
                                                initGrid("hard");
                                            } else {
                                                // Already on Hard -> Restart Hard or Choose another game
                                                initGrid("hard");
                                            }
                                        }}
                                        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/50 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <span>▶</span>
                                        <span>{difficulty === "hard" ? "PLAY AGAIN (HARD)" : `NEXT LEVEL (${difficulty === "easy" ? "MODERATE" : "HARD"})`}</span>
                                    </button>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Secondary Button: TRY AGAIN */}
                                        <button
                                            onClick={() => initGrid(difficulty)}
                                            className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                                        >
                                            <RefreshCw size={16} />
                                            <span>TRY AGAIN</span>
                                        </button>

                                        {/* Secondary Button: GAME CENTER */}
                                        <button
                                            onClick={onBackToHub || (() => setGameState("landing"))}
                                            className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                                        >
                                            <span>▦</span>
                                            <span>GAME CENTER</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            )}

        </div>
    );
}
