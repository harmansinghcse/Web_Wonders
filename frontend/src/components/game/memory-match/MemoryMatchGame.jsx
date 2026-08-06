import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../home_components/hero/Navbar";
import Cursor from "../common/Cursor";
import { getExplorerDinosaurs } from "../../../services/explorerService";
import { DINOSAURS_DATA, playSound } from "./constants";
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

                {/* LANDING / HERO SCREEN */}
                {gameState === "landing" && !isPreloading && (
                    <div className="flex-1 flex flex-col justify-between pt-2">
                        
                        {/* Top Back Nav Button if coming from Hub */}
                        {onBackToHub && (
                            <button
                                onClick={onBackToHub}
                                className="inline-flex items-center gap-2 self-start bg-white/80 hover:bg-white text-[#1b3827] px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all mb-4 backdrop-blur-md cursor-pointer"
                            >
                                <ArrowLeft size={16} />
                                <span>Back to Game Hub</span>
                            </button>
                        )}

                        {/* Hero Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
                            
                            {/* Left Column: Text & Start Action */}
                            <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left z-10">
                                
                                {/* Jurassic Silhouette Brand Header */}
                                <div className="flex items-center gap-2.5 bg-[#1b3827]/80 border border-[#52B788]/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                                    <div className="w-5 h-5 rounded-full bg-[#52B788] flex items-center justify-center text-slate-950 font-bold text-xs">
                                        🦖
                                    </div>
                                    <span className="text-xs sm:text-sm font-serif tracking-widest text-[#52B788] uppercase font-extrabold">
                                        JURASSIC WORLD MATCH
                                    </span>
                                </div>

                                {/* Main Title */}
                                <div className="space-y-0.5">
                                    <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black font-serif tracking-tight text-white drop-shadow-lg leading-none">
                                        JURASSIC
                                    </h1>
                                    <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black font-serif tracking-tight text-[#52B788] drop-shadow-lg leading-none">
                                        MEMORY MATCH
                                    </h1>
                                </div>

                                {/* Subtitle Text */}
                                <p className="text-base sm:text-xl text-emerald-100 max-w-xl font-medium leading-relaxed drop-shadow">
                                    Flip the cards. Match the dinosaurs. <br />
                                    Test your memory. Explore the Jurassic world.
                                </p>

                                {/* Difficulty Selector */}
                                <div className="w-full max-w-md bg-[#132317]/90 border border-[#2b4c34] p-4 rounded-2xl backdrop-blur-md shadow-xl text-white">
                                    <p className="text-xs font-bold text-[#52B788] uppercase tracking-wider mb-2.5">
                                        SELECT DIFFICULTY
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: "easy", name: "Easy", cards: "12 Cards" },
                                            { id: "medium", name: "Medium", cards: "16 Cards" },
                                            { id: "hard", name: "Hard", cards: "20 Cards" },
                                        ].map((diff) => (
                                            <button
                                                key={diff.id}
                                                onClick={() => setDifficulty(diff.id)}
                                                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center cursor-pointer ${
                                                    difficulty === diff.id
                                                        ? "bg-[#52B788] text-slate-950 shadow-lg scale-105"
                                                        : "bg-white/10 text-emerald-200 hover:bg-white/20"
                                                }`}
                                            >
                                                <span>{diff.name}</span>
                                                <span className="text-[10px] opacity-80">{diff.cards}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Controls & Audio toggle */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={startNewGame}
                                        className="group inline-flex items-center justify-center gap-3 bg-[#52B788] hover:bg-[#66d29f] text-slate-950 px-10 py-4 rounded-2xl font-black text-base tracking-widest uppercase shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                                    >
                                        <Play size={22} className="fill-current text-slate-950 group-hover:scale-110 transition-transform" />
                                        <span>START GAME</span>
                                        {bestScore > 0 && (
                                            <span className="ml-2 text-xs bg-slate-950/20 px-2.5 py-1 rounded-full text-slate-900 border border-slate-950/20 font-bold">
                                                Best: {bestScore}
                                            </span>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className="p-4 rounded-2xl bg-[#132317]/90 border border-[#2b4c34] text-emerald-300 hover:bg-white/10 shadow-xl transition-all cursor-pointer"
                                        title={soundEnabled ? "Mute Audio" : "Enable Audio"}
                                    >
                                        {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                                    </button>
                                </div>

                            </div>

                            {/* Right Column: Featured Dino Artwork Card Stack */}
                            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px] lg:min-h-[460px]">
                                <div className="relative w-72 h-96 rounded-3xl bg-gradient-to-b from-[#2b251b] via-[#1c1811] to-[#0d0b08] border-4 border-[#8a7b63] p-4 shadow-2xl flex flex-col items-center justify-between rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full flex items-center justify-between text-amber-300 font-serif text-xs font-bold">
                                        <span>APEX PREDATOR</span>
                                        <span>★ ★ ★ ★ ★</span>
                                    </div>
                                    <div className="w-52 h-52 rounded-2xl border border-amber-500/30 bg-[#16120c] flex items-center justify-center shadow-inner overflow-hidden my-auto p-2">
                                        <img 
                                            src="/trex-dino.png" 
                                            alt="T-Rex Preview"
                                            className="w-full h-full object-contain filter drop-shadow-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden flex-col items-center justify-center text-amber-300">
                                            <span className="text-6xl">👑</span>
                                            <span className="text-xs font-bold mt-2">TYRANNOSAURUS</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#1b1711] py-2 px-3 rounded-xl border border-amber-500/20 text-center">
                                        <p className="text-sm font-serif font-black text-amber-200">TYRANNOSAURUS REX</p>
                                        <p className="text-[10px] text-amber-400/80">Late Cretaceous • 12,000 lbs Bite Force</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info Parchment Cards Banner */}
                        <div className="mt-8 mb-4 w-full bg-[#142418]/90 text-[#e4dac6] rounded-3xl p-6 shadow-2xl border border-[#2b4c34] backdrop-blur-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#2b4c34]">
                                
                                {/* Feature 1: MATCH CARDS */}
                                <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#52B788]/40 flex items-center justify-center bg-[#0c1810]">
                                        <RotateCcw size={26} className="text-[#52B788]" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-white">
                                            MATCH CARDS
                                        </h3>
                                        <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                                            Find all matching dinosaur pairs
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2: EARN POINTS */}
                                <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#52B788]/40 flex items-center justify-center bg-[#0c1810]">
                                        <Award size={26} className="text-[#52B788]" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-white">
                                            EARN POINTS
                                        </h3>
                                        <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                                            The faster you match, the higher your score
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3: UNLOCK FACTS */}
                                <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#52B788]/40 flex items-center justify-center bg-[#0c1810]">
                                        <BookOpen size={26} className="text-[#52B788]" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-white">
                                            UNLOCK FACTS
                                        </h3>
                                        <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                                            Discover amazing facts about dinosaurs
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* ACTIVE GAMEPLAY SCREEN */}
                {(gameState === "playing" || gameState === "paused") && !isPreloading && (
                    <div className="flex-1 flex flex-col space-y-4">
                        
                        {/* Top HUD Header Bar */}
                        <div className="w-full bg-[#182a1d]/95 border border-[#2b4c34] rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md flex items-center justify-between text-[#e4dac6]">
                            
                            {/* Left: Back Arrow + Title */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (onBackToHub) {
                                            onBackToHub();
                                        } else {
                                            setGameState("landing");
                                        }
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#e4dac6] transition-all cursor-pointer"
                                    title="Exit Game"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <h2 className="text-sm sm:text-base font-serif font-bold tracking-wider text-[#e4dac6] uppercase">
                                    JURASSIC MEMORY MATCH
                                </h2>
                            </div>

                            {/* Center/Right Stats HUD Badges */}
                            <div className="flex items-center gap-3 sm:gap-6">
                                
                                {/* TIME */}
                                <div className="flex items-center gap-2 bg-[#0c1810]/80 border border-[#2b4c34] px-3.5 py-1.5 rounded-xl shadow-inner">
                                    <Clock size={18} className="text-[#52B788]" />
                                    <div className="flex flex-col text-left leading-none">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">TIME</span>
                                        <span className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">
                                            {formatTime(timer)}
                                        </span>
                                    </div>
                                </div>

                                {/* MOVES */}
                                <div className="flex items-center gap-2 bg-[#0c1810]/80 border border-[#2b4c34] px-3.5 py-1.5 rounded-xl shadow-inner">
                                    <span className="text-lg">🐾</span>
                                    <div className="flex flex-col text-left leading-none">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">MOVES</span>
                                        <span className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">
                                            {moves}
                                        </span>
                                    </div>
                                </div>

                                {/* SCORE */}
                                <div className="flex items-center gap-2 bg-[#0c1810]/80 border border-[#2b4c34] px-3.5 py-1.5 rounded-xl shadow-inner">
                                    <Star size={18} className="text-amber-400 fill-amber-400" />
                                    <div className="flex flex-col text-left leading-none">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">SCORE</span>
                                        <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 mt-0.5">
                                            {calculateScore()}
                                        </span>
                                    </div>
                                </div>

                                {/* Menu / Pause Button */}
                                <button
                                    onClick={() => setGameState(gameState === "paused" ? "playing" : "paused")}
                                    className="p-2 rounded-xl bg-[#0c1810]/80 border border-[#2b4c34] text-[#e4dac6] hover:bg-white/10 transition-all cursor-pointer"
                                    title="Menu / Pause"
                                >
                                    <MenuIcon size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Unlocked Fact Toast Popup */}
                        {recentFact && (
                            <div className="w-full max-w-xl mx-auto bg-gradient-to-r from-emerald-950/95 via-[#132c1c]/95 to-emerald-950/95 border border-[#52B788]/70 text-emerald-100 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-pulse">
                                <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                                <div className="text-left">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                                        🦕 Fact Unlocked: {recentFact.name}
                                    </span>
                                    <p className="text-xs font-medium mt-0.5 text-slate-200">
                                        {recentFact.fact}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Main Playing Stage */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
                            
                            {/* LEFT / CENTER: CARD MEMORY GRID */}
                            <div className="lg:col-span-9 bg-[#122317]/85 border border-[#274630] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md min-h-[460px] flex items-center justify-center">
                                <div
                                    className={`w-full grid gap-3.5 ${
                                        getPairCount() <= 6
                                            ? "grid-cols-3 sm:grid-cols-4"
                                            : getPairCount() <= 8
                                            ? "grid-cols-4 sm:grid-cols-4"
                                            : "grid-cols-4 sm:grid-cols-5"
                                    }`}
                                >
                                    {cards.map((card, index) => {
                                        const isFlipped = flippedIndices.includes(index);
                                        const isMatched = matchedIds.includes(card.id);
                                        const isImageFailed = imageErrors[card.cardUniqueId];
                                        const isFaceUp = isFlipped || isMatched;

                                        return (
                                            <div
                                                key={card.cardUniqueId}
                                                onClick={() => handleCardClick(index)}
                                                className="h-32 sm:h-40 xl:h-44 cursor-pointer select-none"
                                                style={{ perspective: "1000px" }}
                                            >
                                                <div
                                                    className="relative w-full h-full transition-transform duration-500 ease-out"
                                                    style={{
                                                        transformStyle: "preserve-3d",
                                                        WebkitTransformStyle: "preserve-3d",
                                                        transform: isFaceUp ? "rotateY(180deg)" : "rotateY(0deg)",
                                                        WebkitTransform: isFaceUp ? "rotateY(180deg)" : "rotateY(0deg)",
                                                    }}
                                                >
                                                    {/* CARD BACK (Stone slab with footprint) */}
                                                    <div 
                                                        className={`absolute inset-0 rounded-2xl border-2 border-[#5a4f3d] bg-[#3a3327] bg-[radial-gradient(ellipse_at_center,#4a4233_0%,#2b251b_100%)] shadow-2xl flex flex-col items-center justify-center p-2 hover:border-amber-400 transition-all border-b-4 border-r-4 border-stone-900 ${
                                                            isFaceUp ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                                                        }`}
                                                        style={{
                                                            backfaceVisibility: "hidden",
                                                            WebkitBackfaceVisibility: "hidden",
                                                            transform: "rotateY(0deg)",
                                                            WebkitTransform: "rotateY(0deg)",
                                                            zIndex: isFaceUp ? 0 : 10,
                                                        }}
                                                    >
                                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-[#6b5c46]/40 bg-[#251f16]/80 flex flex-col items-center justify-center shadow-inner">
                                                            <span className="text-2xl sm:text-3xl filter brightness-95 opacity-85 transform -rotate-12">
                                                                🐾
                                                            </span>
                                                            <span className="text-[9px] font-serif font-extrabold text-amber-200/60 uppercase tracking-widest mt-0.5">
                                                                DINO
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* CARD FRONT (Dinosaur picture & details) */}
                                                    <div
                                                        className={`absolute inset-0 rounded-2xl border-2 ${
                                                            isMatched
                                                                ? "border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.7)]"
                                                                : card.borderColor
                                                        } bg-gradient-to-b ${card.accentColor} p-2 flex flex-col justify-between overflow-hidden shadow-2xl text-white ${
                                                            isFaceUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                                        }`}
                                                        style={{
                                                            backfaceVisibility: "hidden",
                                                            WebkitBackfaceVisibility: "hidden",
                                                            transform: "rotateY(180deg)",
                                                            WebkitTransform: "rotateY(180deg)",
                                                            zIndex: isFaceUp ? 20 : 0,
                                                        }}
                                                    >
                                                        {/* Species Category Header Tag */}
                                                        <div className="w-full flex items-center justify-between text-[9px] font-bold text-amber-300 uppercase tracking-wider px-1">
                                                            <span className="truncate">{card.tagline}</span>
                                                            <span>{card.badgeEmoji}</span>
                                                        </div>

                                                        {/* Dinosaur Image Portrait */}
                                                        <div className="flex-1 flex items-center justify-center overflow-hidden my-1 relative">
                                                            {!isImageFailed ? (
                                                                <img
                                                                    src={card.image}
                                                                    alt={card.name}
                                                                    className="max-h-24 sm:max-h-28 w-auto object-contain filter drop-shadow-xl transition-transform hover:scale-110"
                                                                    onError={() => {
                                                                        setImageErrors(prev => ({ ...prev, [card.cardUniqueId]: true }));
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center text-center p-2">
                                                                    <span className="text-4xl sm:text-5xl filter drop-shadow-lg mb-1 animate-pulse">
                                                                        {card.badgeEmoji}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                                                                        {card.badgeLabel}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Species Tag Banner at Bottom */}
                                                        <div className="w-full bg-[#0c0a07]/90 border-t border-[#6b5c46]/40 py-1 text-center rounded-b-xl">
                                                            <p className="text-[10px] sm:text-xs font-serif font-black tracking-wider text-amber-200 uppercase truncate px-1">
                                                                {card.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* RIGHT SIDEBAR PANEL */}
                            <div className="lg:col-span-3 bg-[#14261a]/95 border border-[#2b4c34] rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-6 text-[#e4dac6] text-left">
                                
                                {/* Section 1: HOW TO PLAY */}
                                <div className="space-y-2 border-b border-[#2b4c34] pb-5">
                                    <h3 className="text-xs sm:text-sm font-serif font-bold tracking-widest text-[#e4dac6] uppercase">
                                        HOW TO PLAY
                                    </h3>
                                    <div className="text-xs text-[#a9bcae] space-y-1 font-medium leading-relaxed">
                                        <p>Flip two cards.</p>
                                        <p>Match all pairs</p>
                                        <p>before time runs out!</p>
                                    </div>
                                </div>

                                {/* Section 2: PROGRESS */}
                                <div className="space-y-3 border-b border-[#2b4c34] pb-5">
                                    <h3 className="text-xs sm:text-sm font-serif font-bold tracking-widest text-[#e4dac6] uppercase">
                                        PROGRESS
                                    </h3>
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-[#a9bcae]">Pairs Found</span>
                                        <span className="text-sm font-mono font-bold text-white flex items-center gap-1">
                                            <span className="text-emerald-400">➔</span>
                                            {matchedIds.length} / {getPairCount()}
                                        </span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full h-2.5 rounded-full bg-[#0c1810] overflow-hidden border border-white/10">
                                        <div 
                                            className="h-full bg-[#52B788] transition-all duration-300 rounded-full"
                                            style={{ width: `${(matchedIds.length / getPairCount()) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Section 3: ACTION BUTTONS */}
                                <div className="space-y-3 pt-2">
                                    {/* HINT Button */}
                                    <button
                                        onClick={handleUseHint}
                                        disabled={hintsRemaining <= 0}
                                        className={`w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-extrabold tracking-wider uppercase transition-all shadow-md ${
                                            hintsRemaining > 0
                                                ? "bg-[#253d2d] hover:bg-[#31523c] border-[#52B788]/40 text-white cursor-pointer"
                                                : "bg-[#142017] border-gray-700 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        <Lightbulb size={16} className="text-amber-300" />
                                        <span>HINT</span>
                                        {hintsRemaining > 0 && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md">
                                                {hintsRemaining}
                                            </span>
                                        )}
                                    </button>

                                    {/* PAUSE Button */}
                                    <button
                                        onClick={() => setGameState(gameState === "paused" ? "playing" : "paused")}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#253d2d] hover:bg-[#31523c] border border-[#52B788]/40 text-white text-xs font-extrabold tracking-wider uppercase transition-all shadow-md cursor-pointer"
                                    >
                                        <Pause size={16} />
                                        <span>{gameState === "paused" ? "RESUME" : "PAUSE"}</span>
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                )}

                {/* PAUSE MODAL OVERLAY */}
                {gameState === "paused" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="w-full max-w-sm bg-[#122317] border border-[#52B788] rounded-3xl p-6 shadow-2xl text-center space-y-4">
                            <h3 className="text-2xl font-serif font-bold text-white">GAME PAUSED</h3>
                            <p className="text-xs text-gray-300">Take a breather, Jurassic Explorer!</p>
                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    onClick={() => setGameState("playing")}
                                    className="w-full py-3 rounded-xl bg-[#52B788] text-slate-950 font-bold text-sm uppercase tracking-wider hover:bg-[#64cca2] transition-all cursor-pointer"
                                >
                                    Resume Game
                                </button>
                                <button
                                    onClick={() => setGameState("landing")}
                                    className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer"
                                >
                                    Exit to Title
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* GAME OVER / VICTORY MODAL */}
                {gameState === "gameover" && !isPreloading && (
                    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-4 flex items-center justify-center min-h-screen bg-black/85 backdrop-blur-md custom-scrollbar">
                        <div className="w-full max-w-lg bg-gradient-to-b from-[#14261a] to-[#0b160f] border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(82,183,136,0.3)] text-center relative text-white space-y-4 my-auto overflow-hidden">
                            
                            {/* Confetti Glow Background */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-2xl mx-auto shadow-inner animate-bounce">
                                🏆
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#52B788] tracking-tight uppercase drop-shadow">
                                    LEVEL COMPLETE!
                                </h2>
                                <p className="text-xs sm:text-sm text-emerald-200/90 font-medium italic">
                                    Excellent matching! You mastered all prehistoric dinosaur pairs.
                                </p>
                            </div>

                            {/* Stars Rating */}
                            <div className="flex justify-center gap-1.5 text-2xl">
                                <span className="text-amber-400">⭐</span>
                                <span className="text-amber-400">⭐</span>
                                <span className="text-amber-400">⭐</span>
                            </div>

                            {/* Final Stats Summary Grid */}
                            <div className="grid grid-cols-3 gap-3 bg-[#071109] p-4 rounded-2xl border border-emerald-500/30 shadow-inner">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    <span className="text-xs text-gray-400 block uppercase font-bold">Time</span>
                                    <span className="text-xl font-bold text-white font-mono">{formatTime(timer)}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    <span className="text-xs text-gray-400 block uppercase font-bold">Moves</span>
                                    <span className="text-xl font-bold text-amber-300 font-mono">{moves}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    <span className="text-xs text-gray-400 block uppercase font-bold">Score</span>
                                    <span className="text-xl font-bold text-emerald-400 font-mono">{calculateScore()}</span>
                                </div>
                            </div>

                            {/* Unlocked Dinosaur Trivia Gallery */}
                            {unlockedFacts.length > 0 && (
                                <div className="text-left">
                                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                                        <BookOpen size={16} />
                                        <span>Unlocked Prehistoric Facts ({unlockedFacts.length})</span>
                                    </h3>
                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                        {unlockedFacts.map((dino) => (
                                            <div key={dino.id} className="bg-[#0b1b11] border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
                                                {dino.image ? (
                                                    <img
                                                        src={dino.image}
                                                        alt={dino.name}
                                                        className="w-12 h-12 rounded-lg object-cover border border-emerald-500/25 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-emerald-950 flex items-center justify-center text-xl border border-emerald-500/25 shrink-0">
                                                        🦕
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold text-white truncate">{dino.name} ({dino.era})</h4>
                                                    <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-2">{dino.fact}</p>
                                                    {dino.slug && (
                                                        <Link
                                                            to={`/dinosaur/${dino.slug}`}
                                                            className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-[#52B788] hover:underline uppercase tracking-wider"
                                                        >
                                                            <span>Learn More</span>
                                                            <span>➔</span>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons Grid */}
                            <div className="space-y-3 pt-2">
                                {/* Primary Highlighted Button: NEXT LEVEL */}
                                <button
                                    onClick={() => {
                                        if (difficulty === "easy") {
                                            setDifficulty("moderate");
                                            setTimeout(() => startNewGame(), 100);
                                        } else if (difficulty === "moderate") {
                                            setDifficulty("hard");
                                            setTimeout(() => startNewGame(), 100);
                                        } else {
                                            startNewGame();
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
                                        onClick={startNewGame}
                                        className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                                    >
                                        <RotateCcw size={16} />
                                        <span>TRY AGAIN</span>
                                    </button>

                                    {/* Secondary Button: GAME CENTER */}
                                    <button
                                        onClick={() => {
                                            if (onBackToHub) {
                                                onBackToHub();
                                            } else {
                                                setGameState("landing");
                                            }
                                        }}
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

                {/* EDUCATIONAL MATCH OVERLAY */}
                {matchOverlay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="bg-[#122317] border-2 border-[#52B788] rounded-3xl p-6 shadow-2xl text-center space-y-4 max-w-sm w-full animate-in zoom-in-95 duration-200">
                            <span className="text-sm font-bold text-[#52B788] uppercase tracking-wider block">🎉 Match Unlocked! 🎉</span>
                            {matchOverlay.image ? (
                                <img
                                    src={matchOverlay.image}
                                    alt={matchOverlay.name}
                                    className="w-24 h-24 rounded-2xl object-cover border border-[#52B788]/30 mx-auto shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-emerald-950 flex items-center justify-center text-4xl border border-[#52B788]/30 mx-auto shadow-lg">
                                    🦕
                                </div>
                            )}
                            <h3 className="text-2xl font-serif font-black text-amber-300">{matchOverlay.name}</h3>
                            <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">{matchOverlay.era} • {matchOverlay.diet}</p>
                            <p className="text-xs text-slate-300 leading-relaxed italic bg-emerald-950/45 p-3 rounded-xl border border-[#2b4c34]/45">
                                "{matchOverlay.fact}"
                            </p>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
