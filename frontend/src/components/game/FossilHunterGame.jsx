import { useState, useEffect } from "react";
import Navbar from "../home_components/hero/Navbar";
import { ArrowLeft, RefreshCw, Volume2, VolumeX, Compass, Play, Award } from "lucide-react";

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
        <div className="relative min-h-screen bg-[#111a14] text-[#e4dac6] font-sans selection:bg-[#52B788] selection:text-black">
            
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
                            className="inline-flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Game Hub</span>
                        </button>
                    )}

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-[#1b3827]/80 border border-[#52B788]/40 px-4 py-1 rounded-full text-xs font-serif font-bold text-[#52B788] uppercase">
                            <span>⛏️ EXCAVATION GAME</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider">
                            JURASSIC FOSSIL EXCAVATOR
                        </h1>
                        <p className="text-sm sm:text-base text-emerald-200/90 max-w-lg mx-auto">
                            Unearth ancient dinosaur bones, avoid dense bedrock hazards, and assemble complete prehistoric skeletons!
                        </p>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="w-full max-w-md bg-[#18291c] border border-[#2b4c34] p-5 rounded-3xl shadow-2xl space-y-4">
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
                    <div className="flex items-center justify-between bg-[#192b1e] border border-[#2b4c34] rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setGameState("landing")}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
                                title="Exit Game"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-lg font-serif font-bold text-amber-200 uppercase tracking-wider">
                                        FOSSIL EXCAVATOR
                                    </h1>
                                    <span className="bg-[#52B788]/20 border border-[#52B788]/40 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#52B788] uppercase">
                                        {difficulty}
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-300/80">Unearth ancient dinosaur bones!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-[#0b160f] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Digs Left</span>
                                <span className="text-base font-mono font-bold text-amber-300">{attempts} / {maxAttempts}</span>
                            </div>
                            <div className="bg-[#0b160f] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Fossils</span>
                                <span className="text-base font-mono font-bold text-emerald-400">{fossilsFound} / {totalFossils}</span>
                            </div>
                            <div className="bg-[#0b160f] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Score</span>
                                <span className="text-base font-mono font-bold text-white">{score}</span>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                            >
                                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Main Play Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Left: Dig Site Grid */}
                        <div className="lg:col-span-8 bg-[#18291c] border border-[#2b4c34] rounded-2xl p-6 shadow-2xl flex flex-col items-center">
                            <h2 className="text-sm font-serif font-bold text-amber-300 tracking-wider uppercase mb-4 flex items-center gap-2">
                                <Compass size={18} />
                                <span>EXCAVATION GRID (CLICK TILE TO DIG)</span>
                            </h2>

                            <div className="grid grid-cols-5 gap-3 w-full max-w-md aspect-square">
                                {grid.map((tile, idx) => (
                                    <button
                                        key={tile.id}
                                        onClick={() => handleTileClick(idx)}
                                        disabled={tile.revealed || attempts <= 0 || gameState === "gameover"}
                                        className={`relative w-full h-full rounded-2xl border-2 transition-all duration-300 flex items-center justify-center text-2xl shadow-lg cursor-pointer ${
                                            !tile.revealed
                                                ? "bg-gradient-to-b from-[#4a3f31] to-[#2e261c] border-[#6b5a45] hover:border-amber-400 hover:scale-105"
                                                : tile.content === "fossil"
                                                ? "bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                                                : tile.content === "rock"
                                                ? "bg-stone-800 border-red-500/50"
                                                : "bg-[#142017] border-[#203a27]"
                                        }`}
                                    >
                                        {!tile.revealed ? (
                                            <span className="opacity-40 text-xs font-mono font-bold text-amber-200">⛏️</span>
                                        ) : tile.content === "fossil" ? (
                                            <span className="animate-bounce" style={{ animationDuration: "2s" }}>
                                                {tile.fossilInfo.icon}
                                            </span>
                                        ) : tile.content === "rock" ? (
                                            <span>🪨</span>
                                        ) : (
                                            <span className="text-stone-600 text-xs">·</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Excavation Log & Actions */}
                        <div className="lg:col-span-4 bg-[#18291c] border border-[#2b4c34] rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
                            <div>
                                <h3 className="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider mb-3">
                                    EXCAVATION LOG
                                </h3>
                                <div className="bg-[#0e1710] border border-white/10 rounded-xl p-3 h-48 overflow-y-auto space-y-2 text-xs font-mono">
                                    {discoveredLogs.length === 0 ? (
                                        <p className="text-gray-500 italic">No digs recorded yet. Click tiles to excavate!</p>
                                    ) : (
                                        discoveredLogs.map((log, index) => (
                                            <p key={index} className="text-emerald-300 border-b border-white/5 pb-1">
                                                {log}
                                            </p>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => initGrid(difficulty)}
                                    className="w-full py-3 rounded-xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                                >
                                    <RefreshCw size={16} />
                                    <span>Reset Site</span>
                                </button>

                                <button
                                    onClick={() => setGameState("landing")}
                                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    Change Level
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* GAME OVER MODAL */}
                    {gameState === "gameover" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                            <div className="w-full max-w-md bg-[#122317] border-2 border-[#52B788] rounded-3xl p-6 shadow-2xl text-center space-y-4 text-white">
                                <div className="text-5xl mb-2">
                                    {fossilsFound >= totalFossils ? "🦖" : "🦴"}
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-amber-300">
                                    {fossilsFound >= totalFossils ? "COMPLETE SKELETON EXCAVATED!" : "EXCAVATION FINISHED"}
                                </h2>
                                <p className="text-xs text-gray-300">
                                    You unearthed {fossilsFound} out of {totalFossils} ancient fossils on <span className="font-bold text-amber-300 uppercase">{difficulty}</span> mode!
                                </p>
                                <div className="bg-[#09150d] p-4 rounded-xl border border-white/10 flex justify-around font-mono">
                                    <div>
                                        <span className="text-[10px] text-gray-400 block uppercase">Final Score</span>
                                        <span className="text-lg font-bold text-emerald-400">{score}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 block uppercase">Fossils</span>
                                        <span className="text-lg font-bold text-amber-300">{fossilsFound} / {totalFossils}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => initGrid(difficulty)}
                                        className="flex-1 py-3 rounded-xl bg-[#52B788] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#66d29f] transition-all cursor-pointer"
                                    >
                                        Play Again
                                    </button>
                                    <button
                                        onClick={() => setGameState("landing")}
                                        className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer"
                                    >
                                        Change Level
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            )}

        </div>
    );
}
