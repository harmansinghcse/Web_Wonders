import { useState, useEffect, useRef } from "react";
import Navbar from "../home_components/hero/Navbar";
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Shield, Heart, Pause, Eye, EyeOff } from "lucide-react";
import Cursor from "./Cursor";

// Biomes configuration
const BIOMES = [
    {
        name: "Jurassic Jungle",
        start: 0,
        end: 150,
        skyColors: ["#0F2013", "#223E28"],
        groundColors: ["#3D2F1B", "#251B0F"],
        fogColor: "rgba(16, 185, 129, 0.1)",
        accentColor: "border-emerald-500 text-emerald-400",
        soundFreq: 180,
        gravity: 0.65,
        speedMultiplier: 1.0,
    },
    {
        name: "Volcanic Wasteland",
        start: 150,
        end: 300,
        skyColors: ["#2A0808", "#140202"],
        groundColors: ["#1F0A0A", "#0A0000"],
        fogColor: "rgba(239, 68, 68, 0.15)",
        accentColor: "border-red-600 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
        soundFreq: 95,
        gravity: 0.7,
        speedMultiplier: 1.1,
    },
    {
        name: "Prehistoric Swamp",
        start: 300,
        end: 450,
        skyColors: ["#081C15", "#1B4332"],
        groundColors: ["#2D3A2E", "#1B261C"],
        fogColor: "rgba(52, 211, 153, 0.2)",
        accentColor: "border-teal-500 text-teal-400",
        soundFreq: 140,
        gravity: 0.45, // low gravity
        speedMultiplier: 0.95,
    },
    {
        name: "Desert Dunes",
        start: 450,
        end: 600,
        skyColors: ["#2B1B0A", "#452D14"],
        groundColors: ["#40270B", "#1E1103"],
        fogColor: "rgba(245, 158, 11, 0.1)",
        accentColor: "border-amber-500 text-amber-400",
        soundFreq: 120,
        gravity: 0.65,
        speedMultiplier: 1.25, // fast running speed
    },
    {
        name: "Prehistoric Ice Age",
        start: 600,
        end: 750,
        skyColors: ["#0F1C2B", "#1D324A"],
        groundColors: ["#102338", "#06101B"],
        fogColor: "rgba(34, 211, 238, 0.12)",
        accentColor: "border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]",
        soundFreq: 220,
        gravity: 0.85, // high gravity
        speedMultiplier: 1.05,
    },
    {
        name: "Meteor Apocalypse",
        start: 750,
        end: Infinity,
        skyColors: ["#1F0324", "#0E0110"],
        groundColors: ["#0F0112", "#020003"],
        fogColor: "rgba(168, 85, 247, 0.25)",
        accentColor: "border-purple-600 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse",
        soundFreq: 75,
        gravity: 0.7,
        speedMultiplier: 1.2,
    }
];

