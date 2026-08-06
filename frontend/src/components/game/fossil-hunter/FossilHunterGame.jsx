import { useState, useEffect } from "react";
import Navbar from "../../home_components/hero/Navbar";
import { ArrowLeft, RefreshCw, Volume2, VolumeX, Compass, Play, Award } from "lucide-react";
import Cursor from "../common/Cursor";

import Gameplay from "./Gameplay";
import LandingScreen from "./LandingScreen";
import GameOverModal from "./GameOverModal";

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
                <LandingScreen
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    initGrid={initGrid}
                    onBackToHub={onBackToHub}
                />
            )}

            {/* ACTIVE GAMEPLAY & GAME OVER SCREENS */}
            {(gameState === "playing" || gameState === "gameover") && (
                <main className="relative z-10 max-w-5xl mx-auto pt-8 pb-12 px-4 sm:px-6 flex flex-col space-y-6">
                    <Gameplay
                        difficulty={difficulty}
                        gameState={gameState}

                        attempts={attempts}
                        maxAttempts={maxAttempts}

                        fossilsFound={fossilsFound}
                        totalFossils={totalFossils}

                        score={score}

                        grid={grid}

                        discoveredLogs={discoveredLogs}

                        soundEnabled={soundEnabled}

                        handleTileClick={handleTileClick}

                        initGrid={initGrid}

                        setGameState={setGameState}
                        setSoundEnabled={setSoundEnabled}

                        onBackToHub={onBackToHub}
                    />

                    {/* STANDARDIZED JURASSIC COMPLETION MODAL */}
                    <Gameplay
                        difficulty={difficulty}

                        attempts={attempts}
                        maxAttempts={maxAttempts}

                        fossilsFound={fossilsFound}
                        totalFossils={totalFossils}

                        score={score}

                        grid={grid}

                        discoveredLogs={discoveredLogs}

                        soundEnabled={soundEnabled}

                        handleTileClick={handleTileClick}

                        initGrid={initGrid}

                        setGameState={setGameState}
                        setSoundEnabled={setSoundEnabled}

                        onBackToHub={onBackToHub}
                    />
                </main>
            )}

        </div>
    );
}
