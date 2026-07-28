import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Play, Square, Volume2, Sparkles, RefreshCw, ArrowLeft, Sliders } from "lucide-react";
import Navbar from "../home_components/hero/Navbar";
import Cursor from "./Cursor";

const DINOSAURS = [
    {
        id: "trex",
        name: "Tyrannosaurus Rex",
        tagline: "The Apex Predator Roar",
        image: "/trex-dino.webp",
        color: "#EF4444",
        bgGlow: "rgba(239, 68, 68, 0.25)",
        border: "border-red-500/40",
        badgeBg: "bg-red-500/20 text-red-300",
        defaultRoarFreq: 90, // Deep low frequency
    },
    {
        id: "velociraptor",
        name: "Velociraptor",
        tagline: "Sharp & High-Pitched Screech",
        image: "/velociraptor.jpg",
        color: "#F59E0B",
        bgGlow: "rgba(245, 158, 11, 0.25)",
        border: "border-amber-500/40",
        badgeBg: "bg-amber-500/20 text-amber-300",
        defaultRoarFreq: 320, // Sharp raptor frequency
    },
    {
        id: "brachiosaurus",
        name: "Brachiosaurus",
        tagline: "Resonant Long-Neck Bellow",
        image: "/brachiosaurus.jpg",
        color: "#10B981",
        bgGlow: "rgba(16, 185, 129, 0.25)",
        border: "border-emerald-500/40",
        badgeBg: "bg-emerald-500/20 text-emerald-300",
        defaultRoarFreq: 70, // Ultra deep rumble frequency
    },
];

