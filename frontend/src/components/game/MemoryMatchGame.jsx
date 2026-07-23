import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../home_components/hero/Navbar";
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

// Synthesized Web Audio API sound generator for card flips, matches, and victory
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

        if (type === "flip") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "match") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === "mismatch") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(175, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === "win") {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
                const noteOsc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                noteOsc.connect(noteGain);
                noteOsc.connect(ctx.destination);
                noteOsc.type = "triangle";
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
                noteGain.gain.setValueAtTime(0.22, now + idx * 0.12);
                noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
                noteOsc.start(now + idx * 0.12);
                noteOsc.stop(now + idx * 0.12 + 0.3);
            });
        }
    } catch (e) {
        // Fallback silently if web audio is restricted
    }
};

// Distinct Dinosaurs Deck (10 unique dinosaurs with real public picture assets + custom vector illustrations)
const DINOSAURS_DATA = [
    {
        id: "velociraptor",
        name: "VELOCIRAPTOR",
        tagline: "Swift Hunter",
        era: "Late Cretaceous",
        fact: "Velociraptors possessed a 3-inch curved sickle claw used for precise hunting strikes!",
        image: "/trex1.jpg",
        badgeEmoji: "🦖",
        badgeLabel: "Swift Claw",
        accentColor: "from-amber-950 via-stone-900 to-amber-900",
        borderColor: "border-amber-500/80",
    },
    {
        id: "trex",
        name: "T-REX",
        tagline: "Apex Predator",
        era: "Late Cretaceous",
        fact: "T-Rex had a jaw bite force of 12,000 lbs—powerful enough to crush solid bone!",
        image: "/trex-dino.png",
        badgeEmoji: "👑",
        badgeLabel: "Apex King",
        accentColor: "from-red-950 via-stone-900 to-amber-950",
        borderColor: "border-red-500/80",
    },
    {
        id: "triceratops",
        name: "TRICERATOPS",
        tagline: "Shielded Giant",
        era: "Late Cretaceous",
        fact: "Triceratops possessed up to 800 teeth continuously replacing themselves as they ate!",
        image: "/trissiac-dino.png",
        badgeEmoji: "🛡️",
        badgeLabel: "3-Horn Shield",
        accentColor: "from-emerald-950 via-stone-900 to-emerald-900",
        borderColor: "border-emerald-500/80",
    },
    {
        id: "stegosaurus",
        name: "STEGOSAURUS",
        tagline: "Plated Defender",
        era: "Late Jurassic",
        fact: "Stegosaurus had large dorsal bony plates that helped regulate body temperature!",
        image: "/tyrastego_hybrid.jpg",
        badgeEmoji: "⚔️",
        badgeLabel: "Plated Tail",
        accentColor: "from-stone-900 via-amber-950 to-stone-900",
        borderColor: "border-amber-500/80",
    },
    {
        id: "brachiosaurus",
        name: "BRACHIOSAURUS",
        tagline: "Canopy Feeder",
        era: "Late Jurassic",
        fact: "Brachiosaurus stood over 40 feet tall, allowing it to reach tree leaves untouched by others!",
        image: "/jurassic-dino.png",
        badgeEmoji: "🦕",
        badgeLabel: "High Canopy",
        accentColor: "from-teal-950 via-stone-900 to-teal-900",
        borderColor: "border-teal-400/80",
    },
    {
        id: "spinosaurus",
        name: "SPINOSAURUS",
        tagline: "River Monster",
        era: "Cretaceous",
        fact: "Spinosaurus was the largest known carnivorous dinosaur—even longer than T-Rex!",
        image: "/spinosaurus_skull.jpg",
        badgeEmoji: "🐊",
        badgeLabel: "Sail Fin",
        accentColor: "from-purple-950 via-stone-900 to-slate-900",
        borderColor: "border-purple-500/80",
    },
    {
        id: "pterodactyl",
        name: "PTERODACTYL",
        tagline: "Sky Ruler",
        era: "Jurassic",
        fact: "Pterodactyls had hollow light bones and wings made of skin stretched over elongated fingers!",
        image: "/Trex-skull.jpg",
        badgeEmoji: "🦅",
        badgeLabel: "Sky Wing",
        accentColor: "from-sky-950 via-stone-900 to-slate-900",
        borderColor: "border-sky-400/80",
    },
    {
        id: "ankylosaurus",
        name: "ANKYLOSAURUS",
        tagline: "Living Tank",
        era: "Late Cretaceous",
        fact: "Ankylosaurus was covered in thick armored plates and possessed a heavy bone club tail!",
        image: "/triassic-dino.webp",
        badgeEmoji: "🧱",
        badgeLabel: "Armor Club",
        accentColor: "from-yellow-950 via-stone-900 to-stone-950",
        borderColor: "border-yellow-600/80",
    },
    {
        id: "ammonite",
        name: "AMMONITE",
        tagline: "Prehistoric Shell",
        era: "Mesozoic Era",
        fact: "Ammonites are extinct marine mollusks with distinctive spiral fossil shells!",
        image: "/Trex-teeth.webp",
        badgeEmoji: "🐚",
        badgeLabel: "Spiral Shell",
        accentColor: "from-cyan-950 via-stone-900 to-blue-950",
        borderColor: "border-cyan-400/80",
    },
    {
        id: "parasaurolophus",
        name: "PARASAUR",
        tagline: "Crested Vocalist",
        era: "Late Cretaceous",
        fact: "Parasaurolophus had a long hollow crest on its head used to resonate deep sound calls!",
        image: "/trex2.png",
        badgeEmoji: "🎺",
        badgeLabel: "Hollow Crest",
        accentColor: "from-orange-950 via-stone-900 to-stone-900",
        borderColor: "border-orange-500/80",
    },
];

