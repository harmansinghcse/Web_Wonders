import { useState, useEffect, useCallback, useMemo } from "react";
import Navbar from "../../home_components/hero/Navbar";
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
import Cursor from "../common/Cursor";

import LandingScreen from "./LandingScreen";
import Gameplay from "./Gameplay";
import VictoryModal from "./VictoryModal";

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
                    className="w-full h-full object-cover filter brightness-75 contrast-105 saturate-105 scale-105 opacity-90"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1b0a2c]/65 via-[#0e0414]/50 to-[#0c0414]/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,85,247,0.30)_0%,transparent_65%)]" />
            </div>

            {/* Navigation Navbar (Landing Screen) */}
            {gameState === "landing" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* LANDING / LAUNCHER WINDOW SCREEN */}
            {gameState === "landing" && (
                <LandingScreen
                    gridSize={gridSize}
                    setGridSize={setGridSize}

                    selectedDino={selectedDino}
                    setSelectedDino={setSelectedDino}

                    DINO_IMAGES={DINO_IMAGES}

                    startGame={startGame}

                    onBackToHub={onBackToHub}
                />
            )}

            {/* ACTIVE PLAYING GAME ARENA */}
            {gameState === "playing" && (
                <div>
                    <Gameplay
                        board={board}
                        gridSize={gridSize}

                        selectedDino={selectedDino}

                        selectedSlot={selectedSlot}
                        isSolved={isSolved}

                        moves={moves}
                        time={time}

                        currentBest={currentBest}
                        difficultyLabel={difficultyLabel}
                        totalPieces={totalPieces}

                        piecePaths={piecePaths}

                        soundEnabled={soundEnabled}

                        handleSlotClick={handleSlotClick}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}

                        initializeGame={initializeGame}

                        setGameState={setGameState}
                        setSoundEnabled={setSoundEnabled}
                        showPreview={showPreview}
                        setShowPreview={setShowPreview}

                        formatTime={formatTime}
                    />
                    
                    {/* Solved Victory Celebration Modal */}
                    <VictoryModal
                        showVictoryModal={showVictoryModal}

                        difficultyLabel={difficultyLabel}
                        selectedDino={selectedDino}
                        totalPieces={totalPieces}

                        moves={moves}
                        time={time}

                        initializeGame={initializeGame}
                        setGameState={setGameState}

                        formatTime={formatTime}
                    />
                </div>
            )}
        </div>
    );
}