export default function DinoVoiceLabGame({ onBackToHub }) {
    const [selectedDino, setSelectedDino] = useState(DINOSAURS[0]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordTimeLeft, setRecordTimeLeft] = useState(5);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voiceEffect, setVoiceEffect] = useState("original"); // 'original' | 'deep' | 'echo'
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [micPermissionDenied, setMicPermissionDenied] = useState(false);
    const [showCompletionCard, setShowCompletionCard] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const activeAudioRef = useRef(null);
    const timerRef = useRef(null);

    // Clean up URLs & Audio on unmount
    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (timerRef.current) clearInterval(timerRef.current);
            if (activeAudioRef.current) {
                activeAudioRef.current.pause();
                activeAudioRef.current = null;
            }
        };
    }, [audioUrl]);

    // Handle recording start
    const startRecording = async () => {
        setHasRecorded(false);
        setShowCompletionCard(false);
        setAudioBlob(null);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setRecordTimeLeft(5);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                setHasRecorded(true);
                setShowCompletionCard(true);
                // Stop mic track
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start(100);
            setIsRecording(true);
            setMicPermissionDenied(false);

            // 5 second timer countdown
            let timeLeft = 5;
            timerRef.current = setInterval(() => {
                timeLeft -= 1;
                setRecordTimeLeft(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerRef.current);
                    stopRecording();
                }
            }, 1000);
        } catch (err) {
            console.warn("Microphone access unavailable or denied:", err.message);
            setMicPermissionDenied(true);
            setIsRecording(true);
            let timeLeft = 5;
            timerRef.current = setInterval(() => {
                timeLeft -= 1;
                setRecordTimeLeft(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerRef.current);
                    setIsRecording(false);
                    setHasRecorded(true);
                    setShowCompletionCard(true);
                }
            }, 1000);
        }
    };

    // Handle recording stop
    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
    };

    // Playback Roar (Supports User Audio Blob & Web Audio Synthesized Roar)
    const playRoar = async () => {
        if (isPlaying) return;
        setIsPlaying(true);

        try {
            if (audioUrl) {
                // Play recorded user voice audio
                const audio = new Audio(audioUrl);
                activeAudioRef.current = audio;

                if (voiceEffect === "deep") {
                    audio.playbackRate = 0.72; // Pitch down
                } else if (voiceEffect === "echo") {
                    audio.playbackRate = 0.90;
                } else {
                    audio.playbackRate = 1.0;
                }

                audio.onended = () => {
                    setIsPlaying(false);
                    activeAudioRef.current = null;
                };

                audio.onerror = () => {
                    playSynthesizedRoar();
                };

                await audio.play();
            } else {
                // Play Web Audio Synthesized Monster Roar
                playSynthesizedRoar();
            }
        } catch (err) {
            console.warn("Audio playback error, falling back to Web Audio synth:", err);
            playSynthesizedRoar();
        }
    };

    // Web Audio API Synthesized Dinosaur Roar Engine
    const playSynthesizedRoar = async () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            if (ctx.state === "suspended") {
                await ctx.resume();
            }

            const duration = 2.2;
            const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            const baseFreq = selectedDino.defaultRoarFreq;

            for (let i = 0; i < buffer.length; i++) {
                const t = i / ctx.sampleRate;
                // Growling pitch drop + FM snarling
                const freq = baseFreq * (1 - (t / duration) * 0.3);
                const growl = Math.sin(2 * Math.PI * freq * t + Math.sin(18 * t) * 2.5);
                const noise = (Math.random() * 2 - 1) * 0.35;
                // Envelope shape
                const attack = Math.min(1, t * 5);
                const release = Math.max(0, 1 - (t - 1.5) / 0.7);
                const env = attack * release;

                data[i] = (growl * 0.75 + noise) * env;
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;

            // Apply Voice Effects
            if (voiceEffect === "deep") {
                source.playbackRate.value = 0.7;
                const filter = ctx.createBiquadFilter();
                filter.type = "lowpass";
                filter.frequency.value = 650;
                source.connect(filter);
                filter.connect(ctx.destination);
            } else if (voiceEffect === "echo") {
                source.playbackRate.value = 0.95;
                const delay = ctx.createDelay();
                delay.delayTime.value = 0.22;
                const feedback = ctx.createGain();
                feedback.gain.value = 0.45;

                source.connect(delay);
                delay.connect(feedback);
                feedback.connect(delay);
                delay.connect(ctx.destination);
                source.connect(ctx.destination);
            } else {
                source.playbackRate.value = 1.0;
                source.connect(ctx.destination);
            }

            source.onended = () => {
                setIsPlaying(false);
                ctx.close().catch(() => {});
            };

            source.start(0);
        } catch (err) {
            console.error("Synthesizer error:", err);
            setIsPlaying(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-stone-950 font-sans selection:bg-amber-500/30 selection:text-white pb-20 overflow-hidden">
            <Cursor />

            {/* Background Vibe Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                        background: `radial-gradient(circle at 50% 30%, ${selectedDino.bgGlow} 0%, rgba(12, 10, 9, 0.95) 75%)`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-stone-950 pointer-events-none" />
            </div>

            {/* Site Navigation Navbar */}
            <div className="relative z-50">
                <Navbar />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto pt-28 px-4 sm:px-6">
                
                {/* Header Action Bar */}
                <div className="flex items-center justify-between mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBackToHub}
                        className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs font-bold text-gray-200 backdrop-blur-xl transition hover:border-white/40 hover:text-white cursor-pointer shadow-lg"
                    >
                        <ArrowLeft size={16} />
                        <span>Game Center</span>
                    </motion.button>

                    <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-4 py-2 text-xs font-bold text-amber-300 backdrop-blur-xl">
                        <Sparkles size={14} className="animate-pulse text-amber-400" />
                        <span>Dino Voice Lab • Interactive Sound Studio</span>
                    </div>
                </div>

                {/* Dinosaur Selector Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {DINOSAURS.map((dino) => {
                        const isSelected = selectedDino.id === dino.id;
                        return (
                            <motion.button
                                key={dino.id}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    setSelectedDino(dino);
                                    setHasRecorded(false);
                                    setShowCompletionCard(false);
                                }}
                                className={`rounded-2xl p-3 sm:p-4 text-left border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                                    isSelected
                                        ? "bg-black/80 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                                        : "bg-black/40 border-white/10 hover:border-white/25 hover:bg-black/60"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={dino.image}
                                        alt={dino.name}
                                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-white/15"
                                    />
                                    <div>
                                        <h4 className="font-serif text-sm font-bold text-white leading-tight">
                                            {dino.name}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
                                            {dino.tagline}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Main Interactive Studio Stage */}
                <div className="relative rounded-3xl border border-white/15 bg-black/65 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-8 text-center">
                    
                    {/* Dinosaur Visual Representation */}
                    <div className="relative flex flex-col items-center justify-center">
                        
                        {/* Animated Mouth-Opening Dinosaur Sprite Frame */}
                        <motion.div
                            animate={
                                isPlaying
                                    ? { scale: [1, 1.10, 1], rotate: [0, -4, 4, 0] }
                                    : isRecording
                                    ? { scale: [1, 1.04, 1] }
                                    : { y: [0, -6, 0] }
                            }
                            transition={{
                                duration: isPlaying ? 0.35 : isRecording ? 0.6 : 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="relative h-56 sm:h-72 w-56 sm:w-72 flex items-center justify-center"
                        >
                            <div
                                className="absolute inset-0 rounded-full blur-3xl opacity-60 transition-colors duration-500"
                                style={{ backgroundColor: selectedDino.bgGlow }}
                            />

                            <img
                                src={selectedDino.image}
                                alt={selectedDino.name}
                                className={`relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] transition-all duration-300 ${
                                    isPlaying ? "scale-110 brightness-110" : ""
                                }`}
                            />

                            {/* Soundwave animation overlay when playing */}
                            {isPlaying && (
                                <div className="absolute -top-4 inset-x-0 flex items-center justify-center gap-1.5 z-20">
                                    {[40, 70, 100, 60, 90, 50, 80, 40].map((height, idx) => (
                                        <motion.div
                                            key={`wave-${idx}`}
                                            animate={{ height: ["12px", `${height}px`, "12px"] }}
                                            transition={{ duration: 0.35, repeat: Infinity, delay: idx * 0.05 }}
                                            className="w-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]"
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-extrabold text-white">
                            “What do you think I sounded like?”
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-md mt-1">
                            Record your voice or play <strong style={{ color: selectedDino.color }}>{selectedDino.name}'s</strong> prehistoric roar!
                        </p>
                    </div>

                    {/* Microphone Fallback Warning */}
                    {micPermissionDenied && (
                        <div className="mx-auto max-w-md rounded-2xl border border-amber-500/40 bg-amber-950/40 p-3 text-xs text-amber-200 flex items-center gap-2">
                            <Volume2 size={16} className="text-amber-400 shrink-0" />
                            <span>Microphone muted or unavailable. A custom dinosaur roar generator has been loaded for you!</span>
                        </div>
                    )}

                    {/* Three Main Controls Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        
                        {/* 1. Record Voice Control */}
                        {!isRecording ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startRecording}
                                className="flex items-center gap-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 px-6 py-4 text-sm font-extrabold text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition cursor-pointer"
                            >
                                <Mic size={20} />
                                <span>🎙 Record Voice (5s)</span>
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={stopRecording}
                                className="flex items-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 px-6 py-4 text-sm font-extrabold text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] transition cursor-pointer animate-pulse"
                            >
                                <Square size={18} />
                                <span>Stop Recording ({recordTimeLeft}s)</span>
                            </motion.button>
                        )}

                        {/* 2. Play My Roar Control (ALWAYS ACTIVE) */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isRecording}
                            onClick={playRoar}
                            className={`flex items-center gap-2.5 rounded-2xl px-6 py-4 text-sm font-extrabold transition cursor-pointer border ${
                                isPlaying
                                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                                    : "bg-black/80 hover:bg-black text-white border-white/30 hover:border-emerald-400 shadow-lg"
                            }`}
                        >
                            <Play size={18} className={isPlaying ? "fill-current" : ""} />
                            <span>{isPlaying ? "Roaring..." : hasRecorded ? "▶ Play My Voice Roar" : "▶ Play Dinosaur Roar"}</span>
                        </motion.button>

                        {/* 3. Voice Effect Selector */}
                        <div className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-black/60 p-1.5">
                            <span className="px-2 text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                <Sliders size={12} />
                                Effect:
                            </span>
                            {[
                                { id: "original", label: "Original" },
                                { id: "deep", label: "Deep Pitch" },
                                { id: "echo", label: "Cave Echo" },
                            ].map((eff) => (
                                <button
                                    key={eff.id}
                                    onClick={() => setVoiceEffect(eff.id)}
                                    className={`rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                                        voiceEffect === eff.id
                                            ? "bg-amber-500 text-slate-950 shadow-md"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    {eff.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Did You Know Educational Callout Card */}
                    <AnimatePresence>
                        {showCompletionCard && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="mx-auto max-w-xl rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/70 via-stone-900/90 to-black p-6 shadow-2xl text-left space-y-4"
                            >
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                                    <Sparkles size={16} />
                                    <span>YOUR DINO HAS A VOICE!</span>
                                </div>

                                <p className="text-sm text-amber-100 leading-relaxed font-medium">
                                    We don't know exactly how dinosaurs sounded. Your roar is one possibility from your imagination!
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-500/20">
                                    <button
                                        onClick={startRecording}
                                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                                    >
                                        <RefreshCw size={14} />
                                        <span>Try Again</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            const nextIdx = (DINOSAURS.findIndex((d) => d.id === selectedDino.id) + 1) % DINOSAURS.length;
                                            setSelectedDino(DINOSAURS[nextIdx]);
                                            setHasRecorded(false);
                                            setShowCompletionCard(false);
                                        }}
                                        className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md transition cursor-pointer"
                                    >
                                        <span>Choose Another Dino</span>
                                    </button>

                                    <button
                                        onClick={onBackToHub}
                                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition cursor-pointer"
                                    >
                                        <span>Game Center</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
