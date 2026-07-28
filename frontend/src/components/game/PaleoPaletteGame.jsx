import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush, Eraser, Sparkles, RotateCcw, ArrowLeft, Check, Flame, Grid } from "lucide-react";
import Navbar from "../home_components/hero/Navbar";
import Cursor from "./Cursor";

const PALEO_COLORS = [
    { name: "Prehistoric Gold", hex: "#F59E0B" },
    { name: "Volcanic Crimson", hex: "#EF4444" },
    { name: "Jungle Emerald", hex: "#10B981" },
    { name: "Cyan Lagoon", hex: "#06B6D4" },
    { name: "Terracotta Earth", hex: "#EA580C" },
    { name: "Amethyst Violet", hex: "#8B5CF6" },
    { name: "Ancient Sand", hex: "#D97706" },
    { name: "Paleo Bone White", hex: "#FFFFFF" },
];

const BRUSH_SIZES = [
    { label: "Fine", size: 6 },
    { label: "Medium", size: 14 },
    { label: "Bold", size: 30 },
];

const PATTERNS = [
    { id: "solid", label: "Solid" },
    { id: "spots", label: "Spots" },
    { id: "stripes", label: "Stripes" },
];

const DINOSAUR_OUTLINES = [
    {
        id: "trex",
        name: "Tyrannosaurus Rex",
        tagline: "The King of Paleoart",
        path: (ctx, width, height) => {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            
            // Draw T-Rex Outline Path
            ctx.beginPath();
            // Head & Jaw
            ctx.moveTo(width * 0.72, height * 0.22);
            ctx.lineTo(width * 0.88, height * 0.24);
            ctx.lineTo(width * 0.86, height * 0.35);
            ctx.lineTo(width * 0.70, height * 0.34);
            // Neck & Back
            ctx.quadraticCurveTo(width * 0.55, height * 0.22, width * 0.35, height * 0.35);
            // Tail
            ctx.quadraticCurveTo(width * 0.18, height * 0.45, width * 0.08, height * 0.60);
            ctx.quadraticCurveTo(width * 0.20, height * 0.65, width * 0.32, height * 0.55);
            // Legs
            ctx.lineTo(width * 0.36, height * 0.80);
            ctx.lineTo(width * 0.44, height * 0.80);
            ctx.lineTo(width * 0.48, height * 0.58);
            ctx.lineTo(width * 0.54, height * 0.80);
            ctx.lineTo(width * 0.62, height * 0.80);
            ctx.lineTo(width * 0.64, height * 0.52);
            // Chest & Arms
            ctx.lineTo(width * 0.72, height * 0.48);
            ctx.lineTo(width * 0.74, height * 0.44);
            ctx.lineTo(width * 0.68, height * 0.44);
            ctx.lineTo(width * 0.72, height * 0.22);
            ctx.stroke();

            // Eye & Teeth details
            ctx.beginPath();
            ctx.arc(width * 0.78, height * 0.26, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            ctx.restore();
        },
    },
    {
        id: "triceratops",
        name: "Triceratops",
        tagline: "Three-Horned Herbivore Shield",
        path: (ctx, width, height) => {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            // Frill & Horns
            ctx.moveTo(width * 0.70, height * 0.20);
            ctx.quadraticCurveTo(width * 0.82, height * 0.15, width * 0.88, height * 0.28);
            ctx.lineTo(width * 0.95, height * 0.35); // Nose Horn
            ctx.lineTo(width * 0.85, height * 0.45); // Beak
            ctx.lineTo(width * 0.72, height * 0.45);
            // Back & Body
            ctx.quadraticCurveTo(width * 0.50, height * 0.30, width * 0.28, height * 0.42);
            // Tail
            ctx.quadraticCurveTo(width * 0.15, height * 0.52, width * 0.08, height * 0.65);
            ctx.quadraticCurveTo(width * 0.22, height * 0.68, width * 0.32, height * 0.60);
            // 4 Legs
            ctx.lineTo(width * 0.34, height * 0.82);
            ctx.lineTo(width * 0.42, height * 0.82);
            ctx.lineTo(width * 0.46, height * 0.62);
            ctx.lineTo(width * 0.58, height * 0.82);
            ctx.lineTo(width * 0.66, height * 0.82);
            ctx.lineTo(width * 0.70, height * 0.45);
            ctx.stroke();

            // Brow Horns
            ctx.beginPath();
            ctx.moveTo(width * 0.76, height * 0.28);
            ctx.lineTo(width * 0.88, height * 0.18);
            ctx.stroke();

            ctx.restore();
        },
    },
    {
        id: "stegosaurus",
        name: "Stegosaurus",
        tagline: "Plated Tail-Thagomizer Titan",
        path: (ctx, width, height) => {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            // Small Head
            ctx.moveTo(width * 0.88, height * 0.55);
            ctx.lineTo(width * 0.94, height * 0.60);
            ctx.lineTo(width * 0.86, height * 0.64);
            // Arching Back
            ctx.quadraticCurveTo(width * 0.55, height * 0.25, width * 0.25, height * 0.48);
            // Tail with Spikes
            ctx.lineTo(width * 0.06, height * 0.52);
            ctx.lineTo(width * 0.22, height * 0.62);
            // 4 Legs
            ctx.lineTo(width * 0.28, height * 0.82);
            ctx.lineTo(width * 0.36, height * 0.82);
            ctx.lineTo(width * 0.42, height * 0.65);
            ctx.lineTo(width * 0.62, height * 0.82);
            ctx.lineTo(width * 0.70, height * 0.82);
            ctx.lineTo(width * 0.76, height * 0.60);
            ctx.lineTo(width * 0.88, height * 0.55);
            ctx.stroke();

            // Dorsal Plates
            const platePos = [0.35, 0.45, 0.55, 0.65, 0.75];
            platePos.forEach((p) => {
                ctx.beginPath();
                ctx.moveTo(width * p - 12, height * 0.40);
                ctx.lineTo(width * p, height * 0.25);
                ctx.lineTo(width * p + 12, height * 0.40);
                ctx.stroke();
            });

            ctx.restore();
        },
    },
];

export default function PaleoPaletteGame({ onBackToHub }) {
    const [selectedDino, setSelectedDino] = useState(DINOSAUR_OUTLINES[0]);
    const [selectedColor, setSelectedColor] = useState(PALEO_COLORS[0].hex);
    const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);
    const [isEraser, setIsEraser] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState("solid");
    const [isDrawing, setIsDrawing] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [completedImage, setCompletedImage] = useState(null);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const historyRef = useRef([]);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set high-DPI scaling
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;

        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        contextRef.current = ctx;

        // Fill background
        ctx.fillStyle = "#0c100d";
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Draw Dinosaur Outline
        selectedDino.path(ctx, rect.width, rect.height);

        // Save initial state to history
        saveHistory();
    }, [selectedDino]);

    // Redraw outline over user drawing so line-art stays clear
    const redrawOutline = () => {
        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;
        const ctx = contextRef.current;
        const rect = canvas.getBoundingClientRect();
        selectedDino.path(ctx, rect.width, rect.height);
    };

    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (historyRef.current.length > 15) historyRef.current.shift();
        historyRef.current.push(canvas.toDataURL());
    };

    const handleUndo = () => {
        if (historyRef.current.length <= 1) return;
        historyRef.current.pop(); // Remove current
        const prevState = historyRef.current[historyRef.current.length - 1];
        const img = new Image();
        img.src = prevState;
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = contextRef.current;
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
        };
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = "#0c100d";
        ctx.fillRect(0, 0, rect.width, rect.height);
        selectedDino.path(ctx, rect.width, rect.height);
        saveHistory();
    };

    // Drawing Handlers
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = contextRef.current;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);

        draw(e);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = contextRef.current;
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (isEraser) {
            ctx.strokeStyle = "#0c100d";
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (selectedPattern === "spots") {
            // Stipple Dots pattern
            ctx.fillStyle = selectedColor;
            for (let i = 0; i < 5; i++) {
                const rx = x + (Math.random() - 0.5) * brushSize * 1.5;
                const ry = y + (Math.random() - 0.5) * brushSize * 1.5;
                ctx.beginPath();
                ctx.arc(rx, ry, brushSize / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (selectedPattern === "stripes") {
            // Dash stripes pattern
            ctx.strokeStyle = selectedColor;
            ctx.setLineDash([brushSize, brushSize * 0.8]);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.setLineDash([]);
        } else {
            // Solid stroke
            ctx.strokeStyle = selectedColor;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        redrawOutline();
        saveHistory();
    };

    const handleFinish = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setCompletedImage(canvas.toDataURL());
            setShowFinishModal(true);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#070b08] font-sans selection:bg-emerald-500/30 selection:text-white pb-20 overflow-hidden">
            <Cursor />

            {/* Background Vibe Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                        background: `radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.18) 0%, rgba(7, 11, 8, 0.95) 75%)`
                    }}
                />
            </div>

            {/* Navbar */}
            <div className="relative z-50">
                <Navbar />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto pt-28 px-4 sm:px-6 space-y-6">
                
                {/* Header Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBackToHub}
                        className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-5 py-2.5 text-xs font-bold text-gray-200 backdrop-blur-xl transition hover:border-white/40 hover:text-white cursor-pointer shadow-lg"
                    >
                        <ArrowLeft size={16} />
                        <span>Game Center</span>
                    </motion.button>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur-xl">
                        <Sparkles size={14} className="animate-pulse text-emerald-400" />
                        <span>Paleo Palette • Prehistoric Coloring Studio</span>
                    </div>
                </div>

                {/* Dinosaur Selector Tabs */}
                <div className="grid grid-cols-3 gap-3">
                    {DINOSAUR_OUTLINES.map((dino) => {
                        const isSelected = selectedDino.id === dino.id;
                        return (
                            <motion.button
                                key={dino.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedDino(dino);
                                    setShowFinishModal(false);
                                }}
                                className={`rounded-2xl p-3 text-center border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                                    isSelected
                                        ? "bg-emerald-950/70 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        : "bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-black/60"
                                }`}
                            >
                                <h4 className="font-serif text-xs sm:text-sm font-bold">{dino.name}</h4>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Main Canvas Drawing Stage */}
                <div className="rounded-3xl border border-white/15 bg-black/70 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-6">
                    
                    {/* Interactive Canvas Container */}
                    <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-[#0c100d] shadow-inner flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-full cursor-crosshair touch-none"
                        />
                    </div>

                    {/* Toolbar Palette Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-white/10">
                        
                        {/* 1. Prehistoric Color Picker */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider block">
                                🎨 Prehistoric Color Palette
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {PALEO_COLORS.map((col) => (
                                    <button
                                        key={col.hex}
                                        onClick={() => {
                                            setSelectedColor(col.hex);
                                            setIsEraser(false);
                                        }}
                                        className={`h-8 w-8 rounded-full transition-transform cursor-pointer border ${
                                            selectedColor === col.hex && !isEraser
                                                ? "scale-125 border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                                                : "border-white/20 hover:scale-110"
                                        }`}
                                        style={{ backgroundColor: col.hex }}
                                        title={col.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 2. Brush Size & Mode Controls */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider block">
                                🖌 Brush & Eraser Mode
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsEraser(false)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer border ${
                                        !isEraser
                                            ? "bg-emerald-500 text-slate-950 border-emerald-400"
                                            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <Paintbrush size={14} />
                                    <span>Brush</span>
                                </button>

                                <button
                                    onClick={() => setIsEraser(true)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer border ${
                                        isEraser
                                            ? "bg-amber-500 text-slate-950 border-amber-400"
                                            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    <Eraser size={14} />
                                    <span>Eraser</span>
                                </button>

                                <div className="h-6 w-[1px] bg-white/15 mx-1" />

                                {BRUSH_SIZES.map((b) => (
                                    <button
                                        key={b.label}
                                        onClick={() => setBrushSize(b.size)}
                                        className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                            brushSize === b.size
                                                ? "bg-white text-black font-extrabold"
                                                : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {b.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Texture Pattern & Actions */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider block">
                                ✨ Texture Pattern & Canvas Actions
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {PATTERNS.map((pat) => (
                                    <button
                                        key={pat.id}
                                        onClick={() => {
                                            setSelectedPattern(pat.id);
                                            setIsEraser(false);
                                        }}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                                            selectedPattern === pat.id && !isEraser
                                                ? "bg-emerald-950 text-emerald-300 border-emerald-400"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                                        }`}
                                    >
                                        {pat.label}
                                    </button>
                                ))}

                                <button
                                    onClick={handleUndo}
                                    className="rounded-xl bg-white/5 hover:bg-white/10 p-2 text-gray-300 transition cursor-pointer border border-white/10"
                                    title="Undo Stroke"
                                >
                                    <RotateCcw size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Finish Dinosaur Button */}
                    <div className="pt-4 text-center">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleFinish}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition cursor-pointer mx-auto"
                        >
                            <Sparkles size={18} />
                            <span>✨ FINISH MY DINOSAUR</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Finish Showcase Modal Overlay */}
            <AnimatePresence>
                {showFinishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0c1f15] via-[#07140e] to-black p-6 sm:p-8 text-white shadow-2xl space-y-5 text-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                                <Sparkles size={16} />
                                <span>PALEOARTWORK COMPLETE</span>
                            </div>

                            <h3 className="font-serif text-3xl font-black text-emerald-100">
                                YOUR PALEOART IS COMPLETE!
                            </h3>

                            {/* Completed Canvas Artwork Frame */}
                            {completedImage && (
                                <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/60 p-2 shadow-xl">
                                    <img
                                        src={completedImage}
                                        alt="Completed Paleoart"
                                        className="h-48 w-full object-contain rounded-xl"
                                    />
                                </div>
                            )}

                            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                                We don't know the exact colours of many dinosaurs. Scientists use fossils and other evidence to discover clues about their appearance.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-emerald-500/20">
                                <button
                                    onClick={() => {
                                        setShowFinishModal(false);
                                        handleClear();
                                    }}
                                    className="rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                                >
                                    Color Again
                                </button>

                                <button
                                    onClick={() => {
                                        const nextIdx = (DINOSAUR_OUTLINES.findIndex((d) => d.id === selectedDino.id) + 1) % DINOSAUR_OUTLINES.length;
                                        setSelectedDino(DINOSAUR_OUTLINES[nextIdx]);
                                        setShowFinishModal(false);
                                    }}
                                    className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-md transition cursor-pointer"
                                >
                                    Next Dinosaur
                                </button>

                                <button
                                    onClick={onBackToHub}
                                    className="rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 text-xs font-bold text-gray-300 hover:text-white transition cursor-pointer"
                                >
                                    Game Center
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
