import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../home_components/hero/Navbar";
import { 
    ArrowLeft, 
    ArrowRight,
    RotateCcw, 
    Trophy, 
    Timer, 
    Eye, 
    Sparkles, 
    Volume2, 
    VolumeX,
    Play,
    Image as ImageIcon,
    Puzzle,
    Check,
    HelpCircle
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

/**
 * Generate deterministic interlocking jigsaw tabs for a given grid size.
 * Returns { horizTabs, vertTabs }
 */
function generateJigsawTabs(gridSize) {
    // horizTabs: (gridSize-1) rows of dividers, gridSize columns wide
    const horizTabs = []; 
    for (let r = 0; r < gridSize - 1; r++) {
        const row = [];
        for (let c = 0; c < gridSize; c++) {
            const val = ((r * 7 + c * 13 + 3) % 2 === 0) ? 1 : -1;
            row.push(val);
        }
        horizTabs.push(row);
    }

    // vertTabs: gridSize rows of dividers, (gridSize-1) columns wide
    const vertTabs = [];
    for (let r = 0; r < gridSize; r++) {
        const row = [];
        for (let c = 0; c < gridSize - 1; c++) {
            const val = ((r * 11 + c * 5 + 7) % 2 === 0) ? 1 : -1;
            row.push(val);
        }
        vertTabs.push(row);
    }

    return { horizTabs, vertTabs };
}

/**
 * Generate SVG Path string for a jigsaw piece at (r, c)
 * viewBox: 0 0 100 100
 */
function createJigsawPath(r, c, gridSize, tabs) {
    const { horizTabs, vertTabs } = tabs;

    const topTab = (r === 0 || !horizTabs || !horizTabs[r - 1]) ? 0 : -horizTabs[r - 1][c];
    const bottomTab = (r === gridSize - 1 || !horizTabs || !horizTabs[r]) ? 0 : horizTabs[r][c];
    const leftTab = (c === 0 || !vertTabs || !vertTabs[r]) ? 0 : -vertTabs[r][c - 1];
    const rightTab = (c === gridSize - 1 || !vertTabs || !vertTabs[r]) ? 0 : vertTabs[r][c];

    let path = "M 0 0 ";

    // Top Edge (0,0 -> 100,0)
    if (topTab === 0) {
        path += "L 100 0 ";
    } else if (topTab === 1) {
        path += "L 38 0 C 38 -14, 44 -20, 50 -20 C 56 -20, 62 -14, 62 0 L 100 0 ";
    } else {
        path += "L 38 0 C 38 14, 44 20, 50 20 C 56 20, 62 14, 62 0 L 100 0 ";
    }

    // Right Edge (100,0 -> 100,100)
    if (rightTab === 0) {
        path += "L 100 100 ";
    } else if (rightTab === 1) {
        path += "L 100 38 C 114 38, 120 44, 120 50 C 120 56, 114 62, 100 62 L 100 100 ";
    } else {
        path += "L 100 38 C 86 38, 80 44, 80 50 C 80 56, 86 62, 100 62 L 100 100 ";
    }

    // Bottom Edge (100,100 -> 0,100)
    if (bottomTab === 0) {
        path += "L 0 100 ";
    } else if (bottomTab === 1) {
        path += "L 62 100 C 62 114, 56 120, 50 120 C 44 120, 38 114, 38 100 L 0 100 ";
    } else {
        path += "L 62 100 C 62 86, 56 80, 50 80 C 44 80, 38 86, 38 100 L 0 100 ";
    }

    // Left Edge (0,100 -> 0,0)
    if (leftTab === 0) {
        path += "L 0 0 ";
    } else if (leftTab === 1) {
        path += "L 0 62 C -14 62, -20 56, -20 50 C -20 44, -14 38, 0 38 L 0 0 ";
    } else {
        path += "L 0 62 C 14 62, 20 56, 20 50 C 20 44, 14 38, 0 38 L 0 0 ";
    }

    path += "Z";
    return path;
}

export default function DinoPuzzleTilesGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("landing"); // 'landing' | 'playing'
    const [gridSize, setGridSize] = useState(3); // 3 (Easy: 9), 4 (Moderate: 16), 5 (Hard: 25)
    const [selectedDino, setSelectedDino] = useState(DINO_IMAGES[0]);
    const [board, setBoard] = useState([]); // Board array mapping slot index -> piece ID
    const [selectedSlot, setSelectedSlot] = useState(null); // Click-to-swap selection
    const [draggedSlot, setDraggedSlot] = useState(null); // Drag-and-drop
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [bestScores, setBestScores] = useState(() => {
        const saved = localStorage.getItem("jurassic_puzzle_best");
        return saved ? JSON.parse(saved) : {};
    });

    const totalPieces = gridSize * gridSize;

    // Generate interlocking tab data for current grid size
    const jigsawTabs = useMemo(() => generateJigsawTabs(gridSize), [gridSize]);

    // Precalculate SVG Paths for each piece ID (0 .. totalPieces-1)
    const piecePaths = useMemo(() => {
        const paths = [];
        for (let id = 0; id < totalPieces; id++) {
            const r = Math.floor(id / gridSize);
            const c = id % gridSize;
            paths.push(createJigsawPath(r, c, gridSize, jigsawTabs));
        }
        return paths;
    }, [gridSize, totalPieces, jigsawTabs]);

    // Sound effects
    const playSound = useCallback((type) => {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === "swap") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(420, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } else if (type === "win") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36); // C6
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.7);
            }
        } catch (e) {}
    }, [soundEnabled]);

    // Check if board is completely solved
    const checkWin = useCallback((currentBoard) => {
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] !== i) return false;
        }
        return true;
    }, []);

    // Initialize & shuffle puzzle pieces
    const initializeGame = useCallback(() => {
        let pieces = Array.from({ length: totalPieces }, (_, i) => i);
        
        // Shuffle pieces ensuring board is not initially solved
        do {
            for (let i = pieces.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
            }
        } while (checkWin(pieces));

        setBoard(pieces);
        setSelectedSlot(null);
        setDraggedSlot(null);
        setMoves(0);
        setTime(0);
        setIsPlaying(false);
        setIsSolved(false);
        setShowVictoryModal(false);
    }, [totalPieces, checkWin]);

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

    // Perform swap between slot A and slot B
    const swapSlots = (slotA, slotB) => {
        if (slotA === slotB || isSolved) return;

        if (!isPlaying) setIsPlaying(true);

        const newBoard = [...board];
        const temp = newBoard[slotA];
        newBoard[slotA] = newBoard[slotB];
        newBoard[slotB] = temp;

        setBoard(newBoard);
        setMoves((prev) => prev + 1);
        setSelectedSlot(null);
        playSound("swap");

        if (checkWin(newBoard)) {
            setIsSolved(true);
            setIsPlaying(false);
            playSound("win");

            // Save best score
            const key = `${selectedDino.id}_${gridSize}x${gridSize}`;
            const prevBest = bestScores[key];
            const currentScore = { moves: moves + 1, time: time + 1 };

            if (!prevBest || currentScore.moves < prevBest.moves || (currentScore.moves === prevBest.moves && currentScore.time < prevBest.time)) {
                const newBestScores = { ...bestScores, [key]: currentScore };
                setBestScores(newBestScores);
                localStorage.setItem("jurassic_puzzle_best", JSON.stringify(newBestScores));
            }

            // Delay victory modal popup so user can admire their completed artwork on the grid canvas first!
            setTimeout(() => {
                setShowVictoryModal(true);
            }, 1400);
        }
    };

    // Click-to-swap handler
    const handleSlotClick = (slotIdx) => {
        if (selectedSlot === null) {
            setSelectedSlot(slotIdx);
        } else if (selectedSlot === slotIdx) {
            setSelectedSlot(null);
        } else {
            swapSlots(selectedSlot, slotIdx);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e, slotIdx) => {
        setDraggedSlot(slotIdx);
        e.dataTransfer.setData("text/plain", slotIdx);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetSlotIdx) => {
        e.preventDefault();
        const sourceSlot = draggedSlot !== null ? draggedSlot : parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (!isNaN(sourceSlot) && sourceSlot !== targetSlotIdx) {
            swapSlots(sourceSlot, targetSlotIdx);
        }
        setDraggedSlot(null);
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
        <div className="game-page relative min-h-screen bg-[#0e0717] text-stone-100 font-sans select-none overflow-x-hidden pb-16">
            <Cursor />

            {/* Background Atmosphere Image & Vibe Overlay */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <img
                    src="/jurassic_game_vibe_bg.jpg"
                    alt="Jurassic Vibe"
                    className="w-full h-full object-cover filter brightness-60 contrast-110 scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1b0a2c]/70 via-black/45 to-[#0c0414]/90" />
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
                            <Puzzle size={15} className="text-purple-400" />
                            <span>PUZZLE & LOGIC</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-md">
                            JURASSIC DINO PUZZLE TILES
                        </h1>
                        <p className="text-sm sm:text-base text-purple-200/90 max-w-lg mx-auto font-medium">
                            Choose your artwork and difficulty to reconstruct ancient dinosaur relics in this interlocking jigsaw puzzle!
                        </p>
                    </div>

                    {/* Central Launcher Control Window */}
                    <div className="w-full max-w-3xl bg-[#180a2b]/95 border border-purple-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-7 backdrop-blur-md">
                        
                        {/* Select Difficulty Level */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest text-center sm:text-left">
                                SELECT DIFFICULTY LEVEL
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 3, name: "EASY", grid: "3×3 Grid", pieces: "9 Jigsaw Pieces" },
                                    { id: 4, name: "MODERATE", grid: "4×4 Grid", pieces: "16 Jigsaw Pieces" },
                                    { id: 5, name: "HARD", grid: "5×5 Grid", pieces: "25 Jigsaw Pieces" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setGridSize(item.id)}
                                        className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                                            gridSize === item.id
                                                ? item.id === 3
                                                    ? "bg-emerald-600/90 border-emerald-400 text-white shadow-lg scale-102"
                                                    : item.id === 4
                                                    ? "bg-amber-600/90 border-amber-400 text-white shadow-lg scale-102"
                                                    : "bg-red-600/90 border-red-400 text-white shadow-lg scale-102"
                                                : "bg-black/40 border-white/10 text-stone-300 hover:border-purple-400/50 hover:text-white"
                                        }`}
                                    >
                                        <span className="font-extrabold text-sm sm:text-base uppercase">{item.name}</span>
                                        <span className="text-[11px] opacity-90 mt-1 font-medium">{item.grid}</span>
                                        <span className="text-[10px] opacity-75">{item.pieces}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Select Dinosaur Artwork */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-serif font-bold text-purple-300 uppercase tracking-widest">
                                    SELECT DINOSAUR ARTWORK
                                </h3>
                                <span className="text-[11px] font-bold text-amber-300">
                                    Selected: {selectedDino.name}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                                {DINO_IMAGES.map((dino) => {
                                    const isSelected = selectedDino.id === dino.id;
                                    return (
                                        <button
                                            key={dino.id}
                                            onClick={() => setSelectedDino(dino)}
                                            className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer text-left ${
                                                isSelected
                                                    ? "border-amber-400 ring-4 ring-amber-400/35 scale-[1.03] shadow-[0_0_25px_rgba(245,158,11,0.35)] z-10"
                                                    : "border-white/15 opacity-75 hover:opacity-100 hover:border-purple-400 hover:scale-[1.02]"
                                            }`}
                                        >
                                            <div className="h-32 sm:h-36 w-full overflow-hidden relative">
                                                <img
                                                    src={dino.src}
                                                    alt={dino.name}
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                                                        SELECTED ✓
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3">
                                                    <span className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors drop-shadow-sm">
                                                        {dino.name}
                                                    </span>
                                                    <span className="text-[10px] text-purple-200/90 font-medium mt-0.5 truncate">
                                                        {dino.period} • {dino.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Start Game Action Button */}
                        <button
                            onClick={startGame}
                            className="w-full py-4 rounded-2xl bg-[#52B788] hover:bg-[#40a073] text-slate-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer hover:scale-102 active:scale-95"
                        >
                            <Play size={22} className="fill-current" />
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
                                <span>RESHUFFLE</span>
                            </button>
                        </div>
                    </header>

                    {/* Main Game Arena */}
                    <main className="relative z-10 max-w-5xl mx-auto mt-6 px-4 sm:px-6 flex flex-col items-center">
                        
                        {/* Title & Badge */}
                        <div className="text-center space-y-2 mb-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black tracking-widest uppercase">
                                <Puzzle size={14} className="text-purple-400" />
                                <span>{selectedDino.name} • {difficultyLabel.toUpperCase()} ({gridSize}×{gridSize} • {totalPieces} Pieces)</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight drop-shadow-md">
                                JURASSIC JIGSAW PUZZLE
                            </h1>
                        </div>

                        {/* Dashboard Bar: Stats & Controls */}
                        <div className="w-full max-w-xl bg-purple-950/40 border border-purple-500/30 rounded-3xl p-4 backdrop-blur-xl mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shadow-xl">
                            <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                                    <Puzzle size={13} className="text-purple-400" />
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
                                    title="Preview target artwork"
                                >
                                    <Eye size={14} />
                                    <span>PREVIEW</span>
                                </button>
                            </div>
                        </div>

                        {/* Instructions Bar */}
                        <div className="w-full max-w-xl flex items-center justify-between gap-3 mb-6 bg-black/40 border border-white/10 p-3 rounded-2xl backdrop-blur-md text-xs text-purple-200/90 font-medium">
                            <span className="flex items-center gap-1.5">
                                <HelpCircle size={14} className="text-amber-400 shrink-0" />
                                <span>Click two jigsaw pieces to swap them, or drag & drop onto any slot!</span>
                            </span>
                        </div>

                        {/* JIGSAW PUZZLE BOARD CANVAS - SEAMLESS ZERO GAP */}
                        <div className="relative p-2.5 sm:p-3.5 rounded-3xl bg-gradient-to-b from-[#2a133d] via-[#1a082b] to-[#0a0412] border-2 border-purple-500/40 shadow-[0_25px_60px_rgba(168,85,247,0.35)] backdrop-blur-2xl">
                            <div
                                className="grid gap-0 rounded-2xl overflow-hidden bg-stone-950 border border-purple-500/30 relative"
                                style={{
                                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                    width: "min(88vw, 420px)",
                                    height: "min(88vw, 420px)",
                                }}
                            >
                                {board.map((pieceId, slotIdx) => {
                                    const isSelected = selectedSlot === slotIdx;
                                    const isCorrect = pieceId === slotIdx;

                                    // Piece row & col in original image
                                    const origRow = Math.floor(pieceId / gridSize);
                                    const origCol = pieceId % gridSize;

                                    const svgPath = piecePaths[pieceId];

                                    return (
                                        <div
                                            key={slotIdx}
                                            onClick={() => handleSlotClick(slotIdx)}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, slotIdx)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, slotIdx)}
                                            className={`relative w-full h-full transition-all duration-200 select-none cursor-pointer overflow-visible ${
                                                isSelected
                                                    ? "scale-110 z-30 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]"
                                                    : "hover:scale-[1.03] hover:z-20 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
                                            }`}
                                        >
                                            <svg
                                                viewBox="-25 -25 150 150"
                                                className="w-full h-full overflow-visible"
                                            >
                                                <defs>
                                                    <clipPath id={`jigsaw-clip-${pieceId}`}>
                                                        <path d={svgPath} />
                                                    </clipPath>
                                                </defs>

                                                {/* Image clipped to jigsaw shape */}
                                                <image
                                                    href={selectedDino.src}
                                                    x={-origCol * 100}
                                                    y={-origRow * 100}
                                                    width={gridSize * 100}
                                                    height={gridSize * 100}
                                                    clipPath={`url(#jigsaw-clip-${pieceId})`}
                                                    preserveAspectRatio="none"
                                                />

                                                {/* Outer jigsaw outline stroke */}
                                                <path
                                                    d={svgPath}
                                                    fill="none"
                                                    stroke={isSelected ? "#f59e0b" : isCorrect ? "rgba(82,183,136,0.6)" : "rgba(0,0,0,0.65)"}
                                                    strokeWidth={isSelected ? "4" : "2.5"}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                            {/* Correct position indicator checkmark */}
                                            {isCorrect && !isSolved && (
                                                <div className="absolute top-1 right-1 bg-emerald-500/90 text-slate-950 p-0.5 rounded-full shadow-md z-30 pointer-events-none">
                                                    <Check size={10} className="stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* FULL UNIFIED COMPLETED ARTWORK OVERLAY (ON GRID FIRST BEFORE POPUP) */}
                                {isSolved && (
                                    <div className="absolute inset-0 z-40 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.8)] animate-in fade-in zoom-in-95 duration-500">
                                        <img src={selectedDino.src} alt={selectedDino.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-4">
                                            <span className="bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full shadow-xl animate-bounce">
                                                ✨ PUZZLE COMPLETED! ✨
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                                        Target Artwork Preview
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
                                    <p className="text-xs text-purple-300/80">{selectedDino.period} • {selectedDino.role}</p>
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
                    {showVictoryModal && (
                        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center min-h-screen bg-black/85 backdrop-blur-md">
                            <div className="max-w-sm w-full max-h-[88vh] overflow-y-auto custom-scrollbar my-auto rounded-3xl bg-gradient-to-b from-[#2a0e4a] via-[#1a0833] to-[#0e041d] border-2 border-amber-400/60 p-6 text-center shadow-[0_0_60px_rgba(245,158,11,0.4)] space-y-5 relative">
                                
                                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

                                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xl animate-bounce">
                                    <Trophy size={36} />
                                </div>

                                <div>
                                    <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
                                        JIGSAW PUZZLE SOLVED ({difficultyLabel.toUpperCase()})!
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-2 tracking-tight">
                                        {selectedDino.name} Reconstructed!
                                    </h2>
                                    <p className="text-xs text-purple-200/80 mt-1">
                                        Outstanding work, Paleontologist! You assembled all {totalPieces} interlocking pieces flawlessly.
                                    </p>
                                </div>

                                {/* Final Stats */}
                                <div className="grid grid-cols-2 gap-3 bg-black/50 border border-white/10 p-3 rounded-2xl font-mono text-sm">
                                    <div className="text-center">
                                        <span className="text-[10px] text-stone-400 uppercase block font-sans">Swaps Made</span>
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