export default function MemoryMatchGame({ onBackToHub }) {
    // Game States: 'landing' | 'playing' | 'paused' | 'gameover'
    const [gameState, setGameState] = useState("landing");
    const [difficulty, setDifficulty] = useState("medium"); // 'easy' (6 pairs / 12 cards), 'medium' (8 pairs / 16 cards), 'hard' (10 pairs / 20 cards)
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [unlockedFacts, setUnlockedFacts] = useState([]);
    const [recentFact, setRecentFact] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const [bestScore, setBestScore] = useState(() => {
        return parseInt(localStorage.getItem("jurassic_memory_best") || "0", 10);
    });

    const timerRef = useRef(null);

    // Preload background image
    useEffect(() => {
        const bgImg = new Image();
        bgImg.src = "/jurassic_memory_match_bg.jpg";
    }, []);

    // Get number of pairs based on difficulty
    const getPairCount = () => {
        if (difficulty === "easy") return 6;
        if (difficulty === "medium") return 8;
        return 10; // hard (10 pairs / 20 cards)
    };

    // Initialize Game
    const startNewGame = () => {
        const pairCount = getPairCount();
        const selectedDinos = DINOSAURS_DATA.slice(0, pairCount);
        
        // Duplicate to create pairs and assign unique card IDs
        const deck = [];
        selectedDinos.forEach((dino) => {
            deck.push({ ...dino, cardUniqueId: `${dino.id}-a` });
            deck.push({ ...dino, cardUniqueId: `${dino.id}-b` });
        });

        // Shuffle deck (Fisher-Yates)
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
        setImageErrors({});
        setGameState("playing");
        playSound("flip", soundEnabled);
    };

    // Timer effect during playing state
    useEffect(() => {
        if (gameState === "playing") {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    // Handle Card Click
    const handleCardClick = (index) => {
        if (gameState !== "playing") return;

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
                    setMatchedIds((prev) => {
                        const updatedMatches = [...prev, firstCard.id];
                        // Check Win Condition
                        if (updatedMatches.length === getPairCount()) {
                            setTimeout(() => {
                                handleWin(updatedMatches.length);
                            }, 500);
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
        if (hintsRemaining <= 0 || flippedIndices.length > 0) return;
        
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
        <div className="relative min-h-screen font-sans text-slate-900 selection:bg-[#52B788] selection:text-black overflow-x-hidden">
            
            {/* BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/jurassic_memory_match_bg.jpg"
                    alt="Jurassic Memory Match Background"
                    className="h-full w-full object-cover object-center scale-100 filter brightness-100 contrast-105"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                
                {/* Soft ambient golden light overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/40 to-stone-950/70" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#52B788_0%,transparent_70%)] opacity-10" />
            </div>

            {/* Navigation Header (only on landing page) */}
            {gameState === "landing" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* Main Content Area */}
            <main className={`relative z-10 mx-auto flex flex-col min-h-screen ${gameState === "landing" ? "pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl" : "p-3 sm:p-6 max-w-[1400px]"}`}>
                
                {/* LANDING / HERO SCREEN */}
                {gameState === "landing" && (
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
                {(gameState === "playing" || gameState === "paused") && (
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
                {gameState === "gameover" && (
                    <div className="flex-1 flex items-center justify-center py-6">
                        <div className="w-full max-w-2xl bg-[#0f2215]/95 border-2 border-[#52B788] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden text-white">
                            
                            {/* Confetti Glow Background */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-4xl mb-4">
                                🏆
                            </div>

                            <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight">
                                VICTORY UNLOCKED!
                            </h2>
                            <p className="text-sm sm:text-base text-emerald-200 mt-1">
                                You matched all prehistoric dinosaur pairs!
                            </p>

                            {/* Stars Rating */}
                            <div className="flex justify-center gap-2 my-4 text-3xl">
                                <span className="text-amber-400">⭐</span>
                                <span className="text-amber-400">⭐</span>
                                <span className="text-amber-400">⭐</span>
                            </div>

                            {/* Final Stats Summary Grid */}
                            <div className="grid grid-cols-3 gap-3 my-6 bg-[#09150d] p-4 rounded-2xl border border-white/10">
                                <div>
                                    <span className="text-xs text-gray-400 block uppercase font-medium">Time</span>
                                    <span className="text-lg font-bold text-white font-mono">{formatTime(timer)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block uppercase font-medium">Moves</span>
                                    <span className="text-lg font-bold text-amber-300 font-mono">{moves}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block uppercase font-medium">Score</span>
                                    <span className="text-lg font-bold text-emerald-400 font-mono">{calculateScore()}</span>
                                </div>
                            </div>

                            {/* Unlocked Dinosaur Trivia Gallery */}
                            {unlockedFacts.length > 0 && (
                                <div className="text-left mb-6">
                                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                                        <BookOpen size={16} />
                                        <span>Unlocked Prehistoric Facts ({unlockedFacts.length})</span>
                                    </h3>
                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                        {unlockedFacts.map((dino) => (
                                            <div key={dino.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-3">
                                                <span className="text-xl">🦕</span>
                                                <div>
                                                    <h4 className="text-xs font-bold text-white">{dino.name} ({dino.era})</h4>
                                                    <p className="text-xs text-gray-300 mt-0.5">{dino.fact}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                <button
                                    onClick={startNewGame}
                                    className="flex items-center gap-2 bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-105 cursor-pointer"
                                >
                                    <RotateCcw size={18} />
                                    <span>Play Again</span>
                                </button>
                                <Link
                                    to="/quiz"
                                    className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all"
                                >
                                    <span>Take a Quiz</span>
                                    <ChevronRight size={18} />
                                </Link>
                            </div>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
