import { useState, useEffect, useRef } from "react";
import Navbar from "../home_components/hero/Navbar";
import { ArrowLeft, RefreshCw, Trophy, Sparkles, Volume2, VolumeX, Shield, Hammer, Compass } from "lucide-react";

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
    { type: "skull", name: "Tyrannosaur Skull", points: 500, emoji: "🦴", icon: "💀" },
    { type: "ribs", name: "Armored Rib Cage", points: 300, emoji: "🦴", icon: "🫁" },
    { type: "claw", name: "Sickle Hunting Claw", points: 350, emoji: "🦴", icon: "🦅" },
    { type: "tail", name: "Ankylosaur Club Tail", points: 400, emoji: "🦴", icon: "🔨" },
    { type: "spine", name: "Spinosaurus Spine", points: 450, emoji: "🦴", icon: "⚡" },
];

export default function FossilHunterGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("playing"); // 'playing' | 'gameover'
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(15);
    const [fossilsFound, setFossilsFound] = useState(0);
    const [totalFossils, setTotalFossils] = useState(6);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [discoveredLogs, setDiscoveredLogs] = useState([]);

    // Initialize Dig Site Grid
    const initGrid = () => {
        const size = 25; // 5x5 grid
        let newGrid = Array(size).fill(null).map((_, idx) => ({
            id: idx,
            revealed: false,
            content: "dirt", // 'dirt' | 'fossil' | 'rock'
            fossilInfo: null,
        }));

        // Place fossils
        let placedFossils = 0;
        const fossilCount = 6;
        setTotalFossils(fossilCount);

        while (placedFossils < fossilCount) {
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
        while (placedRocks < 5) {
            const randomIdx = Math.floor(Math.random() * size);
            if (newGrid[randomIdx].content === "dirt") {
                newGrid[randomIdx].content = "rock";
                placedRocks++;
            }
        }

        setGrid(newGrid);
        setScore(0);
        setAttempts(15);
        setFossilsFound(0);
        setDiscoveredLogs([]);
        setGameState("playing");
    };

    useEffect(() => {
        initGrid();
    }, []);

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
        <div className="relative min-h-screen bg-[#111a14] text-[#e4dac6] pt-20 pb-12 px-4 sm:px-6 font-sans">
            <div className="relative z-10 max-w-5xl mx-auto flex flex-col space-y-6">
                
                {/* Header bar */}
                <div className="flex items-center justify-between bg-[#192b1e] border border-[#2b4c34] rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBackToHub}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-amber-200 uppercase tracking-wider">
                                JURASSIC FOSSIL EXCAVATOR
                            </h1>
                            <p className="text-xs text-emerald-300/80">Unearth ancient dinosaur bones!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-[#0b160f] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                            <span className="text-[10px] text-gray-400 block uppercase">Digs Left</span>
                            <span className="text-base font-mono font-bold text-amber-300">{attempts}</span>
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
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                        >
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                    </div>
                </div>

                {/* Main Play Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left: 5x5 Dig Site Grid */}
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

                    {/* Right: Excavation Log & Skeleton Assembly */}
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

                        <div className="pt-2">
                            <button
                                onClick={initGrid}
                                className="w-full py-3 rounded-xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                            >
                                <RefreshCw size={16} />
                                <span>Reset Dig Site</span>
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
                                {fossilsFound >= totalFossils ? "COMPLETE SKELETON UNEXCAVATED!" : "EXCAVATION FINISHED"}
                            </h2>
                            <p className="text-xs text-gray-300">
                                You unearthed {fossilsFound} out of {totalFossils} ancient fossils!
                            </p>
                            <div className="bg-[#09150d] p-4 rounded-xl border border-white/10 flex justify-around font-mono">
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase">Final Score</span>
                                    <span className="text-lg font-bold text-emerald-400">{score}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase">Fossils</span>
                                    <span className="text-lg font-bold text-amber-300">{fossilsFound}</span>
                                </div>
                            </div>
                            <button
                                onClick={initGrid}
                                className="w-full py-3 rounded-xl bg-[#52B788] text-slate-950 font-bold text-sm uppercase tracking-wider hover:bg-[#66d29f] transition-all"
                            >
                                Start New Excavation
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
