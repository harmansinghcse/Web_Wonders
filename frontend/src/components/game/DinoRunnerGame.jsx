import { useState, useEffect, useRef } from "react";
import Navbar from "../home_components/hero/Navbar";
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Zap, Trophy, Shield } from "lucide-react";

export default function DinoRunnerGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("start"); // 'start' | 'playing' | 'gameover'
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem("jurassic_runner_high") || "0", 10);
    });
    const [dinoPos, setDinoPos] = useState({ y: 0, isJumping: false });
    const [obstacles, setObstacles] = useState([]);
    const [gems, setGems] = useState([]);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const gameLoopRef = useRef(null);
    const frameCountRef = useRef(0);
    const dinoYRef = useRef(0);
    const isJumpingRef = useRef(false);
    const velocityYRef = useRef(0);
    const scoreRef = useRef(0);

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
                    startGame();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    // Start Game
    const startGame = () => {
        setGameState("playing");
        setScore(0);
        scoreRef.current = 0;
        setObstacles([]);
        setGems([]);
        dinoYRef.current = 0;
        isJumpingRef.current = false;
        velocityYRef.current = 0;
        frameCountRef.current = 0;
    };

    // Main Game Loop
    useEffect(() => {
        if (gameState !== "playing") return;

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
            if (frameCountRef.current % 90 === 0) {
                const isFlying = Math.random() > 0.6;
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
            if (frameCountRef.current % 140 === 0) {
                setGems((prev) => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        x: 100,
                        height: Math.random() > 0.5 ? 50 : 20,
                    },
                ]);
            }

            // Move Obstacles
            setObstacles((prev) => {
                const nextObstacles = [];
                for (let obs of prev) {
                    const nextX = obs.x - 1.2;
                    // Collision Check with Dino (X range: 10% to 20%, Y matching)
                    if (nextX > 8 && nextX < 22) {
                        const dinoBottom = dinoYRef.current;
                        if (obs.type === "lava_rock" && dinoBottom < 30) {
                            handleGameOver();
                            return prev;
                        } else if (obs.type === "pterodactyl" && dinoBottom > 35 && dinoBottom < 85) {
                            handleGameOver();
                            return prev;
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
                    const nextX = gem.x - 1.2;
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
    }, [gameState]);

    const handleGameOver = () => {
        playSound("hit");
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("jurassic_runner_high", scoreRef.current.toString());
        }
        setGameState("gameover");
    };

    return (
        <div className="relative min-h-screen bg-[#0e1711] text-[#e4dac6] pt-20 pb-12 px-4 sm:px-6 font-sans select-none">
            <div className="relative z-10 max-w-5xl mx-auto flex flex-col space-y-6">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between bg-[#18291c] border border-[#2b4c34] rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBackToHub}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-amber-200 uppercase tracking-wider">
                                JURASSIC DINO ESCAPE
                            </h1>
                            <p className="text-xs text-emerald-300/80">Press Space or Click to Jump!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-[#0c1810] px-4 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                            <span className="text-[10px] text-gray-400 block uppercase">Distance / Score</span>
                            <span className="text-lg font-mono font-bold text-emerald-400">{score}</span>
                        </div>
                        <div className="bg-[#0c1810] px-4 py-1.5 rounded-xl border border-[#2b4c34] text-center">
                            <span className="text-[10px] text-gray-400 block uppercase">High Score</span>
                            <span className="text-lg font-mono font-bold text-amber-300">{highScore}</span>
                        </div>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                        >
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                    </div>
                </div>

                {/* Game Runner Track Window */}
                <div 
                    onClick={triggerJump}
                    className="relative w-full h-[380px] rounded-3xl border-2 border-[#2b4c34] bg-gradient-to-b from-[#132317] via-[#1b2b1f] to-[#0c160e] shadow-2xl overflow-hidden cursor-pointer"
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

                    {/* Start Screen Overlay */}
                    {gameState === "start" && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                            <span className="text-6xl animate-bounce">🦖</span>
                            <h2 className="text-3xl font-serif font-black text-amber-300">JURASSIC DINO ESCAPE</h2>
                            <p className="text-xs text-emerald-200 max-w-sm">
                                Jump over volcanic rocks and dodge flying Pterodactyls! Collect Amber Gems for extra points.
                            </p>
                            <button
                                onClick={startGame}
                                className="px-8 py-3.5 rounded-2xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <Play size={18} />
                                <span>Start Run</span>
                            </button>
                        </div>
                    )}

                    {/* Game Over Overlay */}
                    {gameState === "gameover" && (
                        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                            <span className="text-5xl">💥</span>
                            <h2 className="text-3xl font-serif font-black text-red-400">ESCAPE FAILED!</h2>
                            <p className="text-xs text-gray-300">Your dinosaur collided with an obstacle.</p>
                            <div className="bg-[#09150d] px-6 py-3 rounded-2xl border border-white/10 flex gap-6 font-mono text-sm">
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase">Distance</span>
                                    <span className="text-emerald-400 font-bold">{score}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 block uppercase">Best Distance</span>
                                    <span className="text-amber-300 font-bold">{highScore}</span>
                                </div>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-8 py-3.5 rounded-2xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <RotateCcw size={18} />
                                <span>Try Again</span>
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
