import { useState, useEffect, useCallback } from "react";
import Navbar from "../home_components/hero/Navbar";
import { 
    ArrowLeft, 
    RotateCcw, 
    Trophy, 
    Timer, 
    Grid, 
    Eye, 
    Sparkles, 
    Volume2, 
    VolumeX,
    Play,
    Image as ImageIcon
} from "lucide-react";
import Cursor from "./Cursor";

const DINO_IMAGES = [
    { id: "trex", name: "Tyrannosaurus Rex", src: "/trex.jpg", period: "Late Cretaceous", role: "Apex Predator" },
    { id: "triceratops", name: "Triceratops", src: "/triceratops.jpg", period: "Late Cretaceous", role: "Armored Herbivore" },
    { id: "velociraptor", name: "Velociraptor", src: "/velociraptor.jpg", period: "Late Cretaceous", role: "Agile Hunter" },
    { id: "brachiosaurus", name: "Brachiosaurus", src: "/brachiosaurus.jpg", period: "Late Jurassic", role: "Giant Sauropod" },
    { id: "stegosaurus", name: "Stegosaurus", src: "/stegosaurus.jpg", period: "Late Jurassic", role: "Plated Defender" },
    { id: "allosaurus", name: "Allosaurus", src: "/allosaurus.jpg", period: "Late Jurassic", role: "Jurassic Carnivore" },
];

