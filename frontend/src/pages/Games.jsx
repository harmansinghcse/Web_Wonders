import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/home_components/hero/Navbar";
import { 
    Play, 
    RotateCcw, 
    Trophy, 
    Clock, 
    Sparkles, 
    Award, 
    BookOpen, 
    Volume2, 
    VolumeX, 
    ArrowLeft,
    CheckCircle2,
    Zap,
    ChevronRight,
    Gamepad2,
    Crown
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
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "match") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === "mismatch") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(180, now + 0.1);
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

// Dinosaurs deck definition
const DINOSAURS_DATA = [
    {
        id: "trex",
        name: "Tyrannosaurus Rex",
        tagline: "Apex Predator",
        era: "Late Cretaceous",
        fact: "T-Rex had a jaw bite force of 12,000 lbs—powerful enough to crush solid bone!",
        image: "/trex-dino.png",
        color: "from-[#2a1d13]/90 to-[#120a06]/95",
        borderColor: "border-amber-600/50",
    },
    {
        id: "velociraptor",
        name: "Velociraptor",
        tagline: "Swift Hunter",
        era: "Late Cretaceous",
        fact: "Velociraptors possessed a 3-inch curved sickle claw used for precise hunting strikes!",
        image: "/baby-raptor.png",
        color: "from-[#132c1c]/90 to-[#07130b]/95",
        borderColor: "border-emerald-600/50",
    },
    {
        id: "triceratops",
        name: "Triceratops",
        tagline: "Shielded Giant",
        era: "Late Cretaceous",
        fact: "Triceratops possessed up to 800 teeth continuously replacing themselves as they ate!",
        image: "/trissiac-dino.png",
        color: "from-[#27231c]/90 to-[#0e0c0a]/95",
        borderColor: "border-stone-500/50",
    },
    {
        id: "stegosaurus",
        name: "Stegosaurus",
        tagline: "Plated Defender",
        era: "Late Jurassic",
        fact: "Stegosaurus had large dorsal bony plates that helped regulate body temperature!",
        image: "/tyrastego_hybrid.jpg",
        color: "from-[#223315]/90 to-[#0a1205]/95",
        borderColor: "border-lime-600/50",
    },
    {
        id: "brachiosaurus",
        name: "Brachiosaurus",
        tagline: "Canopy Feeder",
        era: "Late Jurassic",
        fact: "Brachiosaurus stood over 40 feet tall, allowing it to reach tree leaves untouched by others!",
        image: "/jurassic-dino.png",
        color: "from-[#122e2b]/90 to-[#051413]/95",
        borderColor: "border-teal-600/50",
    },
    {
        id: "spinosaurus",
        name: "Spinosaurus",
        tagline: "River Monster",
        era: "Cretaceous",
        fact: "Spinosaurus was the largest known carnivorous dinosaur—even longer than T-Rex!",
        image: "/spinosaurus_skull.jpg",
        color: "from-[#0e2c36]/90 to-[#041217]/95",
        borderColor: "border-cyan-600/50",
    },
    {
        id: "pterodactyl",
        name: "Pterodactyl",
        tagline: "Sky Ruler",
        era: "Jurassic",
        fact: "Pterodactyls had hollow light bones and wings made of skin stretched over elongated fingers!",
        image: "/fossil-skull.png",
        color: "from-[#122b3b]/90 to-[#051118]/95",
        borderColor: "border-sky-600/50",
    },
    {
        id: "ankylosaurus",
        name: "Ankylosaurus",
        tagline: "Living Tank",
        era: "Late Cretaceous",
        fact: "Ankylosaurus was covered in thick armored plates and possessed a heavy bone club tail!",
        image: "/baby-dino.png",
        color: "from-[#332213]/90 to-[#120904]/95",
        borderColor: "border-orange-600/50",
    },
];

