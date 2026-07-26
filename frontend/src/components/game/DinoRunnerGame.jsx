import { useState, useEffect, useRef } from "react";
import Navbar from "../home_components/hero/Navbar";
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Shield, Heart } from "lucide-react";
import Cursor from "./Cursor";

export default function DinoRunnerGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("start"); // 'start' | 'playing' | 'gameover'
    const [difficulty, setDifficulty] = useState("moderate"); // 'easy' | 'moderate' | 'hard'
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem("jurassic_runner_high") || "0", 10);
    });
    const [dinoPos, setDinoPos] = useState({ y: 0, isJumping: false });
    const [obstacles, setObstacles] = useState([]);
    const [gems, setGems] = useState([]);
    const [shields, setShields] = useState(1);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [selectedBg, setSelectedBg] = useState("/jurassic_game_vibe_bg.jpg");
    const [hitFlash, setHitFlash] = useState(false);
    const [scorePopups, setScorePopups] = useState([]);
    const [runFrame, setRunFrame] = useState(0);

    const gameLoopRef = useRef(null);
    const frameCountRef = useRef(0);
    const dinoYRef = useRef(0);
    const isJumpingRef = useRef(false);
    const jumpCountRef = useRef(0); // For Double Jump
    const velocityYRef = useRef(0);
    const scoreRef = useRef(0);
    const shieldsRef = useRef(1);

    // Get difficulty config
    const getDiffConfig = (diff = difficulty) => {
        if (diff === "easy") {
            return { speed: 0.85, spawnRate: 110, initialShields: 5 };
        } else if (diff === "moderate") {
            return { speed: 1.3, spawnRate: 85, initialShields: 3 };
        } else {
            // hard
            return { speed: 1.9, spawnRate: 55, initialShields: 1 };
        }
    };

    // Audio effects synthesizer
    const playSound = (type) => {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const now = ctx.currentTime;

            if (type === "jump") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(160, now);
                osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === "doublejump") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(350, now);
                osc.frequency.exponentialRampToValueAtTime(650, now + 0.14);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
                osc.start(now);
                osc.stop(now + 0.14);
            } else if (type === "gem") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880, now + 0.08); // A5
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === "shield_hit") {
                osc.type = "square";
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                osc.start(now);
                osc.stop(now + 0.18);
            } else if (type === "hit") {
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.linearRampToValueAtTime(40, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            }
        } catch (e) {}
    };

    // Jump Handler (Supports Double Jump!)
    const triggerJump = () => {
        if (gameState !== "playing") return;
        if (!isJumpingRef.current) {
            isJumpingRef.current = true;
            jumpCountRef.current = 1;
            velocityYRef.current = 15;
            playSound("jump");
        } else if (jumpCountRef.current === 1) {
            // Second jump mid-air!
            jumpCountRef.current = 2;
            velocityYRef.current = 13;
            playSound("doublejump");
        }
    };

    // Keyboard Listener for Jump
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                if (gameState === "playing") {
                    triggerJump();
                } else if (gameState === "start" || gameState === "gameover") {
                    startGame(difficulty);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState, difficulty]);

    // Start Game
    const startGame = (selectedDiff = difficulty) => {
        const config = getDiffConfig(selectedDiff);
        setGameState("playing");
        setScore(0);
        scoreRef.current = 0;
        setObstacles([]);
        setGems([]);
        setShields(config.initialShields);
        shieldsRef.current = config.initialShields;
        dinoYRef.current = 0;
        isJumpingRef.current = false;
        jumpCountRef.current = 0;
        velocityYRef.current = 0;
        frameCountRef.current = 0;
        setScorePopups([]);
        setHitFlash(false);
    };

    // Main Game Loop
    useEffect(() => {
        if (gameState !== "playing") return;
        const config = getDiffConfig(difficulty);

        const updateGame = () => {
            frameCountRef.current += 1;
            setRunFrame(Math.floor(frameCountRef.current / 6) % 2);

            // Update Score
            if (frameCountRef.current % 5 === 0) {
                scoreRef.current += 1;
                setScore(scoreRef.current);
            }

            // Physics Update for Dino Jump
            if (isJumpingRef.current) {
                dinoYRef.current += velocityYRef.current;
                velocityYRef.current -= 0.85; // Gravity
                if (dinoYRef.current <= 0) {
                    dinoYRef.current = 0;
                    isJumpingRef.current = false;
                    jumpCountRef.current = 0;
                    velocityYRef.current = 0;
                }
                setDinoPos({ y: dinoYRef.current, isJumping: true });
            }

            // Spawn Obstacles (Volcanic Lava Boulders or Pterodactyls)
            if (frameCountRef.current % config.spawnRate === 0) {
                const isFlying = Math.random() > 0.55;
                setObstacles((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        x: 100, // percentage from left
                        type: isFlying ? "pterodactyl" : "lava_rock",
                        height: isFlying ? 60 : 0, // Y position percentage offset
                    },
                ]);
            }

            // Spawn Amber Gems
            if (frameCountRef.current % 130 === 0) {
                setGems((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        x: 100,
                        height: Math.random() > 0.5 ? 50 : 20,
                    },
                ]);
            }

            // Move Obstacles & Check Collisions
            setObstacles((prev) => {
                const nextObstacles = [];
                for (let obs of prev) {
                    const nextX = obs.x - config.speed;
                    
                    // Collision Check with Dino
                    if (nextX > 8 && nextX < 22) {
                        const dinoBottom = dinoYRef.current;
                        let hasCollided = false;

                        if (obs.type === "lava_rock" && dinoBottom < 30) {
                            hasCollided = true;
                        } else if (obs.type === "pterodactyl" && dinoBottom > 35 && dinoBottom < 85) {
                            hasCollided = true;
                        }

                        if (hasCollided) {
                            if (shieldsRef.current > 0) {
                                playSound("shield_hit");
                                shieldsRef.current -= 1;
                                setShields(shieldsRef.current);
                                setHitFlash(true);
                                setTimeout(() => setHitFlash(false), 400);
                                continue; // Shield absorbed collision, clear obstacle
                            } else {
                                playSound("hit");
                                handleGameOver();
                                return prev;
                            }
                        }
                    }

                    if (nextX > -10) {
                        nextObstacles.push({ ...obs, x: nextX });
                    }
                }
                return nextObstacles;
            });

            // Move & Collect Gems
            setGems((prev) => {
                const nextGems = [];
                for (let gem of prev) {
                    const nextX = gem.x - config.speed;
                    if (nextX > 10 && nextX < 20 && Math.abs(dinoYRef.current - gem.height) < 40) {
                        playSound("gem");
                        scoreRef.current += 50;
                        setScore(scoreRef.current);
                        setScorePopups((popups) => [
                            ...popups.slice(-4),
                            { id: Date.now() + Math.random(), text: "+50 AMBER!", x: nextX, y: gem.height },
                        ]);
                    } else if (nextX > -5) {
                        nextGems.push({ ...gem, x: nextX });
                    }
                }
                return nextGems;
            });

            gameLoopRef.current = requestAnimationFrame(updateGame);
        };

        gameLoopRef.current = requestAnimationFrame(updateGame);
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, difficulty]);

    const handleGameOver = () => {
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("jurassic_runner_high", scoreRef.current.toString());
        }
        setGameState("gameover");
    };

    return (
        <div className="game-page relative min-h-screen bg-[#0d0303] text-[#fce8e8] font-sans select-none overflow-x-hidden">
            <Cursor />
            {/* HIGH-OCTANE PREHISTORIC ARCADE GAME BACKGROUND VIBE */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
                {/* Arcade Game Background Image - High Contrast & Vibrancy */}
                <img
                    src={selectedBg}
                    alt="Jurassic Arcade Game Background"
                    className="h-full w-full object-cover object-center scale-105 filter brightness-90 contrast-120 saturate-125 opacity-85 transition-all duration-700"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/jurassic_game_bg.jpg";
                    }}
                />

                {/* Translucent Fiery Crimson Arcade Magma Horizon */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2d0808]/50 via-transparent to-[#0d0202]/85 backdrop-brightness-95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(239,68,68,0.42)_0%,transparent_65%)] animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.25)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(239,68,68,0.2)_0%,transparent_40%)]" />
            </div>

            {/* Header only on start */}
            {gameState === "start" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* START SCREEN / DIFFICULTY SELECTOR */}
            {gameState === "start" && (
                <main className="relative z-10 max-w-4xl mx-auto pt-28 pb-16 px-4 flex flex-col items-center justify-center min-h-screen text-center space-y-8">
                    
                    {onBackToHub && (
                        <button
                            onClick={onBackToHub}
                            className="inline-flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-md"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Game Hub</span>
                        </button>
                    )}

                    <div className="space-y-3">
                        <span className="text-6xl animate-bounce inline-block">🦖</span>
                        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-md">
                            JURASSIC DINO ESCAPE
                        </h1>
                        <p className="text-sm sm:text-base text-emerald-200/90 max-w-lg mx-auto font-medium">
                            Jump over volcanic rocks and dodge flying Pterodactyls! Collect Amber Gems for extra score.
                        </p>
                    </div>

                    {/* Difficulty & Background Environment Selection Card */}
                    <div className="w-full max-w-md bg-[#142418]/95 border border-[#2b4c34] p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-md">
                        <h3 className="text-xs font-serif font-bold text-[#52B788] uppercase tracking-widest">
                            SELECT DIFFICULTY LEVEL
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: "easy", name: "Easy", speed: "Normal Speed", shields: "5 Shields" },
                                { id: "moderate", name: "Moderate", speed: "Faster Speed", shields: "3 Shields" },
                                { id: "hard", name: "Hard", speed: "Extreme Speed", shields: "1 Shield" },
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
                                    <span className="text-[10px] opacity-80">{diff.speed}</span>
                                    <span className="text-[9px] opacity-70">{diff.shields}</span>
                                </button>
                            ))}
                        </div>

                        {/* Photorealistic Environment Picker */}
                        <div className="pt-2 space-y-2 border-t border-white/10">
                            <h4 className="text-[11px] font-serif font-bold text-amber-300 uppercase tracking-wider text-left">
                                PHOTOREALISTIC ENVIRONMENT BACKGROUND
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-[10px]">
                                {[
                                    { id: "/dino-info-page.png", label: "Cretaceous Land" },
                                    { id: "/jurassic-bg.webp", label: "Jurassic Jungle" },
                                    { id: "/create-bg.png", label: "Volcanic Valley" },
                                    { id: "/login-bg.jpg", label: "Atmospheric Dawn" },
                                    { id: "/map-soft-bg.jpg", label: "Soft Terrain" },
                                    { id: "/jurrasic-home-bg.jpg", label: "Forest Wilds" },
                                ].map((bg) => (
                                    <button
                                        key={bg.id}
                                        onClick={() => setSelectedBg(bg.id)}
                                        className={`py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer border ${
                                            selectedBg === bg.id
                                                ? "bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-md scale-105"
                                                : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/15"
                                        }`}
                                    >
                                        {bg.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => startGame(difficulty)}
                            className="w-full py-4 rounded-2xl bg-[#52B788] text-slate-950 hover:bg-[#66d29f] font-black text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            <Play size={18} />
                            <span>START RUN</span>
                        </button>
                    </div>

                </main>
            )}

            {/* ACTIVE GAMEPLAY RUNNER TRACK */}
            {(gameState === "playing" || gameState === "gameover") && (
                <main className="relative z-10 max-w-5xl mx-auto pt-8 pb-12 px-4 sm:px-6 flex flex-col space-y-6">
                    
                    {/* Top HUD Header */}
                    <div className="flex items-center justify-between bg-[#192b1e]/95 border border-[#2b4c34] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-3.5">
                            <button
                                onClick={onBackToHub || (() => setGameState("start"))}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer hover:scale-105"
                                title="Return to Game Center"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-lg sm:text-xl font-serif font-black text-amber-200 uppercase tracking-wider">
                                        DINO ESCAPE
                                    </h1>
                                    <span className="bg-[#52B788]/20 border border-[#52B788]/50 px-3 py-0.5 rounded-full text-xs font-black text-[#52B788] uppercase tracking-wider">
                                        {difficulty}
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-300/90 font-medium">Spacebar / Tap: Jump | Press again for Double Jump!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="bg-[#0c1810] px-4 py-2 rounded-xl border border-[#2b4c34] flex items-center gap-2 text-center min-w-[90px]">
                                <Heart size={20} className="text-red-400 fill-red-400" />
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider leading-none">Shields</span>
                                    <span className="text-lg font-mono font-black text-white leading-none mt-1 block">{shields}</span>
                                </div>
                            </div>
                            <div className="bg-[#0c1810] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[90px]">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Distance</span>
                                <span className="text-lg font-mono font-black text-emerald-400">{score} m</span>
                            </div>
                            <div className="bg-[#0c1810] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[90px]">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Best</span>
                                <span className="text-lg font-mono font-black text-amber-300">{highScore} m</span>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                            >
                                {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Game Runner Track Window */}
                    <div 
                        onClick={triggerJump}
                        className={`relative w-full h-[440px] rounded-3xl border-2 transition-all duration-300 bg-gradient-to-b from-[#132317] via-[#1b2b1f] to-[#0c160e] shadow-2xl overflow-hidden cursor-pointer ${
                            hitFlash ? "border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.8)]" : "border-[#2b4c34]"
                        }`}
                    >
                        {/* Shield Hit Flash Red/Amber Overlay */}
                        {hitFlash && (
                            <div className="absolute inset-0 bg-amber-500/25 z-40 pointer-events-none animate-ping" />
                        )}

                        {/* Background Distant Jungle Silhouette */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2b4c34_0%,transparent_70%)] opacity-30 pointer-events-none" />

                        {/* Ground Track */}
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-[#3d3326] to-[#1e1912] border-t-4 border-[#6e5d47]">
                            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:40px_100%] animate-pulse" />
                        </div>

                        {/* Running Dust Particles (when on ground) */}
                        {dinoPos.y === 0 && (
                            <div className="absolute left-[9%] bottom-16 flex gap-1 z-10 pointer-events-none animate-pulse">
                                <span className="text-amber-600/70 text-xs font-mono">💨</span>
                                <span className="text-stone-400/60 text-xs font-mono">💨</span>
                            </div>
                        )}

                        {/* Dinosaur Runner Sprite */}
                        <div
                            className={`absolute left-[12%] bottom-16 text-6xl transition-all duration-75 filter drop-shadow-xl ${
                                dinoPos.y === 0 ? (runFrame === 0 ? "translate-y-0 rotate-1" : "-translate-y-1 -rotate-1") : ""
                            }`}
                            style={{ transform: `translateY(-${dinoPos.y}px)` }}
                        >
                            🦖
                        </div>

                        {/* Gem Pickup Floating Score Popups */}
                        {scorePopups.map((popup) => (
                            <div
                                key={popup.id}
                                className="absolute text-amber-300 font-extrabold text-xs font-mono animate-bounce z-30 pointer-events-none drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                                style={{
                                    left: `${popup.x}%`,
                                    bottom: `${40 + popup.y}px`,
                                }}
                            >
                                {popup.text}
                            </div>
                        ))}

                        {/* Obstacles Rendering */}
                        {obstacles.map((obs) => (
                            <div
                                key={obs.id}
                                className="absolute text-5xl filter drop-shadow-md"
                                style={{
                                    left: `${obs.x}%`,
                                    bottom: `${16 + (obs.height || 0)}px`,
                                }}
                            >
                                {obs.type === "pterodactyl" ? "🦅" : "🌋"}
                            </div>
                        ))}

                        {/* Amber Gems Rendering */}
                        {gems.map((gem) => (
                            <div
                                key={gem.id}
                                className="absolute text-4xl animate-spin filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                                style={{
                                    left: `${gem.x}%`,
                                    bottom: `${20 + gem.height}px`,
                                    animationDuration: "3s",
                                }}
                            >
                                💎
                            </div>
                        ))}

                        {/* STANDARDIZED JURASSIC COMPLETION MODAL */}
                        {gameState === "gameover" && (
                            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
                                <div className="w-full max-w-lg bg-gradient-to-b from-[#250d0d] to-[#120404] border-2 border-red-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center space-y-6 text-white">
                                    <div className="text-6xl mb-1 animate-bounce">
                                        {score >= 200 ? "🏆" : "💥"}
                                    </div>

                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-serif font-black tracking-wider text-red-400 uppercase drop-shadow">
                                            {score >= 200 ? "ESCAPE SUCCESSFUL!" : "ESCAPE FAILED!"}
                                        </h2>
                                        <p className="text-sm font-medium text-red-200/90 italic">
                                            {score >= 200 ? "Incredible speed! You survived the volcanic dash." : "Lava rocks caught up! Give it another run."}
                                        </p>
                                    </div>

                                    <div className="bg-[#0e0303] p-5 rounded-2xl border border-red-500/30 grid grid-cols-2 gap-4 font-mono shadow-inner">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <span className="text-xs text-gray-400 block uppercase font-bold">Distance Covered</span>
                                            <span className="text-2xl font-black text-emerald-400">{score} m</span>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <span className="text-xs text-gray-400 block uppercase font-bold">Best Record</span>
                                            <span className="text-2xl font-black text-amber-300">{highScore} m</span>
                                        </div>
                                    </div>

                                    {/* Three Actions Navigation Grid */}
                                    <div className="space-y-3 pt-2">
                                        {/* Primary Highlighted Button: NEXT LEVEL */}
                                        <button
                                            onClick={() => {
                                                if (difficulty === "easy") {
                                                    setDifficulty("moderate");
                                                    startGame("moderate");
                                                } else if (difficulty === "moderate") {
                                                    setDifficulty("hard");
                                                    startGame("hard");
                                                } else {
                                                    startGame("hard");
                                                }
                                            }}
                                            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-950/50 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <span>▶</span>
                                            <span>{difficulty === "hard" ? "PLAY AGAIN (HARD)" : `NEXT LEVEL (${difficulty === "easy" ? "MODERATE" : "HARD"})`}</span>
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Secondary Button: TRY AGAIN */}
                                            <button
                                                onClick={() => startGame(difficulty)}
                                                className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                                            >
                                                <RotateCcw size={16} />
                                                <span>TRY AGAIN</span>
                                            </button>

                                            {/* Secondary Button: GAME CENTER */}
                                            <button
                                                onClick={onBackToHub || (() => setGameState("start"))}
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
                    </div>
                </main>
            )}

        </div>
    );
}
