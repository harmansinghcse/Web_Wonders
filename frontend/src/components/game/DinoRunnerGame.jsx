import { useState, useEffect, useRef } from "react";
import Navbar from "../home_components/hero/Navbar";
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Shield, Heart } from "lucide-react";

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

    const gameLoopRef = useRef(null);
    const frameCountRef = useRef(0);
    const dinoYRef = useRef(0);
    const isJumpingRef = useRef(false);
    const velocityYRef = useRef(0);
    const scoreRef = useRef(0);
    const shieldsRef = useRef(1);

    // Get difficulty config
    const getDiffConfig = (diff = difficulty) => {
        if (diff === "easy") {
            return { speed: 0.8, spawnRate: 120, initialShields: 3 };
        } else if (diff === "moderate") {
            return { speed: 1.2, spawnRate: 90, initialShields: 1 };
        } else {
            // hard
            return { speed: 1.8, spawnRate: 60, initialShields: 0 };
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
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === "gem") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880, now + 0.08); // A5
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
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

    // Jump Handler
    const triggerJump = () => {
        if (gameState !== "playing") return;
        if (!isJumpingRef.current) {
            isJumpingRef.current = true;
            velocityYRef.current = 14;
            playSound("jump");
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
        velocityYRef.current = 0;
        frameCountRef.current = 0;
    };

    // Main Game Loop
    useEffect(() => {
        if (gameState !== "playing") return;
        const config = getDiffConfig(difficulty);

        const updateGame = () => {
            frameCountRef.current += 1;

            // Update Score
            if (frameCountRef.current % 5 === 0) {
                scoreRef.current += 1;
                setScore(scoreRef.current);
            }

            // Physics Update for Dino Jump
            if (isJumpingRef.current) {
                dinoYRef.current += velocityYRef.current;
                velocityYRef.current -= 0.8; // Gravity
                if (dinoYRef.current <= 0) {
                    dinoYRef.current = 0;
                    isJumpingRef.current = false;
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
                            playSound("hit");
                            if (shieldsRef.current > 0) {
                                shieldsRef.current -= 1;
                                setShields(shieldsRef.current);
                                continue; // Shield absorbed collision, clear obstacle
                            } else {
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
        <div className="relative min-h-screen bg-[#0e1711] text-[#e4dac6] font-sans select-none overflow-x-hidden">
            
            {/* DISTINCT VOLCANIC RUNNER BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    src="/jurassic_game_vibe_bg.jpg"
                    alt="Jurassic Dino Escape Background"
                    className="h-full w-full object-cover object-center filter brightness-85 contrast-115 scale-105"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/60 via-stone-950/80 to-[#0e1711]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#ef4444_0%,transparent_60%)] opacity-20" />
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

                    {/* Difficulty Selection Card */}
                    <div className="w-full max-w-md bg-[#142418]/95 border border-[#2b4c34] p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-md">
                        <h3 className="text-xs font-serif font-bold text-[#52B788] uppercase tracking-widest">
                            SELECT DIFFICULTY LEVEL
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: "easy", name: "Easy", speed: "Normal Speed", shields: "3 Shields" },
                                { id: "moderate", name: "Moderate", speed: "Faster Speed", shields: "1 Shield" },
                                { id: "hard", name: "Hard", speed: "Extreme Speed", shields: "0 Shields" },
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
                    
                    {/* HUD Header */}
                    <div className="flex items-center justify-between bg-[#18291c]/95 border border-[#2b4c34] rounded-2xl p-4 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setGameState("start")}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
                                title="Exit Run"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-lg font-serif font-bold text-amber-200 uppercase tracking-wider">
                                        DINO ESCAPE
                                    </h1>
                                    <span className="bg-[#52B788]/20 border border-[#52B788]/40 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#52B788] uppercase">
                                        {difficulty}
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-300/80">Press Space or Tap Screen to Jump!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-[#0c1810] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] flex items-center gap-1.5 text-center">
                                <Heart size={16} className="text-red-400 fill-red-400" />
                                <div>
                                    <span className="text-[9px] text-gray-400 block uppercase leading-none">Shields</span>
                                    <span className="text-sm font-mono font-bold text-white leading-none mt-0.5 block">{shields}</span>
                                </div>
                            </div>
                            <div className="bg-[#0c1810] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Distance</span>
                                <span className="text-sm font-mono font-bold text-emerald-400">{score} m</span>
                            </div>
                            <div className="bg-[#0c1810] px-3.5 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Best</span>
                                <span className="text-sm font-mono font-bold text-amber-300">{highScore} m</span>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                            >
                                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Game Runner Track Window */}
                    <div 
                        onClick={triggerJump}
                        className="relative w-full h-[400px] rounded-3xl border-2 border-[#2b4c34] bg-gradient-to-b from-[#132317] via-[#1b2b1f] to-[#0c160e] shadow-2xl overflow-hidden cursor-pointer"
                    >
                        {/* Background Distant Jungle Silhouette */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2b4c34_0%,transparent_70%)] opacity-30 pointer-events-none" />

                        {/* Ground Track */}
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-[#3d3326] to-[#1e1912] border-t-4 border-[#6e5d47]">
                            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:40px_100%] animate-pulse" />
                        </div>

                        {/* Dinosaur Runner Sprite */}
                        <div
                            className="absolute left-[12%] bottom-16 text-5xl transition-all duration-75 filter drop-shadow-lg"
                            style={{ transform: `translateY(-${dinoPos.y}px)` }}
                        >
                            🦖
                        </div>

                        {/* Obstacles Rendering */}
                        {obstacles.map((obs) => (
                            <div
                                key={obs.id}
                                className="absolute text-4xl filter drop-shadow-md"
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
                                className="absolute text-3xl animate-spin filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                                style={{
                                    left: `${gem.x}%`,
                                    bottom: `${20 + gem.height}px`,
                                    animationDuration: "3s",
                                }}
                            >
                                💎
                            </div>
                        ))}

                        {/* Game Over Overlay */}
                        {gameState === "gameover" && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                                <span className="text-5xl">💥</span>
                                <h2 className="text-3xl font-serif font-black text-red-400">ESCAPE FAILED!</h2>
                                <p className="text-xs text-gray-300">
                                    Your dinosaur collided on <span className="font-bold text-amber-300 uppercase">{difficulty}</span> mode!
                                </p>
                                <div className="bg-[#09150d] px-6 py-3 rounded-2xl border border-white/10 flex gap-6 font-mono text-sm">
                                    <div>
                                        <span className="text-[10px] text-gray-400 block uppercase">Distance</span>
                                        <span className="text-emerald-400 font-bold">{score} m</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 block uppercase">Best Distance</span>
                                        <span className="text-amber-300 font-bold">{highScore} m</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => startGame(difficulty)}
                                        className="px-6 py-3 rounded-2xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                                    >
                                        <RotateCcw size={16} />
                                        <span>Try Again</span>
                                    </button>
                                    <button
                                        onClick={() => setGameState("start")}
                                        className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                    >
                                        Change Level
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            )}

        </div>
    );
}