export default function DinoRunnerGame({ onBackToHub }) {
    const [gameState, setGameState] = useState("start"); // 'start' | 'countdown' | 'playing' | 'paused' | 'gameover'
    const [difficulty, setDifficulty] = useState("moderate"); // 'easy' | 'moderate' | 'hard'
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem("jurassic_runner_high") || "0", 10);
    });
    const [shields, setShields] = useState(3);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [amberCollected, setAmberCollected] = useState(0);
    const [obstaclesAvoided, setObstaclesAvoided] = useState(0);
    const [activeBiome, setActiveBiome] = useState(BIOMES[0]);
    const [achievements, setAchievements] = useState([]);
    const [recentUnlocks, setRecentUnlocks] = useState([]);
    const [countdown, setCountdown] = useState(3);
    
    // Accessibility states
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);

    // Canvas references
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const gameLoopRef = useRef(null);

    // Audio context references
    const audioContextRef = useRef(null);
    const ambientOscRef = useRef(null);
    const ambientGainRef = useRef(null);

    // Game Core State References (for high-perf requestAnimationFrame updates)
    const stateRef = useRef({
        dino: {
            x: 120,
            y: 0,
            vy: 0,
            width: 60,
            height: 60,
            isJumping: false,
            jumpCount: 0,
            scaleY: 1.0,
            rotate: 0,
            runFrame: 0,
            hurtTimer: 0,
            perfectLandCheck: false,
        },
        obstacles: [],
        gems: [],
        particles: [],
        popups: [],
        parallaxOffsets: { layer1: 0, layer2: 0, layer3: 0, layer4: 0 },
        score: 0,
        shields: 3,
        combo: 0,
        maxCombo: 0,
        amberCollected: 0,
        obstaclesAvoided: 0,
        frameCount: 0,
        screenShake: 0,
        activeBiome: BIOMES[0],
        difficulty: "moderate",
        lastSpawnFrame: 0,
        lastGemFrame: 0,
        jumpBuffer: 0, // Input buffer frames
        coyoteTime: 0, // Coyote time frames
    });

    // Sync state options with ref
    useEffect(() => {
        stateRef.current.difficulty = difficulty;
    }, [difficulty]);

    // Keyboard & Action triggers
    const triggerJump = () => {
        if (gameState !== "playing") return;
        const dino = stateRef.current.dino;
        const biome = stateRef.current.activeBiome;

        // Coyote Time or normal Ground check
        const canJump = dino.y <= 0 || stateRef.current.coyoteTime > 0;

        if (canJump && dino.jumpCount === 0) {
            dino.vy = biome.gravity === 0.45 ? 12.0 : 14.0; // special jump velocity
            dino.isJumping = true;
            dino.jumpCount = 1;
            stateRef.current.coyoteTime = 0;
            playSound("jump");
            // Stretch animation
            dino.scaleY = 1.3;
            dino.rotate = -12;
            
            // Add jump particles
            createJumpParticles(dino.x + dino.width / 2, 400 - 60);
        } else if (dino.jumpCount === 1) {
            dino.vy = biome.gravity === 0.45 ? 10.0 : 11.5;
            dino.jumpCount = 2;
            playSound("doublejump");
            // Front flip spin!
            dino.rotate = 360;
            
            // Sparkly double jump effect
            createDoubleJumpParticles(dino.x + dino.width / 2, 400 - 60 - dino.y);
        }
    };

    const triggerFastFall = () => {
        if (gameState !== "playing") return;
        const dino = stateRef.current.dino;
        if (dino.y > 0) {
            dino.vy = -12.0; // push downwards quickly
            dino.perfectLandCheck = true; // reward players who fast-fall correctly
        }
    };

    // Synthesize Audio using Web Audio API
    const playSound = (type) => {
        if (!soundEnabled) return;
        try {
            if (!audioContextRef.current) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) audioContextRef.current = new AudioCtx();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === "suspended") {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const now = ctx.currentTime;

            switch (type) {
                case "jump":
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
                case "doublejump":
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.exponentialRampToValueAtTime(850, now + 0.22);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                    osc.start(now);
                    osc.stop(now + 0.22);
                    break;
                case "landing":
                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.linearRampToValueAtTime(45, now + 0.08);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;
                case "amber":
                    const comboFactor = Math.min(3, 1 + stateRef.current.combo * 0.1);
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(550 * comboFactor, now);
                    osc.frequency.setValueAtTime(800 * comboFactor, now + 0.08);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                case "shield_hit":
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(260, now);
                    osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                    break;
                case "hit":
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(130, now);
                    osc.frequency.linearRampToValueAtTime(25, now + 0.5);
                    gain.gain.setValueAtTime(0.4, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
                case "countdown":
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(392.00, now); // G4
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                case "countdown_go":
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(783.99, now); // G5
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                    break;
                case "achievement":
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(523.25, now); // C5
                    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                    osc.start(now);
                    osc.stop(now + 0.45);
                    break;
                default:
                    break;
            }
        } catch (e) {}
    };

    // Synthesized Ambient Loop
    const setupAmbientAudio = () => {
        if (!soundEnabled || gameState !== "playing") {
            cleanupAmbientAudio();
            return;
        }
        try {
            if (!audioContextRef.current) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) audioContextRef.current = new AudioCtx();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === "suspended") {
                ctx.resume();
            }

            if (!ambientOscRef.current) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(stateRef.current.activeBiome.soundFreq, ctx.currentTime);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();

                ambientOscRef.current = osc;
                ambientGainRef.current = gain;
            }
        } catch (e) {}
    };

    const cleanupAmbientAudio = () => {
        try {
            if (ambientOscRef.current) {
                ambientOscRef.current.stop();
                ambientOscRef.current.disconnect();
                ambientOscRef.current = null;
            }
            if (ambientGainRef.current) {
                ambientGainRef.current.disconnect();
                ambientGainRef.current = null;
            }
        } catch (e) {}
    };

    // Handle visible biome frequency modifications dynamically
    useEffect(() => {
        if (ambientOscRef.current && audioContextRef.current) {
            const ctx = audioContextRef.current;
            ambientOscRef.current.frequency.exponentialRampToValueAtTime(activeBiome.soundFreq, ctx.currentTime + 1.0);
        }
    }, [activeBiome]);

    useEffect(() => {
        setupAmbientAudio();
        return () => cleanupAmbientAudio();
    }, [gameState, soundEnabled]);

    // Key event listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                if (gameState === "playing") {
                    triggerJump();
                } else if (gameState === "start" || gameState === "gameover") {
                    setGameState("countdown");
                }
            } else if (e.code === "ArrowDown" || e.code === "KeyS") {
                e.preventDefault();
                if (gameState === "playing") {
                    triggerFastFall();
                }
            } else if (e.code === "Escape") {
                e.preventDefault();
                if (gameState === "playing") {
                    setGameState("paused");
                } else if (gameState === "paused") {
                    setGameState("playing");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    // Handle visibility focus change to auto pause
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden && gameState === "playing") {
                setGameState("paused");
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [gameState]);

    // Play button triggers countdown
    useEffect(() => {
        if (gameState !== "countdown") return;
        setCountdown(3);
        playSound("countdown");
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    playSound("countdown_go");
                    startGame(difficulty);
                    return "GO!";
                }
                playSound("countdown");
                return prev - 1;
            });
        }, 750);
        return () => clearInterval(interval);
    }, [gameState]);

    // Game initialization
    const getDiffConfig = (diff) => {
        if (diff === "easy") return { baseSpeed: 5.5, spawnRate: 95, initialShields: 5 };
        if (diff === "moderate") return { baseSpeed: 7.0, spawnRate: 75, initialShields: 3 };
        return { baseSpeed: 9.0, spawnRate: 55, initialShields: 1 };
    };

    const startGame = (selectedDiff) => {
        const config = getDiffConfig(selectedDiff);
        
        stateRef.current = {
            dino: {
                x: 120,
                y: 0,
                vy: 0,
                width: 60,
                height: 60,
                isJumping: false,
                jumpCount: 0,
                scaleY: 1.0,
                rotate: 0,
                runFrame: 0,
                hurtTimer: 0,
                perfectLandCheck: false,
            },
            obstacles: [],
            gems: [],
            particles: [],
            popups: [],
            parallaxOffsets: { layer1: 0, layer2: 0, layer3: 0, layer4: 0 },
            score: 0,
            shields: config.initialShields,
            combo: 1,
            maxCombo: 1,
            amberCollected: 0,
            obstaclesAvoided: 0,
            frameCount: 0,
            screenShake: 0,
            activeBiome: BIOMES[0],
            difficulty: selectedDiff,
            lastSpawnFrame: 0,
            lastGemFrame: 0,
            jumpBuffer: 0,
            coyoteTime: 0,
        };

        setScore(0);
        setShields(config.initialShields);
        setCombo(1);
        setMaxCombo(1);
        setAmberCollected(0);
        setObstaclesAvoided(0);
        setActiveBiome(BIOMES[0]);
        setGameState("playing");
    };

    // Particle Generation Helpers
    const createRunDustParticles = (x, y) => {
        if (reducedMotion) return;
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: -Math.random() * 2 - 1,
                vy: -Math.random() * 1.5,
                radius: Math.random() * 5 + 3,
                alpha: 0.7,
                decay: 0.03,
                color: "#8B7355",
            });
        }
    };

    const createJumpParticles = (x, y) => {
        if (reducedMotion) return;
        for (let i = 0; i < 8; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3 - 1,
                radius: Math.random() * 6 + 4,
                alpha: 0.8,
                decay: 0.04,
                color: "#E2E8F0",
            });
        }
    };

    const createDoubleJumpParticles = (x, y) => {
        if (reducedMotion) return;
        for (let i = 0; i < 12; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                radius: Math.random() * 5 + 2,
                alpha: 1.0,
                decay: 0.03,
                color: "#FCD34D", // Amber sparkle
            });
        }
    };

    const createAmberCollectParticles = (x, y) => {
        if (reducedMotion) return;
        for (let i = 0; i < 15; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 5 + 3,
                alpha: 1.0,
                decay: 0.04,
                color: "#F59E0B",
            });
        }
    };

    const createObstacleBreakParticles = (x, y, color = "#EF4444") => {
        if (reducedMotion) return;
        for (let i = 0; i < 20; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 2,
                radius: Math.random() * 6 + 3,
                alpha: 1.0,
                decay: 0.03,
                color,
            });
        }
    };

    const createNearMissParticles = (x, y) => {
        if (reducedMotion) return;
        for (let i = 0; i < 10; i++) {
            stateRef.current.particles.push({
                x,
                y,
                vx: (Math.random() - 0.2) * 5,
                vy: (Math.random() - 0.5) * 5,
                radius: Math.random() * 4 + 2,
                alpha: 1.0,
                decay: 0.05,
                color: "#FFFF00",
            });
        }
    };

    // Achievement Unlock
    const unlockAchievement = (title, description) => {
        if (achievements.includes(title)) return;
        setAchievements((prev) => [...prev, title]);
        playSound("achievement");
        setRecentUnlocks((prev) => [...prev, { id: Date.now(), title, description }]);
        setTimeout(() => {
            setRecentUnlocks((prev) => prev.slice(1));
        }, 4000);
    };

    const handleGameOver = () => {
        const finalScore = stateRef.current.score;
        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem("jurassic_runner_high", finalScore.toString());
        }
        setGameState("gameover");
        cleanupAmbientAudio();
    };

    // Canvas dynamic resize logic & rendering loop Setup
    useEffect(() => {
        if (gameState !== "playing") return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        contextRef.current = ctx;

        const handleResize = () => {
            // Internal coordinate grid is set to fixed 1000 x 400
            canvas.width = 1000;
            canvas.height = 400;
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        // Core Tick loop
        const tick = () => {
            updateGamePhysics();
            drawGame();
            gameLoopRef.current = requestAnimationFrame(tick);
        };

        gameLoopRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, reducedMotion, highContrast]);

    // Core Game Physics Calculation (1 Tick = 1 Frame)
    const updateGamePhysics = () => {
        const state = stateRef.current;
        const config = getDiffConfig(state.difficulty);
        state.frameCount += 1;

        // 1. Difficulty progression modifiers
        const distanceModifier = state.score * 0.003;
        const speed = (config.baseSpeed + distanceModifier) * state.activeBiome.speedMultiplier;
        const spawnInterval = Math.max(38, config.spawnRate - Math.floor(state.score * 0.05));

        // 2. Score progression
        if (state.frameCount % 4 === 0) {
            state.score += 1;
            setScore(state.score);

            // Biome updates
            const nextBiome = BIOMES.find((b) => state.score >= b.start && state.score < b.end) || BIOMES[BIOMES.length - 1];
            if (nextBiome.name !== state.activeBiome.name) {
                state.activeBiome = nextBiome;
                setActiveBiome(nextBiome);
                
                // Show Biome Transition toast pop-up
                state.popups.push({
                    text: `Entering: ${nextBiome.name}! 🚀`,
                    x: 500,
                    y: 180,
                    alpha: 1.0,
                    color: "#A78BFA",
                    scale: 1.5,
                });
                unlockAchievement(`${nextBiome.name} Explorer`, `Reached the ${nextBiome.name}.`);
            }

            // Milestone achievements
            if (state.score === 100) unlockAchievement("100m Survivor", "Travel 100 meters without collapsing.");
            if (state.score === 300) unlockAchievement("Jungle Legend", "Travel 300 meters through harsh biomes.");
        }

        // 3. Parallax offsets
        const parallaxSpeed = speed * (reducedMotion ? 0.2 : 1.0);
        state.parallaxOffsets.layer1 = (state.parallaxOffsets.layer1 + parallaxSpeed * 0.08) % 1000;
        state.parallaxOffsets.layer2 = (state.parallaxOffsets.layer2 + parallaxSpeed * 0.25) % 1000;
        state.parallaxOffsets.layer3 = (state.parallaxOffsets.layer3 + parallaxSpeed * 0.55) % 1000;
        state.parallaxOffsets.layer4 = (state.parallaxOffsets.layer4 + parallaxSpeed * 1.0) % 1000;

        // 4. Screen Shake decay
        if (state.screenShake > 0) {
            state.screenShake *= 0.9;
            if (state.screenShake < 0.2) state.screenShake = 0;
        }

        // 5. Dinosaur physics (gravity and vertical velocity)
        const dino = state.dino;
        const biome = state.activeBiome;

        if (dino.hurtTimer > 0) dino.hurtTimer -= 1;

        if (dino.isJumping) {
            dino.y += dino.vy;
            dino.vy -= biome.gravity; // Gravity based on biome

            // Rotation animation on jumps
            if (dino.rotate > 0) {
                dino.rotate -= 10; // Front flip rotation velocity
                if (dino.rotate < 0) dino.rotate = 0;
            } else {
                dino.rotate = dino.vy * 1.5;
            }

            // Descending squash adjustment
            if (dino.vy < 0 && dino.scaleY > 0.85) {
                dino.scaleY -= 0.015;
            }

            // Ground touch checking
            if (dino.y <= 0) {
                dino.y = 0;
                dino.isJumping = false;
                dino.jumpCount = 0;
                dino.vy = 0;
                dino.rotate = 0;
                dino.scaleY = 0.7; // Squash on impact
                playSound("landing");
                
                // Spawn impact sparks
                createJumpParticles(dino.x + dino.width / 2, 340);

                // Reset squash quickly
                setTimeout(() => {
                    dino.scaleY = 1.0;
                }, 100);

                // Perfect landing bonus check (landing soon after crossing obstacles)
                if (dino.perfectLandCheck) {
                    dino.perfectLandCheck = false;
                    state.score += 25;
                    setScore(state.score);
                    state.popups.push({
                        text: "PERFECT LANDING! +25",
                        x: dino.x,
                        y: 340 - 80,
                        alpha: 1.0,
                        color: "#34D399",
                        scale: 1.0,
                    });
                }
            }
        } else {
            // Apply running cycles
            dino.scaleY = 1.0;
            dino.rotate = 0;
            dino.runFrame = Math.floor(state.frameCount / 5) % 4;

            // Generate dust trails
            if (state.frameCount % 6 === 0) {
                createRunDustParticles(dino.x + 5, 340);
            }
        }

        // Coyote Time frames calculation
        if (dino.y === 0 && !dino.isJumping) {
            state.coyoteTime = 8; // Reset Coyote Time window
        } else if (state.coyoteTime > 0) {
            state.coyoteTime -= 1;
        }

        // 6. Spawn Obstacles
        if (state.frameCount - state.lastSpawnFrame > spawnInterval) {
            let obstacleTypes = ["small_rock", "fallen_log"];
            if (biome.name === "Volcanic Wasteland") {
                obstacleTypes = ["lava_rock", "pterodactyl", "small_rock"];
            } else if (biome.name === "Prehistoric Swamp") {
                obstacleTypes = ["sunken_log", "charging_carnivore"];
            } else if (biome.name === "Desert Dunes") {
                obstacleTypes = ["cacti", "charging_carnivore", "pterodactyl"];
            } else if (biome.name === "Prehistoric Ice Age") {
                obstacleTypes = ["falling_icicle", "small_rock", "charging_carnivore"];
            } else if (biome.name === "Meteor Apocalypse") {
                obstacleTypes = ["meteor_bomb", "pterodactyl", "charging_carnivore", "lava_rock"];
            }

            const chosenType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            let height = 0;
            if (chosenType === "pterodactyl") {
                height = Math.random() > 0.5 ? 80 : 45; // Low-hanging or mid-air flight
            } else if (chosenType === "falling_icicle") {
                height = 100;
            }

            state.obstacles.push({
                id: Date.now() + Math.random(),
                x: 1050,
                y: 340 - height,
                type: chosenType,
                width: 48,
                height: 48,
                nearMissChecked: false,
            });
            state.lastSpawnFrame = state.frameCount;
        }

        // 7. Spawn Gems
        if (state.frameCount - state.lastGemFrame > 110) {
            const h = Math.random() > 0.4 ? 90 : 35;
            state.gems.push({
                id: Date.now() + Math.random(),
                x: 1050,
                y: 340 - h,
                width: 32,
                height: 32,
            });
            state.lastGemFrame = state.frameCount;
        }

        // 8. Obstacles Logic, Collisions & Near-Misses
        const remainingObstacles = [];
        for (let obs of state.obstacles) {
            obs.x -= speed;

            // Icicle drop mechanics
            if (obs.type === "falling_icicle" && obs.x < 600) {
                obs.y += 6.5; // falling downwards
                if (obs.y > 340) obs.y = 340;
            }

            // Near miss detection
            if (!obs.nearMissChecked && dino.isJumping && Math.abs(obs.x - dino.x) < 45) {
                const vertDiff = Math.abs((340 - dino.y) - obs.y);
                if (vertDiff > 45 && vertDiff < 95) {
                    obs.nearMissChecked = true;
                    // Spark trigger near dino
                    createNearMissParticles(dino.x + dino.width, 340 - dino.y);
                    playSound("doublejump");
                    
                    state.combo += 1;
                    setCombo(state.combo);
                    if (state.combo > state.maxCombo) {
                        state.maxCombo = state.combo;
                        setMaxCombo(state.combo);
                    }

                    const bonusScore = 40 * state.combo;
                    state.score += bonusScore;
                    setScore(state.score);

                    state.popups.push({
                        text: `💥 NEAR MISS! +${bonusScore} (x${state.combo})`,
                        x: dino.x,
                        y: 340 - dino.y - 45,
                        alpha: 1.0,
                        color: "#FFFF00",
                        scale: 1.1,
                    });
                    unlockAchievement("Untouchable", "Skilled dodging next to danger.");
                }
            }

            // Rigid bounding box collision check
            const dinoBox = {
                left: dino.x + 8,
                right: dino.x + dino.width - 8,
                top: 340 - dino.y - dino.height + 8,
                bottom: 340 - dino.y,
            };

            const obsBox = {
                left: obs.x + 6,
                right: obs.x + obs.width - 6,
                top: obs.y - obs.height + 6,
                bottom: obs.y,
            };

            const collided = !(
                dinoBox.right < obsBox.left ||
                dinoBox.left > obsBox.right ||
                dinoBox.bottom < obsBox.top ||
                dinoBox.top > obsBox.bottom
            );

            if (collided) {
                createObstacleBreakParticles(obs.x + obs.width / 2, obs.y - obs.height / 2);
                if (state.shields > 0) {
                    playSound("shield_hit");
                    state.shields -= 1;
                    setShields(state.shields);
                    dino.hurtTimer = 45; // blink frames
                    state.screenShake = 12; // trigger screen shake
                    state.combo = 1; // reset combo chain
                    setCombo(1);
                    continue; // Skip obstacle insertion (destroy obstacle)
                } else {
                    playSound("hit");
                    handleGameOver();
                    return;
                }
            }

            if (obs.x > -80) {
                remainingObstacles.push(obs);
            } else {
                state.obstaclesAvoided += 1;
                setObstaclesAvoided(state.obstaclesAvoided);
            }
        }
        state.obstacles = remainingObstacles;

        // 9. Gems Collection
        const remainingGems = [];
        for (let gem of state.gems) {
            gem.x -= speed;

            const dinoBox = {
                left: dino.x,
                right: dino.x + dino.width,
                top: 340 - dino.y - dino.height,
                bottom: 340 - dino.y,
            };

            const gemBox = {
                left: gem.x,
                right: gem.x + gem.width,
                top: gem.y - gem.height,
                bottom: gem.y,
            };

            const collected = !(
                dinoBox.right < gemBox.left ||
                dinoBox.left > gemBox.right ||
                dinoBox.bottom < gemBox.top ||
                dinoBox.top > gemBox.bottom
            );

            if (collected) {
                playSound("amber");
                createAmberCollectParticles(gem.x + gem.width / 2, gem.y - gem.height / 2);
                state.amberCollected += 1;
                setAmberCollected(state.amberCollected);

                state.combo += 1;
                setCombo(state.combo);
                if (state.combo > state.maxCombo) {
                    state.maxCombo = state.combo;
                    setMaxCombo(state.combo);
                }

                const points = 50 * state.combo;
                state.score += points;
                setScore(state.score);

                state.popups.push({
                    text: `💎 x${state.combo} (+${points})`,
                    x: gem.x - 30,
                    y: gem.y - 30,
                    alpha: 1.0,
                    color: "#F59E0B",
                    scale: 1.2,
                });

                if (state.combo >= 6) {
                    unlockAchievement("Amber Collector", "Collect gems consecutively without breaking streak.");
                }
                continue;
            }

            if (gem.x > -40) {
                remainingGems.push(gem);
            } else {
                // Reset combo if amber drops off screen uncollected
                state.combo = 1;
                setCombo(1);
            }
        }
        state.gems = remainingGems;

        // 10. Update floating particles & score popups
        state.particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
        });
        state.particles = state.particles.filter((p) => p.alpha > 0);

        state.popups.forEach((pop) => {
            pop.y -= 1.5; // Float upwards
            pop.alpha -= 0.02; // Fade out
        });
        state.popups = state.popups.filter((pop) => pop.alpha > 0);
    };

    // Canvas Rendering Loop Draw calls
    const drawGame = () => {
        const ctx = contextRef.current;
        if (!ctx) return;
        const state = stateRef.current;
        const shake = state.screenShake;

        ctx.save();
        // Shake screen layout on hit
        if (shake > 0 && !reducedMotion) {
            const dx = (Math.random() - 0.5) * shake;
            const dy = (Math.random() - 0.5) * shake;
            ctx.translate(dx, dy);
        }

        // Draw background sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 400);
        if (highContrast) {
            skyGrad.addColorStop(0, "#000000");
            skyGrad.addColorStop(1, "#111111");
        } else {
            skyGrad.addColorStop(0, state.activeBiome.skyColors[0]);
            skyGrad.addColorStop(1, state.activeBiome.skyColors[1]);
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1000, 400);

        // Draw Parallax Layer 1: Stars / distant clouds
        if (!highContrast) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            for (let i = 0; i < 5; i++) {
                const cx = (i * 250 - state.parallaxOffsets.layer1) % 1050;
                ctx.beginPath();
                ctx.arc(cx, 80 + Math.sin(state.frameCount * 0.005 + i) * 15, 35, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw Fog Overlay
        if (!highContrast) {
            ctx.fillStyle = state.activeBiome.fogColor;
            ctx.fillRect(0, 0, 1000, 400);
        }

        // Draw Parallax Layer 2: Distant Mountains/Glaciers
        ctx.fillStyle = highContrast ? "#222222" : (state.activeBiome.name.includes("Volcanic") ? "#350E0E" : "#1B2A1E");
        for (let i = 0; i < 8; i++) {
            const mx = (i * 180 - state.parallaxOffsets.layer2) % 1080;
            ctx.beginPath();
            ctx.moveTo(mx - 80, 340);
            ctx.lineTo(mx + 40, 180);
            ctx.lineTo(mx + 160, 340);
            ctx.closePath();
            ctx.fill();
        }

        // Draw Parallax Layer 3: Canopy / Clumps of bushes
        ctx.fillStyle = highContrast ? "#333333" : (state.activeBiome.name.includes("Ice") ? "#08253A" : "#132D19");
        for (let i = 0; i < 15; i++) {
            const bx = (i * 110 - state.parallaxOffsets.layer3) % 1100;
            ctx.beginPath();
            ctx.arc(bx, 340, 48, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw weather elements on canvas
        drawWeather(ctx, state);

        // Draw Parallax Layer 4: Ground Track Layout
        const trackGrad = ctx.createLinearGradient(0, 340, 0, 400);
        if (highContrast) {
            trackGrad.addColorStop(0, "#FFFFFF");
            trackGrad.addColorStop(1, "#000000");
        } else {
            trackGrad.addColorStop(0, "#52B788");
            trackGrad.addColorStop(0.1, state.activeBiome.groundColors[0]);
            trackGrad.addColorStop(1, state.activeBiome.groundColors[1]);
        }
        ctx.fillStyle = trackGrad;
        ctx.fillRect(0, 340, 1000, 60);

        // Draw road dashes / ground visual patterns
        ctx.fillStyle = highContrast ? "#FFFFFF" : "rgba(0, 0, 0, 0.25)";
        for (let i = 0; i < 25; i++) {
            const rx = (i * 60 - state.parallaxOffsets.layer4) % 1060;
            ctx.fillRect(rx, 355, 30, 4);
        }

        // Draw glowing Amber Gems
        state.gems.forEach((gem) => {
            ctx.save();
            ctx.shadowColor = "rgba(245, 158, 11, 0.9)";
            ctx.shadowBlur = highContrast ? 0 : 15;
            ctx.font = "32px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            // Subtle hover-floating & rotation animation
            const bounce = Math.sin(state.frameCount * 0.1) * 4;
            ctx.fillText("💎", gem.x + gem.width / 2, gem.y - gem.height / 2 + bounce);
            ctx.restore();
        });

        // Draw Obstacles
        state.obstacles.forEach((obs) => {
            let emoji = "🌋";
            if (obs.type === "pterodactyl") emoji = "🦅";
            else if (obs.type === "cacti") emoji = "🌵";
            else if (obs.type === "fallen_log") emoji = "🪵";
            else if (obs.type === "falling_icicle") emoji = "❄️";
            else if (obs.type === "charging_carnivore") emoji = "🦖";
            else if (obs.type === "meteor_bomb") emoji = "☄️";

            ctx.save();
            ctx.font = "46px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            if (obs.type === "charging_carnivore") {
                // Flip charging enemies so they face the dinosaur
                ctx.translate(obs.x + obs.width / 2, obs.y);
                ctx.scale(-1, 1);
                ctx.fillText(emoji, 0, 0);
            } else {
                ctx.fillText(emoji, obs.x + obs.width / 2, obs.y);
            }
            ctx.restore();

            // High Contrast bounding outlines
            if (highContrast) {
                ctx.strokeStyle = "#FF0000";
                ctx.lineWidth = 2;
                ctx.strokeRect(obs.x + 6, obs.y - obs.height + 6, obs.width - 12, obs.height - 12);
            }
        });

        // Draw Particles (dust / spark overlays)
        state.particles.forEach((p) => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw Dinosaur
        const dino = state.dino;
        ctx.save();

        // Blink dino when damaged
        if (dino.hurtTimer > 0 && Math.floor(state.frameCount / 4) % 2 === 0) {
            ctx.globalAlpha = 0.35;
        }

        ctx.translate(dino.x + dino.width / 2, 340 - dino.y - dino.height / 2);
        ctx.rotate((dino.rotate * Math.PI) / 180);
        ctx.scale(1.0, dino.scaleY);

        ctx.font = "55px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🦖", 0, 0);

        ctx.restore();

        // Draw Shield bubble
        if (state.shields > 0) {
            ctx.save();
            ctx.strokeStyle = "rgba(34, 211, 238, 0.75)";
            ctx.lineWidth = 4;
            ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
            ctx.shadowBlur = highContrast ? 0 : 20;
            ctx.beginPath();
            ctx.arc(
                dino.x + dino.width / 2,
                340 - dino.y - dino.height / 2,
                42 + Math.sin(state.frameCount * 0.1) * 3,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.restore();
        }

        // Draw floating text popups
        state.popups.forEach((pop) => {
            ctx.save();
            ctx.globalAlpha = pop.alpha;
            ctx.fillStyle = pop.color;
            ctx.font = `bold ${Math.floor(13 * pop.scale)}px monospace`;
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 4;
            ctx.fillText(pop.text, pop.x, pop.y);
            ctx.restore();
        });

        ctx.restore();
    };

    // Draw Biome Weather Particle Layers
    const drawWeather = (ctx, state) => {
        if (reducedMotion) return;
        const biome = state.activeBiome;

        ctx.save();
        if (biome.name === "Prehistoric Swamp") {
            // Swamp rain drops & fireflies
            ctx.strokeStyle = "rgba(100, 200, 255, 0.4)";
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 15; i++) {
                const wx = (i * 80 + state.frameCount * 2) % 1000;
                const wy = (i * 45 + state.frameCount * 6) % 340;
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(wx - 2, wy + 12);
                ctx.stroke();
            }
            // Glowing Fireflies
            ctx.fillStyle = "rgba(167, 243, 208, 0.8)";
            for (let i = 0; i < 6; i++) {
                const fx = (i * 180 + state.frameCount * 0.5) % 1000;
                const fy = 80 + Math.sin(state.frameCount * 0.02 + i) * 30 + i * 30;
                ctx.beginPath();
                ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (biome.name === "Volcanic Wasteland") {
            // Volcanic rising ash
            ctx.fillStyle = "rgba(239, 68, 68, 0.55)";
            for (let i = 0; i < 12; i++) {
                const ax = (i * 90 - state.frameCount * 0.8) % 1000;
                const ay = (400 - (state.frameCount * 1.5 + i * 50) % 400);
                ctx.beginPath();
                ctx.arc(ax, ay, Math.random() * 3 + 1, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (biome.name === "Prehistoric Ice Age") {
            // Ice age Snowflakes
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            for (let i = 0; i < 20; i++) {
                const sx = (i * 65 + state.frameCount * 0.6) % 1000;
                const sy = (i * 35 + state.frameCount * 1.2) % 340;
                ctx.beginPath();
                ctx.arc(sx, sy, Math.random() * 3.5 + 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (biome.name === "Desert Dunes") {
            // Sand storm drifts
            ctx.fillStyle = "rgba(251, 191, 36, 0.08)";
            for (let i = 0; i < 5; i++) {
                const dx = (i * 300 - state.frameCount * 7) % 1200;
                ctx.fillRect(dx, 80 + i * 50, 200, 15);
            }
        } else if (biome.name === "Meteor Apocalypse") {
            // Meteor streams falling down
            ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
            ctx.lineWidth = 3;
            for (let i = 0; i < 4; i++) {
                const mx = (i * 300 - state.frameCount * 6) % 1200;
                const my = (state.frameCount * 8 + i * 100) % 500 - 100;
                ctx.beginPath();
                ctx.moveTo(mx, my);
                ctx.lineTo(mx - 40, my + 60);
                ctx.stroke();
            }
        }
        ctx.restore();
    };

    return (
        <div className={`game-page relative min-h-screen bg-black text-white font-sans select-none overflow-x-hidden ${highContrast ? "high-contrast" : ""}`}>
            <Cursor />

            {/* Achievement Toast Notifier */}
            <div className="fixed top-6 right-6 z-50 space-y-2 pointer-events-none">
                {recentUnlocks.map((ach) => (
                    <div 
                        key={ach.id} 
                        className="bg-[#112415] border-2 border-emerald-500 rounded-2xl p-4 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 max-w-sm pointer-events-auto"
                    >
                        <span className="text-3xl">🏆</span>
                        <div>
                            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">ACHIEVEMENT UNLOCKED</h4>
                            <p className="text-sm font-bold text-white mt-0.5">{ach.title}</p>
                            <p className="text-[10px] text-emerald-200/70">{ach.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Header Navbar */}
            {gameState === "start" && (
                <div className="relative z-50">
                    <Navbar />
                </div>
            )}

            {/* START MENU */}
            {gameState === "start" && (
                <main className="relative z-10 max-w-4xl mx-auto pt-24 pb-12 px-4 flex flex-col items-center justify-center min-h-screen text-center space-y-6">
                    {onBackToHub && (
                        <button
                            onClick={onBackToHub}
                            className="inline-flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition hover:scale-102 cursor-pointer border border-white/10"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Game Hub</span>
                        </button>
                    )}

                    <div className="space-y-2">
                        <span className="text-7xl animate-bounce inline-block">🦖</span>
                        <h1 className="text-5xl sm:text-6xl font-black font-serif text-white tracking-widest drop-shadow-md">
                            DINO ESCAPE
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-md mx-auto leading-relaxed">
                            Flee through 6 ancient prehistoric biomes. Collect amber, dodge charging hazards, and build your combo multiplier!
                        </p>
                    </div>

                    <div className="w-full max-w-md bg-[#0F2013]/90 border border-emerald-900 p-6 rounded-3xl shadow-2xl space-y-5 backdrop-blur-md">
                        <h3 className="text-xs font-serif font-extrabold text-[#52B788] tracking-widest uppercase">
                            SELECT CHALLENGE MODE
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: "easy", name: "Easy", shields: "5 Shields" },
                                { id: "moderate", name: "Medium", shields: "3 Shields" },
                                { id: "hard", name: "Hard", shields: "1 Shield" },
                            ].map((diff) => (
                                <button
                                    key={diff.id}
                                    onClick={() => setDifficulty(diff.id)}
                                    className={`py-3 px-1 rounded-2xl text-[11px] font-bold transition flex flex-col items-center space-y-0.5 cursor-pointer border ${
                                        difficulty === diff.id
                                            ? "bg-[#52B788] text-slate-950 border-[#52B788] shadow-lg scale-105"
                                             : "bg-white/5 text-emerald-200 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <span className="font-extrabold uppercase">{diff.name}</span>
                                    <span className="text-[9px] opacity-75">{diff.shields}</span>
                                </button>
                            ))}
                        </div>

                        {/* Accessibility Settings Toggle Panel */}
                        <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-around text-xs text-emerald-200/80 font-bold">
                            <button 
                                onClick={() => setReducedMotion(!reducedMotion)} 
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${reducedMotion ? "bg-[#52B788]/20 border-[#52B788] text-white" : "border-white/5 hover:bg-white/5"}`}
                            >
                                <span>{reducedMotion ? "✅" : "⬜"}</span>
                                <span>Reduced Motion</span>
                            </button>
                            <button 
                                onClick={() => setHighContrast(!highContrast)} 
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${highContrast ? "bg-[#52B788]/20 border-[#52B788] text-white" : "border-white/5 hover:bg-white/5"}`}
                            >
                                <span>{highContrast ? "👁️" : "👁️‍🗨️"}</span>
                                <span>High Contrast</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setGameState("countdown")}
                            className="w-full py-4 rounded-2xl bg-[#52B788] text-slate-950 hover:bg-[#66d29f] font-black text-sm uppercase tracking-wider shadow-lg transition hover:scale-103 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Play size={18} className="fill-slate-950" />
                            <span>ESCAPE NOW</span>
                        </button>
                    </div>
                </main>
            )}

            {/* COUNTDOWN MODAL */}
            {gameState === "countdown" && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
                    <h2 className="text-2xl font-serif text-emerald-400 font-extrabold tracking-widest mb-4">PREPARE ESCAPE...</h2>
                    <div className="text-9xl font-black text-white animate-ping">
                        {countdown}
                    </div>
                </div>
            )}

            {/* ACTIVE RUNNING GAME AREA */}
            {(gameState === "playing" || gameState === "paused" || gameState === "gameover") && (
                <main className="relative z-10 max-w-5xl mx-auto pt-8 pb-12 px-4 sm:px-6 flex flex-col space-y-5">
                    
                    {/* Header HUD panel */}
                    <div className="flex items-center justify-between bg-[#0e1c12]/95 border border-emerald-900 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-3.5">
                            <button
                                onClick={onBackToHub || (() => setGameState("start"))}
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white cursor-pointer hover:scale-105"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-base sm:text-lg font-serif font-black text-emerald-200">
                                        {activeBiome.name}
                                    </h1>
                                    <span className="bg-emerald-500/20 border border-emerald-500/50 px-2 py-0.5 rounded-full text-[9px] font-black text-[#52B788] uppercase">
                                        {difficulty}
                                    </span>
                                </div>
                                <p className="text-[10px] text-emerald-400/90 font-medium">Press ESC to Pause | SPACE to Jump | DOWN/S to Fast Fall</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {combo > 1 && (
                                <div className="bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-400/50 text-center animate-bounce">
                                    <span className="text-[10px] text-amber-300 font-black tracking-widest block uppercase font-bold">COMBO</span>
                                    <span className="text-xs font-black text-amber-100 font-mono">x{combo}</span>
                                </div>
                            )}
                            <div className="bg-black/40 px-3.5 py-1.5 rounded-xl border border-emerald-900 flex items-center gap-2 text-center">
                                <Shield size={16} className="text-cyan-400" />
                                <div>
                                    <span className="text-[9px] text-gray-400 block uppercase font-bold">Shields</span>
                                    <span className="text-sm font-mono font-black text-white">{shields}</span>
                                </div>
                            </div>
                            <div className="bg-black/40 px-3.5 py-1.5 rounded-xl border border-emerald-900 text-center">
                                <span className="text-[9px] text-gray-400 block uppercase font-bold">Distance</span>
                                <span className="text-sm font-mono font-black text-emerald-400">{score}m</span>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white cursor-pointer"
                            >
                                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </button>
                            {gameState === "playing" && (
                                <button
                                    onClick={() => setGameState("paused")}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white cursor-pointer"
                                >
                                    <Pause size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* HTML5 CANVAS RUNNING TRACK CONTAINER */}
                    <div className="relative w-full h-[400px] rounded-3xl border-2 border-emerald-800 shadow-2xl overflow-hidden bg-black">
                        <canvas 
                            ref={canvasRef} 
                            onClick={triggerJump}
                            className="w-full h-full block cursor-pointer"
                        />

                        {/* PAUSED MODAL SCREEN */}
                        {gameState === "paused" && (
                            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 z-40">
                                <div className="bg-[#0f1f14] border-2 border-emerald-500 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
                                    <h3 className="text-2xl font-serif font-black tracking-widest text-[#52B788] uppercase">GAME PAUSED</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setGameState("playing")}
                                            className="w-full py-3 rounded-xl bg-[#52B788] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#66d29f] transition cursor-pointer"
                                        >
                                            RESUME ESCAPE
                                        </button>
                                        <button
                                            onClick={() => setGameState("countdown")}
                                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition cursor-pointer"
                                        >
                                            RESTART RUN
                                        </button>
                                        <button
                                            onClick={() => setGameState("start")}
                                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-emerald-300 font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition cursor-pointer"
                                        >
                                            QUIT TO LAUNCHER
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GAME OVER STATS MODAL SUMMARY */}
                        {gameState === "gameover" && (
                            <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-40 animate-fadeIn">
                                <div className="w-full max-w-lg bg-gradient-to-b from-[#200a0a] to-[#0a0101] border-2 border-red-500 rounded-3xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.45)] text-center space-y-6">
                                    <div className="text-6xl mb-1 animate-bounce">
                                        {score >= 200 ? "🏆" : "💥"}
                                    </div>

                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-serif font-black tracking-wider text-red-500 uppercase">
                                            {score >= 200 ? "PREHISTORIC SURVIVOR!" : "ESCAPE COLLAPSED!"}
                                        </h2>
                                        <p className="text-xs text-red-200/90">
                                            {score >= 200 ? "Incredible speed! You outran the cataclysmic events." : "The prehistoric obstacles crushed your escape dash."}
                                        </p>
                                    </div>

                                    {/* Stats panel summary */}
                                    <div className="bg-black/60 p-5 rounded-2xl border border-red-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                            <span className="text-[9px] text-gray-400 block uppercase font-bold font-bold">Distance</span>
                                            <span className="text-lg font-black text-emerald-400">{score}m</span>
                                        </div>
                                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                            <span className="text-[9px] text-gray-400 block uppercase font-bold font-bold">Best Run</span>
                                            <span className="text-lg font-black text-[#52B788]">{highScore}m</span>
                                        </div>
                                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                            <span className="text-[9px] text-gray-400 block uppercase font-bold font-bold">Amber Collected</span>
                                            <span className="text-lg font-black text-amber-300">{amberCollected}</span>
                                        </div>
                                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                                            <span className="text-[9px] text-gray-400 block uppercase font-bold font-bold">Max Combo</span>
                                            <span className="text-lg font-black text-amber-300 font-bold">x{maxCombo}</span>
                                        </div>
                                    </div>

                                    {/* Action button triggers */}
                                    <div className="space-y-3 pt-2">
                                        <button
                                            onClick={() => setGameState("countdown")}
                                            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-102 transition cursor-pointer font-bold"
                                        >
                                            RUN AGAIN (RETRY)
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 font-bold">
                                            <button
                                                onClick={() => {
                                                    setDifficulty("moderate");
                                                    setGameState("countdown");
                                                }}
                                                className="py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/10 transition cursor-pointer"
                                            >
                                                RESET MEDIUM
                                            </button>
                                            <button
                                                onClick={() => setGameState("start")}
                                                className="py-3.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-bold text-xs uppercase hover:bg-white/10 transition cursor-pointer"
                                            >
                                                LAUNCH MENU
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