export default function DinoPuzzleTilesGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("landing"); // 'landing' | 'playing'
    const [gridSize, setGridSize] = useState(3); // 3 (Easy), 4 (Moderate), 5 (Hard)
    const [selectedDino, setSelectedDino] = useState(DINO_IMAGES[0]);
    const [board, setBoard] = useState([]);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [showNumbers, setShowNumbers] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [bestScores, setBestScores] = useState(() => {
        const saved = localStorage.getItem("jurassic_puzzle_best");
        return saved ? JSON.parse(saved) : {};
    });

    const totalTiles = gridSize * gridSize;
    const emptyTileValue = totalTiles - 1;

    // Synthesized sound effects
    const playSound = useCallback((type) => {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === "slide") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
            } else if (type === "win") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
            }
        } catch (e) {
            // Audio Context uninitialized or blocked
        }
    }, [soundEnabled]);

    // Check if board is solved
    const checkWin = useCallback((currentBoard) => {
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] !== i) return false;
        }
        return true;
    }, []);

    // Generate guaranteed solvable board by performing random valid moves from solved state
    const initializeGame = useCallback(() => {
        let currentBoard = Array.from({ length: totalTiles }, (_, i) => i);
        let emptyIdx = totalTiles - 1;

        // Perform shuffles proportional to difficulty
        const numShuffles = gridSize === 3 ? 120 : gridSize === 4 ? 200 : 320;
        let lastIdx = -1;

        for (let s = 0; s < numShuffles; s++) {
            const emptyRow = Math.floor(emptyIdx / gridSize);
            const emptyCol = emptyIdx % gridSize;
            const validNeighbors = [];

            // Up, Down, Left, Right
            if (emptyRow > 0) validNeighbors.push(emptyIdx - gridSize);
            if (emptyRow < gridSize - 1) validNeighbors.push(emptyIdx + gridSize);
            if (emptyCol > 0) validNeighbors.push(emptyIdx - 1);
            if (emptyCol < gridSize - 1) validNeighbors.push(emptyIdx + 1);

            // Avoid immediately reversing previous move
            const filtered = validNeighbors.filter(idx => idx !== lastIdx);
            const chosen = filtered.length > 0
                ? filtered[Math.floor(Math.random() * filtered.length)]
                : validNeighbors[Math.floor(Math.random() * validNeighbors.length)];

            // Swap
            currentBoard[emptyIdx] = currentBoard[chosen];
            currentBoard[chosen] = emptyTileValue;
            lastIdx = emptyIdx;
            emptyIdx = chosen;
        }

        setBoard(currentBoard);
        setMoves(0);
        setTime(0);
        setIsPlaying(false);
        setIsSolved(false);
    }, [gridSize, totalTiles, emptyTileValue]);

    const startGame = () => {
        initializeGame();
        setGameState("playing");
    };

    // Timer effect
    useEffect(() => {
        let interval = null;
        if (gameState === "playing" && isPlaying && !isSolved) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, isPlaying, isSolved]);

    // Handle tile click & slide
    const handleTileClick = (index) => {
        if (isSolved) return;

        const tileVal = board[index];
        if (tileVal === emptyTileValue) return;

        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const emptyIdx = board.indexOf(emptyTileValue);
        const emptyRow = Math.floor(emptyIdx / gridSize);
        const emptyCol = emptyIdx % gridSize;

        // Distance check (must be adjacent vertically or horizontally)
        const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

        if (isAdjacent) {
            if (!isPlaying) setIsPlaying(true);

            const newBoard = [...board];
            newBoard[emptyIdx] = tileVal;
            newBoard[index] = emptyTileValue;

            setBoard(newBoard);
            setMoves((prev) => prev + 1);
            playSound("slide");

            if (checkWin(newBoard)) {
                setIsSolved(true);
                setIsPlaying(false);
                playSound("win");

                // Update best score
                const key = `${selectedDino.id}_${gridSize}x${gridSize}`;
                const prevBest = bestScores[key];
                const currentScore = { moves: moves + 1, time: time + 1 };

                if (!prevBest || currentScore.moves < prevBest.moves || (currentScore.moves === prevBest.moves && currentScore.time < prevBest.time)) {
                    const newBestScores = { ...bestScores, [key]: currentScore };
                    setBestScores(newBestScores);
                    localStorage.setItem("jurassic_puzzle_best", JSON.stringify(newBestScores));
                }
            }
        }
    };

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const bestKey = `${selectedDino.id}_${gridSize}x${gridSize}`;
    const currentBest = bestScores[bestKey];
    const difficultyLabel = gridSize === 3 ? "Easy" : gridSize === 4 ? "Moderate" : "Hard";

    return (
        <div className="relative min-h-screen bg-[#0e0717] text-stone-100 font-sans select-none overflow-x-hidden pb-16">
            <Cursor />

            {/* Background Image & Vibe Overlay */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <img
                    src="/jurassic_game_vibe_bg.jpg"
                    alt="Jurassic Vibe"
                    className="w-full h-full object-cover filter brightness-60 contrast-110 scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1b0a2c]/70 via-black/40 to-[#0c0414]/90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.3)_0%,transparent_70%)]" />
            </div>

            {/* Navigation Navbar (Landing Screen) */}
            {gameState === "landing" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* LANDING / LAUNCHER WINDOW SCREEN */}
            {gameState === "landing" && (
                <main className="relative z-10 max-w-4xl mx-auto pt-28 pb-16 px-4 flex flex-col items-center justify-center min-h-screen text-center space-y-8">
                    
                    {onBackToHub && (
                        <button
                            onClick={onBackToHub}
                            className="inline-flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 text-purple-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-md"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Game Hub</span>
                        </button>
                    )}

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-[#25103a]/80 border border-purple-400/40 px-4 py-1.5 rounded-full text-xs font-serif font-bold text-purple-300 uppercase backdrop-blur-md">
                            <Sparkles size={14} className="text-purple-400" />
                            <span>🧩 JURASSIC PUZZLE TILES</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-md">
                            JURASSIC DINO PUZZLE TILES
                        </h1>
                        <p className="text-sm sm:text-base text-purple-200/90 max-w-lg mx-auto font-medium">
                            Slide scrambled prehistoric image tiles to solve the 3×3, 4×4, or 5×5 dinosaur artwork puzzle!
                        </p>
                    </div>

                    {/* Central Launcher Control Window */}
                    <div className="w-full max-w-md bg-[#180a2b]/95 border border-purple-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 backdrop-blur-md">
                        
                        {/* Select Difficulty Level */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
                                SELECT DIFFICULTY LEVEL
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 3, name: "EASY", grid: "3×3 Grid", tiles: "8 Tiles" },
                                    { id: 4, name: "MODERATE", grid: "4×4 Grid", tiles: "15 Tiles" },
                                    { id: 5, name: "HARD", grid: "5×5 Grid", tiles: "24 Tiles" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setGridSize(item.id)}
                                        className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                                            gridSize === item.id
                                                ? item.id === 3
                                                    ? "bg-emerald-600/90 border-emerald-400 text-white shadow-lg scale-105"
                                                    : item.id === 4
                                                    ? "bg-amber-600/90 border-amber-400 text-white shadow-lg scale-105"
                                                    : "bg-red-600/90 border-red-400 text-white shadow-lg scale-105"
                                                : "bg-black/40 border-white/10 text-stone-300 hover:border-purple-400/50 hover:text-white"
                                        }`}
                                    >
                                        <span className="font-extrabold text-sm uppercase">{item.name}</span>
                                        <span className="text-[10px] opacity-80 mt-1">{item.grid}</span>
                                        <span className="text-[9px] opacity-70">{item.tiles}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Select Dinosaur Artwork */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-serif font-bold text-purple-300 uppercase tracking-widest">
                                SELECT DINOSAUR ARTWORK
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {DINO_IMAGES.map((dino) => (
                                    <button
                                        key={dino.id}
                                        onClick={() => setSelectedDino(dino)}
                                        className={`relative group rounded-xl overflow-hidden border transition cursor-pointer ${
                                            selectedDino.id === dino.id
                                                ? "border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-md"
                                                : "border-white/15 opacity-70 hover:opacity-100 hover:border-purple-400"
                                        }`}
                                    >
                                        <img src={dino.src} alt={dino.name} className="h-16 w-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                                            <span className="text-[9px] font-bold text-white truncate">{dino.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Start Game Action Button */}
                        <button
                            onClick={startGame}
                            className="w-full py-4 rounded-2xl bg-[#52B788] hover:bg-[#40a073] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer hover:scale-102 active:scale-95"
                        >
                            <Play size={20} className="fill-current" />
                            <span>START PUZZLE GAME</span>
                        </button>

                    </div>
                </main>
            )}

            {/* ACTIVE PLAYING GAME ARENA */}
            {gameState === "playing" && (
                <div>
                    {/* Header Controls */}
                    <header className="relative z-10 max-w-6xl mx-auto pt-6 px-4 sm:px-6 flex items-center justify-between">
                        <button
                            onClick={() => setGameState("landing")}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-sm font-bold backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                        >
                            <ArrowLeft size={18} />
                            <span>PUZZLE MENU</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSoundEnabled((prev) => !prev)}
                                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 transition cursor-pointer"
                                title={soundEnabled ? "Mute sound" : "Enable sound"}
                            >
                                {soundEnabled ? <Volume2 size={18} className="text-purple-400" /> : <VolumeX size={18} className="text-stone-400" />}
                            </button>
                            <button
                                onClick={initializeGame}
                                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600/80 hover:bg-purple-500 border border-purple-400/40 text-white text-sm font-bold shadow-lg transition cursor-pointer hover:scale-105 active:scale-95"
                            >
                                <RotateCcw size={16} />
                                <span>SHUFFLE</span>
                            </button>
                        </div>
                    </header>

                    {/* Main Game Arena */}
                    <main className="relative z-10 max-w-5xl mx-auto mt-6 px-4 sm:px-6 flex flex-col items-center">
                        
                        {/* Title & Badge */}
                        <div className="text-center space-y-2 mb-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black tracking-widest uppercase">
                                <Sparkles size={14} className="text-purple-400" />
                                <span>{selectedDino.name} • {difficultyLabel.toUpperCase()} ({gridSize}×{gridSize})</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight drop-shadow-md">
                                DINO PUZZLE TILES
                            </h1>
                        </div>

                        {/* Dashboard Bar: Stats & Controls */}
                        <div className="w-full max-w-xl bg-purple-950/40 border border-purple-500/30 rounded-3xl p-4 backdrop-blur-xl mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shadow-xl">
                            <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                                    <Grid size={13} className="text-purple-400" />
                                    <span>MOVES</span>
                                </div>
                                <p className="text-lg font-black text-white mt-0.5">{moves}</p>
                            </div>

                            <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                                    <Timer size={13} className="text-purple-400" />
                                    <span>TIME</span>
                                </div>
                                <p className="text-lg font-black text-white mt-0.5">{formatTime(time)}</p>
                            </div>

                            <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                                    <Trophy size={13} className="text-amber-400" />
                                    <span>BEST ({difficultyLabel})</span>
                                </div>
                                <p className="text-xs font-bold text-amber-300 mt-1">
                                    {currentBest ? `${currentBest.moves} m (${formatTime(currentBest.time)})` : "--"}
                                </p>
                            </div>

                            <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                                    title="Preview target image"
                                >
                                    <Eye size={14} />
                                    <span>PREVIEW</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Game Options Bar */}
                        <div className="w-full max-w-xl flex items-center justify-between gap-3 mb-6 bg-black/40 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <span className="text-xs font-bold text-purple-300 truncate">{selectedDino.name} ({gridSize}×{gridSize})</span>
                            
                            <button
                                onClick={() => setShowNumbers((prev) => !prev)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                                    showNumbers
                                        ? "bg-purple-500/20 text-purple-300 border-purple-400/40"
                                        : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white"
                                }`}
                            >
                                Numbers: {showNumbers ? "ON" : "OFF"}
                            </button>
                        </div>

                        {/* Puzzle Grid Canvas */}
                        <div className="relative p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-purple-950/80 via-[#180a2b]/90 to-stone-950 border-2 border-purple-500/40 shadow-[0_20px_50px_rgba(147,51,234,0.3)] backdrop-blur-2xl">
                            <div
                                className="grid gap-1 sm:gap-1.5 rounded-2xl overflow-hidden bg-black/60 p-2 border border-purple-500/20"
                                style={{
                                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                    width: "min(88vw, 420px)",
                                    height: "min(88vw, 420px)",
                                }}
                            >
                                {board.map((tileVal, idx) => {
                                    const isEmpty = tileVal === emptyTileValue;
                                    const origRow = Math.floor(tileVal / gridSize);
                                    const origCol = tileVal % gridSize;

                                    // Calculate background position percentages
                                    const posX = (origCol / (gridSize - 1)) * 100;
                                    const posY = (origRow / (gridSize - 1)) * 100;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleTileClick(idx)}
                                            className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-150 select-none shadow-md ${
                                                isEmpty
                                                    ? "bg-purple-950/20 border border-purple-500/10 shadow-inner"
                                                    : "cursor-pointer hover:brightness-110 active:scale-95 border border-purple-400/40 hover:border-purple-300"
                                            }`}
                                            style={
                                                isEmpty
                                                    ? {}
                                                    : {
                                                          backgroundImage: `url(${selectedDino.src})`,
                                                          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                                                          backgroundPosition: `${posX}% ${posY}%`,
                                                      }
                                            }
                                        >
                                            {!isEmpty && showNumbers && (
                                                <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black/70 border border-white/20 text-[9px] sm:text-[10px] font-black text-amber-300 shadow-sm backdrop-blur-xs">
                                                    {tileVal + 1}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </main>

                    {/* Target Image Preview Modal */}
                    {showPreview && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
                            <div className="max-w-md w-full rounded-3xl bg-[#1a0c2e] border border-purple-500/40 p-6 text-center shadow-2xl space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                                        <ImageIcon size={18} className="text-purple-400" />
                                        Target Image Preview
                                    </h3>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="rounded-2xl overflow-hidden border border-purple-400/40 shadow-lg">
                                    <img src={selectedDino.src} alt={selectedDino.name} className="w-full h-64 object-cover" />
                                </div>

                                <div>
                                    <h4 className="font-bold text-white text-base">{selectedDino.name}</h4>
                                    <p className="text-xs text-purple-300/80">{selectedDino.period}</p>
                                </div>

                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase tracking-wider transition cursor-pointer"
                                >
                                    BACK TO PUZZLE
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Solved Victory Celebration Modal */}
                    {isSolved && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in zoom-in-95 duration-300">
                            <div className="max-w-sm w-full rounded-3xl bg-gradient-to-b from-[#2a0e4a] via-[#1a0833] to-[#0e041d] border-2 border-amber-400/60 p-6 text-center shadow-[0_0_60px_rgba(245,158,11,0.4)] space-y-5 relative overflow-hidden">
                                
                                {/* Glow background decal */}
                                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

                                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xl animate-bounce">
                                    <Trophy size={36} />
                                </div>

                                <div>
                                    <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
                                        PUZZLE SOLVED ({difficultyLabel.toUpperCase()})!
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-2 tracking-tight">
                                        {selectedDino.name} Restored!
                                    </h2>
                                    <p className="text-xs text-purple-200/80 mt-1">
                                        Outstanding work, Paleontologist! You assembled the ancient relic cleanly.
                                    </p>
                                </div>

                                {/* Final Stats */}
                                <div className="grid grid-cols-2 gap-3 bg-black/50 border border-white/10 p-3 rounded-2xl font-mono text-sm">
                                    <div className="text-center">
                                        <span className="text-[10px] text-stone-400 uppercase block font-sans">Total Moves</span>
                                        <span className="text-lg font-bold text-amber-300">{moves}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[10px] text-stone-400 uppercase block font-sans">Time Taken</span>
                                        <span className="text-lg font-bold text-emerald-300">{formatTime(time)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <button
                                        onClick={initializeGame}
                                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-102 active:scale-95"
                                    >
                                        PLAY AGAIN
                                    </button>
                                    <button
                                        onClick={() => setGameState("landing")}
                                        className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                                    >
                                        BACK TO PUZZLE MENU
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
