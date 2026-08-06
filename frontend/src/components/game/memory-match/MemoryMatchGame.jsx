import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../home_components/hero/Navbar";
import Cursor from "../common/Cursor";
import { getExplorerDinosaurs } from "../../../services/explorerService";
import { 
    Play, 
    RotateCcw, 
    Clock, 
    Sparkles, 
    Award, 
    BookOpen, 
    Volume2, 
    VolumeX, 
    ArrowLeft,
    ChevronRight,
    Star,
    Lightbulb,
    Pause,
    Menu as MenuIcon
} from "lucide-react";

import { DINOSAURS_DATA, playSound } from "./constants";
import LandingScreen from "./LandingScreen";
import Gameplay from "./Gameplay";
import Modals from "./Modals";

export default function MemoryMatchGame({ onBackToHub }) {
    // Game States: 'landing' | 'playing' | 'paused' | 'gameover'
    const [gameState, setGameState] = useState("landing");
    const [difficulty, setDifficulty] = useState("medium"); // 'easy' (6 pairs), 'medium' (8 pairs), 'hard' (10 pairs)
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [unlockedFacts, setUnlockedFacts] = useState([]);
    const [recentFact, setRecentFact] = useState(null);
    const [matchOverlay, setMatchOverlay] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const [dbDinosaurs, setDbDinosaurs] = useState([]);
    const [isPreloading, setIsPreloading] = useState(false);
    const [loadingDb, setLoadingDb] = useState(true);

    const [bestScore, setBestScore] = useState(() => {
        return parseInt(localStorage.getItem("jurassic_memory_best") || "0", 10);
    });

    const timerRef = useRef(null);

    // Fetch dinosaurs from DB on mount
    useEffect(() => {
        const loadDinos = async () => {
            try {
                const response = await getExplorerDinosaurs({ limit: 100 });
                if (response && response.data) {
                    setDbDinosaurs(response.data);
                }
            } catch (err) {
                console.error("Error loading dinosaurs:", err);
            } finally {
                setLoadingDb(false);
            }
        };
        loadDinos();
    }, []);

    // Preload background image
    useEffect(() => {
        const bgImg = new Image();
        bgImg.src = "/jurassic_memory_match_bg.jpg";
    }, []);

    // Get number of pairs based on difficulty
    const getPairCount = () => {
        if (difficulty === "easy") return 6;
        if (difficulty === "medium") return 8;
        return 10; // hard
    };

    // Initialize Game
    const startNewGame = async () => {
        setIsPreloading(true);
        const pairCount = getPairCount();
        
        let sourceList = dbDinosaurs.length > 0 ? dbDinosaurs : DINOSAURS_DATA;
        
        const formattedDinos = sourceList.map(dino => {
            if (dino.images) {
                return {
                    id: dino._id || dino.id || dino.slug,
                    name: dino.name.toUpperCase(),
                    tagline: dino.scientificName || dino.stats?.period || "Mesozoic Era",
                    era: dino.stats?.period || "Mesozoic Era",
                    diet: dino.stats?.diet || "Specimen",
                    fact: dino.about?.paragraphs?.[0] || dino.hero?.description || `A fascinating ${dino.stats?.diet || ""} dinosaur from the ${dino.stats?.period || "prehistoric"} period.`,
                    image: dino.images?.heroBackground || dino.images?.main || dino.fossil?.image || "",
                    slug: dino.slug,
                    badgeEmoji: dino.stats?.diet?.toLowerCase().includes("carni") ? "🥩" : "🌿",
                    badgeLabel: dino.stats?.diet || "Specimen",
                    accentColor: dino.stats?.diet?.toLowerCase().includes("carni") 
                        ? "from-red-950 via-[#180a06] to-[#250d06]" 
                        : "from-emerald-950 via-[#0a180e] to-[#0a2313]",
                    borderColor: dino.stats?.diet?.toLowerCase().includes("carni") ? "border-red-600/80" : "border-emerald-500/80",
                };
            }
            return dino;
        });

        // Shuffle source list to pick random specimens
        const shuffledList = [...formattedDinos].sort(() => 0.5 - Math.random());
        const selectedDinos = shuffledList.slice(0, pairCount);
        
        // Preload only the images needed for the current game
        const imageUrls = selectedDinos.map(d => d.image).filter(Boolean);
        await Promise.all(
            imageUrls.map(url => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                });
            })
        );

        // Duplicate to create pairs and assign unique card IDs
        const deck = [];
        selectedDinos.forEach((dino) => {
            deck.push({ ...dino, cardUniqueId: `${dino.id}-a` });
            deck.push({ ...dino, cardUniqueId: `${dino.id}-b` });
        });

        // Shuffle deck (Fisher-Yates) after images have loaded
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        setCards(deck);
        setFlippedIndices([]);
        setMatchedIds([]);
        setMoves(0);
        setTimer(0);
        setHintsRemaining(3);
        setUnlockedFacts([]);
        setRecentFact(null);
        setMatchOverlay(null);
        setImageErrors({});
        setIsPreloading(false);
        setGameState("playing");
        playSound("flip", soundEnabled);
    };

    // Timer effect during playing state
    useEffect(() => {
        if (gameState === "playing" && !matchOverlay) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, matchOverlay]);

    // Handle Card Click
    const handleCardClick = (index) => {
        if (gameState !== "playing" || matchOverlay) return;

        // Prevent click if card already flipped or matched or 2 cards already being evaluated
        if (
            flippedIndices.length >= 2 ||
            flippedIndices.includes(index) ||
            matchedIds.includes(cards[index].id)
        ) {
            return;
        }

        playSound("flip", soundEnabled);
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves((prev) => prev + 1);
            const firstCard = cards[newFlipped[0]];
            const secondCard = cards[newFlipped[1]];

            if (firstCard.id === secondCard.id) {
                // Match Found!
                setTimeout(() => {
                    playSound("match", soundEnabled);
                    setMatchOverlay(firstCard);

                    // Automatically dismiss educational match overlay after 2 seconds
                    setTimeout(() => {
                        setMatchOverlay(null);
                    }, 2200);

                    setMatchedIds((prev) => {
                        const updatedMatches = [...prev, firstCard.id];
                        // Check Win Condition
                        if (updatedMatches.length === getPairCount()) {
                            setTimeout(() => {
                                handleWin(updatedMatches.length);
                            }, 2400);
                        }
                        return updatedMatches;
                    });
                    
                    // Add unlocked fact
                    setUnlockedFacts((prev) => {
                        if (!prev.some(f => f.id === firstCard.id)) {
                            setRecentFact(firstCard);
                            setTimeout(() => setRecentFact(null), 4500);
                            return [...prev, firstCard];
                        }
                        return prev;
                    });

                    setFlippedIndices([]);
                }, 400);
            } else {
                // Mismatch
                setTimeout(() => {
                    playSound("mismatch", soundEnabled);
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    // Hint Feature: Briefly reveals an unmatched pair
    const handleUseHint = () => {
        if (hintsRemaining <= 0 || flippedIndices.length > 0 || matchOverlay) return;
        
        // Find an unmatched dinosaur ID
        const unmatchedDino = cards.find(card => !matchedIds.includes(card.id));
        if (!unmatchedDino) return;

        const indicesToReveal = cards
            .map((card, idx) => (card.id === unmatchedDino.id ? idx : -1))
            .filter(idx => idx !== -1);

        if (indicesToReveal.length === 2) {
            setHintsRemaining(prev => prev - 1);
            setFlippedIndices(indicesToReveal);
            playSound("flip", soundEnabled);
            setTimeout(() => {
                setFlippedIndices([]);
            }, 1200);
        }
    };

    // Calculate score formula
    const calculateScore = () => {
        const baseScore = getPairCount() * 250;
        const movePenalty = moves * 15;
        const timePenalty = timer * 3;
        return Math.max(100, baseScore - movePenalty - timePenalty);
    };

    // Handle Win
    const handleWin = () => {
        playSound("win", soundEnabled);
        const finalScore = calculateScore();
        if (finalScore > bestScore) {
            setBestScore(finalScore);
            localStorage.setItem("jurassic_memory_best", finalScore.toString());
        }
        setGameState("gameover");
    };

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="game-page relative min-h-screen font-sans text-slate-100 selection:bg-[#52B788] selection:text-black overflow-x-hidden bg-[#04120b]">
            <Cursor />
            {/* DISTINCT VISIBLE MYSTICAL PREHISTORIC CARDS & JUNGLE RELICS BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
                {/* Background Image - Highly Visible & Vibrant */}
                <img
                    src="/jurassic_memory_match_bg.jpg"
                    alt="Jurassic Memory Match Background"
                    className="h-full w-full object-cover object-center scale-105 filter brightness-85 contrast-115 saturate-110 opacity-85"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />

                {/* Translucent Jungle Emerald & Gold Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#062015]/60 via-[#09291b]/40 to-[#04120b]/75 backdrop-brightness-95" />

                {/* Prehistoric Relic Cards & Jungle Leaves SVG Overlay - Vivid Accent */}
                <svg className="absolute inset-0 w-full h-full opacity-55" xmlns="http://www.w3.org/2000/svg">
                    {/* Floating Mystical Card Outlines */}
                    <g fill="none" stroke="rgba(82, 183, 136, 0.55)" strokeWidth="2.5">
                        <rect x="100" y="120" width="90" height="130" rx="12" transform="rotate(-15 145 185)" fill="rgba(82, 183, 136, 0.1)" />
                        <rect x="220" y="90" width="90" height="130" rx="12" transform="rotate(10 265 155)" fill="rgba(251, 191, 36, 0.1)" stroke="rgba(251, 191, 36, 0.55)" />
                        <rect x="1100" y="150" width="100" height="140" rx="14" transform="rotate(20 1150 220)" fill="rgba(82, 183, 136, 0.1)" />
                        <rect x="980" y="200" width="100" height="140" rx="14" transform="rotate(-10 1030 270)" fill="rgba(251, 191, 36, 0.1)" stroke="rgba(251, 191, 36, 0.55)" />
                    </g>

                    {/* Prehistoric Fern Leaf Motifs */}
                    <g stroke="rgba(82, 183, 136, 0.5)" fill="none" strokeWidth="2.5">
                        <path d="M 0 500 Q 200 450 350 550" />
                        <path d="M 50 490 Q 70 440 110 470" />
                        <path d="M 120 480 Q 150 420 190 460" />
                        <path d="M 190 490 Q 230 430 270 480" />
                        <path d="M 260 510 Q 300 450 330 510" />

                        <path d="M 1400 400 Q 1250 480 1100 420" />
                        <path d="M 1360 410 Q 1330 360 1290 390" />
                        <path d="M 1290 430 Q 1250 370 1220 410" />
                        <path d="M 1210 440 Q 1170 380 1140 430" />
                    </g>

                    {/* Floating Glowing Sparkles / Runes */}
                    <g fill="rgba(251, 191, 36, 0.9)">
                        <circle cx="200" cy="300" r="4" />
                        <circle cx="850" cy="150" r="5" />
                        <circle cx="1050" cy="450" r="4" />
                        <circle cx="450" cy="200" r="4.5" />
                        <polygon points="600,100 604,112 616,112 606,120 610,132 600,124 590,132 594,120 584,112 596,112" fill="rgba(82, 183, 136, 0.85)" />
                    </g>
                </svg>

                {/* Mystical Emerald & Gold Ambient Lighting Layers */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(82,183,136,0.3)_0%,transparent_65%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.2)_0%,transparent_50%)] animate-pulse" />
            </div>

            {/* Navigation Header (only on landing page) */}
            {gameState === "landing" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* Main Content Area */}
            <main className={`relative z-10 mx-auto flex flex-col min-h-screen ${gameState === "landing" ? "pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl" : "p-3 sm:p-6 max-w-[1400px]"}`}>
                
                {isPreloading && (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[450px] text-center space-y-6">
                        <div className="relative flex items-center justify-center">
                            <span className="text-6xl animate-bounce">🦖</span>
                            <div className="absolute w-24 h-24 rounded-full border-4 border-t-[#52B788] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-serif font-black tracking-widest text-[#52B788] uppercase">
                                Preparing Specimen Tiles
                            </h3>
                            <p className="text-xs text-emerald-300 max-w-xs font-semibold uppercase tracking-wider animate-pulse">
                                Preloading high-definition dinosaur scans...
                            </p>
                        </div>
                    </div>
                )}

                {/* LANDING SCREEN */}
                {gameState === "landing" && !isPreloading && (
                    <LandingScreen
                        difficulty={difficulty}
                        setDifficulty={setDifficulty}
                        startNewGame={startNewGame}
                        bestScore={bestScore}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={setSoundEnabled}
                        onBackToHub={onBackToHub}
                    />
                )}

                {/* ACTIVE GAMEPLAY SCREEN */}
                {(gameState === "playing" || gameState === "paused") && !isPreloading && (
                    <Gameplay
                        cards={cards}
                        flippedIndices={flippedIndices}
                        matchedIds={matchedIds}
                        moves={moves}
                        timer={timer}
                        hintsRemaining={hintsRemaining}
                        gameState={gameState}
                        matchOverlay={matchOverlay}
                        recentFact={recentFact}
                        imageErrors={imageErrors}
                        difficulty={difficulty}

                        handleCardClick={handleCardClick}
                        handleUseHint={handleUseHint}

                        calculateScore={calculateScore}
                        formatTime={formatTime}
                        getPairCount={getPairCount}

                        setGameState={setGameState}
                        setImageErrors={setImageErrors}

                        onBackToHub={onBackToHub}
                    />
                )}

                {/* MODALS */}
                <Modals
                    gameState={gameState}
                    setGameState={setGameState}

                    matchOverlay={matchOverlay}

                    timer={timer}
                    moves={moves}

                    difficulty={difficulty}

                    unlockedFacts={unlockedFacts}

                    formatTime={formatTime}
                    calculateScore={calculateScore}

                    startNewGame={startNewGame}
                    setDifficulty={setDifficulty}

                    onBackToHub={onBackToHub}
                />
            </main>
        </div>
    );
}