export default function Games() {
    // Game States: 'landing' | 'playing' | 'gameover'
    const [gameState, setGameState] = useState("landing");
    const [difficulty, setDifficulty] = useState("medium"); // 'easy' (4 pairs), 'medium' (6 pairs), 'hard' (8 pairs)
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [unlockedFacts, setUnlockedFacts] = useState([]);
    const [recentFact, setRecentFact] = useState(null);
    const [bestScore, setBestScore] = useState(() => {
        return parseInt(localStorage.getItem("jurassic_memory_best") || "0", 10);
    });

    const timerRef = useRef(null);

    // Get number of pairs based on difficulty
    const getPairCount = () => {
        if (difficulty === "easy") return 4;
        if (difficulty === "hard") return 8;
        return 6; // medium
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
        setUnlockedFacts([]);
        setRecentFact(null);
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
                    if (!unlockedFacts.some(f => f.id === firstCard.id)) {
                        setUnlockedFacts((prev) => [...prev, firstCard]);
                        setRecentFact(firstCard);
                        setTimeout(() => setRecentFact(null), 4500);
                    }

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

    // Calculate score formula
    const calculateScore = () => {
        const baseScore = getPairCount() * 250;
        const movePenalty = moves * 15;
        const timePenalty = timer * 4;
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
            
            {/* EXACT IMAGE 2 COMPOSITION WITH FRONT PAGE GOLDEN SUNSET COLOR CONTRAST */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/jurassic_memory_match_bg.jpg"
                    alt="Jurassic Memory Match Background"
                    className="h-full w-full object-cover object-center scale-100 filter brightness-100 contrast-105"
                />
                
                {/* Soft ambient golden light overlay matching Front Page (Image 3) */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/35 via-stone-900/10 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,#FFFFFF_0%,transparent_40%)] opacity-35" />
            </div>

            {/* Navigation Header */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-7rem)]">
                
                {/* LANDING / HERO SCREEN (Exact Layout of Image 2) */}
                {gameState === "landing" && (
                    <div className="flex-1 flex flex-col justify-between pt-2">
                        
                        {/* Hero Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
                            
                            {/* Left Column: Text & Start Action */}
                            <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left z-10">
                                
                                {/* Jurassic Silhouette Brand Header (Image 2 Top Left) */}
                                <div className="flex items-center gap-2.5 bg-[#1b3827]/15 border border-[#1b3827]/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                                    <div className="w-5 h-5 rounded-full bg-[#1b3827] flex items-center justify-center text-amber-100 font-bold text-xs">
                                        🦖
                                    </div>
                                    <span className="text-xs sm:text-sm font-serif tracking-widest text-[#1b3827] uppercase font-extrabold">
                                        JURASSIC WORLD 3
                                    </span>
                                </div>

                                {/* Main Title (Image 2 exact typography) */}
                                <div className="space-y-0.5">
                                    <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black font-serif tracking-tight text-[#1c3826] drop-shadow-sm leading-none">
                                        JURASSIC
                                    </h1>
                                    <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black font-serif tracking-tight text-[#22442f] drop-shadow-sm leading-none">
                                        MEMORY MATCH
                                    </h1>
                                </div>

                                {/* Subtitle Text (Exact 2 lines from Image 2) */}
                                <p className="text-base sm:text-xl text-[#2a4734] max-w-xl font-semibold leading-relaxed">
                                    Flip the cards. Match the dinosaurs. <br />
                                    Test your memory. Explore the Jurassic world.
                                </p>

                                {/* Difficulty Selector */}
                                <div className="w-full max-w-md bg-[#ffffff]/80 border border-[#c5b9a4] p-3 rounded-2xl backdrop-blur-md shadow-md">
                                    <p className="text-xs font-bold text-[#1b3827] uppercase tracking-wider mb-2">
                                        Select Difficulty
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: "easy", name: "Easy", cards: "8 Cards" },
                                            { id: "medium", name: "Medium", cards: "12 Cards" },
                                            { id: "hard", name: "Hard", cards: "16 Cards" },
                                        ].map((diff) => (
                                            <button
                                                key={diff.id}
                                                onClick={() => setDifficulty(diff.id)}
                                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center ${
                                                    difficulty === diff.id
                                                        ? "bg-[#1c3827] text-white shadow-md scale-105"
                                                        : "bg-white/60 text-[#1b3827] hover:bg-white"
                                                }`}
                                            >
                                                <span>{diff.name}</span>
                                                <span className="text-[10px] opacity-80">{diff.cards}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* START GAME Button (Image 2 style) */}
                                <button
                                    onClick={startNewGame}
                                    className="group inline-flex items-center justify-center gap-3 bg-[#1c3827] hover:bg-[#284f38] text-white px-10 py-4 rounded-2xl font-bold text-base tracking-widest uppercase shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    <Play size={20} className="fill-current text-[#52B788] group-hover:scale-110 transition-transform" />
                                    <span>START GAME</span>
                                    {bestScore > 0 && (
                                        <span className="ml-2 text-xs bg-white/20 px-2.5 py-1 rounded-full text-amber-200 border border-white/20">
                                            Best: {bestScore}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Right Column: T-Rex integrated into misty background artwork (Image 2) */}
                            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px] lg:min-h-[460px]">
                                {/* Empty container so background artwork T-Rex is clearly visible */}
                            </div>
                        </div>

                        {/* Bottom Info Parchment Cards Banner (Exact Image 2 layout) */}
                        <div className="mt-8 mb-4 w-full bg-[#ede5d8]/95 text-[#2b271d] rounded-3xl p-6 shadow-2xl border border-[#d4c6b1] backdrop-blur-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#d0c2ac]">
                                
                                {/* Feature 1: MATCH CARDS */}
                                <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border-2 border-[#544d3b] flex items-center justify-center bg-[#e3d7c4]">
                                        <RotateCcw size={26} className="text-[#1b3827]" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-[#1b3827]">
                                            MATCH CARDS
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#5c5545] mt-0.5">
                                            Find all matching dinosaur pairs
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2: EARN POINTS */}
                                <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border-2 border-[#544d3b] flex items-center justify-center bg-[#e3d7c4]">
                                        <Award size={26} className="text-[#1b3827]" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-[#1b3827]">
                                            EARN POINTS
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#5c5545] mt-0.5">
                                            The faster you match, the higher your score
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3: UNLOCK FACTS */}
                                <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border-2 border-[#544d3b] flex items-center justify-center bg-[#e3d7c4]">
                                        <BookOpen size={26} className="text-[#1b3827]" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-[#1b3827]">
                                            UNLOCK FACTS
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#5c5545] mt-0.5">
                                            Discover amazing facts about dinosaurs
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* PLAYING GAMEPLAY ARENA */}
                {gameState === "playing" && (
                    <div className="flex-1 flex flex-col items-center">
                        
                        {/* Control Bar Header */}
                        <div className="w-full max-w-4xl bg-[#102216]/95 border border-[#385c42]/70 rounded-2xl p-4 mb-6 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4 text-white">
                            
                            {/* Exit Button */}
                            <button
                                onClick={() => setGameState("landing")}
                                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-all"
                            >
                                <ArrowLeft size={16} />
                                <span>Exit</span>
                            </button>

                            {/* Stat Badges */}
                            <div className="flex items-center gap-4 sm:gap-6">
                                {/* Timer */}
                                <div className="flex items-center gap-2 bg-[#0a150d] border border-white/10 px-3 py-1.5 rounded-xl">
                                    <Clock size={16} className="text-[#52B788]" />
                                    <span className="text-xs font-medium text-gray-300">Time:</span>
                                    <span className="text-sm font-bold text-white font-mono">{formatTime(timer)}</span>
                                </div>

                                {/* Moves */}
                                <div className="flex items-center gap-2 bg-[#0a150d] border border-white/10 px-3 py-1.5 rounded-xl">
                                    <Zap size={16} className="text-amber-400" />
                                    <span className="text-xs font-medium text-gray-300">Moves:</span>
                                    <span className="text-sm font-bold text-white font-mono">{moves}</span>
                                </div>

                                {/* Pairs Matched */}
                                <div className="flex items-center gap-2 bg-[#0a150d] border border-white/10 px-3 py-1.5 rounded-xl">
                                    <Trophy size={16} className="text-emerald-400" />
                                    <span className="text-xs font-medium text-gray-300">Matched:</span>
                                    <span className="text-sm font-bold text-emerald-400 font-mono">
                                        {matchedIds.length} / {getPairCount()}
                                    </span>
                                </div>
                            </div>

                            {/* Audio & Restart Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSoundEnabled((prev) => !prev)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition-all"
                                    title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                                >
                                    {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                </button>
                                <button
                                    onClick={startNewGame}
                                    className="flex items-center gap-1.5 text-xs font-bold bg-[#52B788] text-[#0a180e] hover:bg-[#68cda0] px-3.5 py-2 rounded-xl transition-all"
                                >
                                    <RotateCcw size={15} />
                                    <span>Restart</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Unlocked Fact Toast Popup */}
                        {recentFact && (
                            <div className="w-full max-w-xl mb-4 bg-gradient-to-r from-emerald-950/90 via-[#132c1c]/95 to-emerald-950/90 border border-[#52B788]/60 text-emerald-100 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 flex items-start gap-3">
                                <Sparkles className="w-6 h-6 text-amber-300 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: "4s" }} />
                                <div className="text-left">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                                        🦕 Fact Unlocked: {recentFact.name}
                                    </span>
                                    <p className="text-xs sm:text-sm font-medium mt-0.5 text-slate-200">
                                        {recentFact.fact}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Card Grid Layout */}
                        <div
                            className={`w-full max-w-4xl grid gap-3 sm:gap-4 p-2 ${
                                getPairCount() === 4
                                    ? "grid-cols-2 sm:grid-cols-4"
                                    : getPairCount() === 6
                                    ? "grid-cols-3 sm:grid-cols-4"
                                    : "grid-cols-4 sm:grid-cols-4"
                            }`}
                        >
                            {cards.map((card, index) => {
                                const isFlipped = flippedIndices.includes(index);
                                const isMatched = matchedIds.includes(card.id);

                                return (
                                    <div
                                        key={card.cardUniqueId}
                                        onClick={() => handleCardClick(index)}
                                        className="perspective-1000 h-36 sm:h-44 xl:h-48 cursor-pointer select-none"
                                    >
                                        <div
                                            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${
                                                isFlipped || isMatched ? "rotate-y-180" : ""
                                            }`}
                                        >
                                            {/* CARD BACK (Unflipped view) */}
                                            <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-[#456b4f] bg-gradient-to-br from-[#1b3624] via-[#122418] to-[#09140c] shadow-lg flex flex-col items-center justify-center p-3 hover:border-[#52B788] transition-all hover:scale-[1.02]">
                                                <div className="w-12 h-12 rounded-full border border-[#52B788]/40 bg-[#0c1a10] flex items-center justify-center text-2xl shadow-inner">
                                                    🦖
                                                </div>
                                                <span className="mt-2 text-[10px] sm:text-xs font-serif font-bold tracking-widest text-[#8fa894] uppercase">
                                                    JURASSIC
                                                </span>
                                            </div>

                                            {/* CARD FRONT (Flipped view) */}
                                            <div
                                                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 ${
                                                    isMatched
                                                        ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                                                        : card.borderColor
                                                } bg-gradient-to-br ${
                                                    card.color
                                                } p-2.5 flex flex-col justify-between overflow-hidden shadow-xl text-white`}
                                            >
                                                {/* Header Badge */}
                                                <div className="flex items-center justify-between text-[10px] font-bold text-white/80 uppercase">
                                                    <span className="truncate max-w-[80%]">{card.era}</span>
                                                    {isMatched && (
                                                        <CheckCircle2 size={16} className="text-emerald-300" />
                                                    )}
                                                </div>

                                                {/* Image */}
                                                <div className="flex-1 flex items-center justify-center my-1 overflow-hidden">
                                                    <img
                                                        src={card.image}
                                                        alt={card.name}
                                                        className="max-h-20 sm:max-h-28 w-auto object-contain filter drop-shadow-md transition-transform hover:scale-110"
                                                    />
                                                </div>

                                                {/* Name */}
                                                <div className="text-center bg-black/40 backdrop-blur-sm rounded-lg p-1">
                                                    <p className="text-xs sm:text-sm font-serif font-bold text-white leading-tight truncate">
                                                        {card.name}
                                                    </p>
                                                    <p className="text-[9px] text-amber-200/90 font-medium truncate">
                                                        {card.tagline}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* GAME OVER / VICTORY MODAL */}
                {gameState === "gameover" && (
                    <div className="flex-1 flex items-center justify-center py-6">
                        <div className="w-full max-w-2xl bg-[#0f2215]/95 border-2 border-[#52B788] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 text-center relative overflow-hidden text-white">
                            
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
                                <span className="text-amber-400 animate-bounce" style={{ animationDelay: "0ms" }}>⭐</span>
                                <span className="text-amber-400 animate-bounce" style={{ animationDelay: "150ms" }}>⭐</span>
                                <span className="text-amber-400 animate-bounce" style={{ animationDelay: "300ms" }}>⭐</span>
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

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                <button
                                    onClick={startNewGame}
                                    className="flex items-center gap-2 bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-105"
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
