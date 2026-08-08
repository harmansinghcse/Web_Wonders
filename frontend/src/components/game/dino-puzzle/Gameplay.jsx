import {
    ArrowLeft,
    RotateCcw,
    Trophy,
    Timer,
    Volume2,
    VolumeX,
    Puzzle,
    Check,
    HelpCircle,
    Eye,
    Image as ImageIcon,
} from "lucide-react";

export default function Gameplay({
    board,
    gridSize,

    selectedDino,

    selectedSlot,
    isSolved,

    moves,
    time,

    currentBest,
    difficultyLabel,
    totalPieces,

    piecePaths,

    soundEnabled,

    handleSlotClick,
    handleDragStart,
    handleDragOver,
    handleDrop,

    initializeGame,

    setGameState,
    setSoundEnabled,
    showPreview,
    setShowPreview,

    formatTime,
}) {
    return (
        <div>
            {/* Header Controls */}
            <header className="relative z-10 max-w-6xl mx-auto pt-6 px-4 sm:px-6 flex items-center justify-between">
                <button
                    onClick={() => setGameState("landing")}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-sm font-bold backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
                >
                    <ArrowLeft size={18} />
                    <span>PUZZLE MENU</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSoundEnabled((prev) => !prev)}
                        className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 transition cursor-pointer"
                        title={soundEnabled ? "Mute sound" : "Enable sound"}
                    >
                        {soundEnabled ? <Volume2 size={18} className="text-purple-400" /> : <VolumeX size={18} className="text-stone-400" />}
                    </button>
                    <button
                        onClick={initializeGame}
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-600/80 hover:bg-purple-500 border border-purple-400/40 text-white text-sm font-bold shadow-lg transition cursor-pointer hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={16} />
                        <span>RESHUFFLE</span>
                    </button>
                </div>
            </header>

            {/* Main Game Arena */}
            <main className="relative z-10 max-w-5xl mx-auto mt-6 px-4 sm:px-6 flex flex-col items-center">
                
                {/* Title & Badge */}
                <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black tracking-widest uppercase">
                        <Puzzle size={14} className="text-purple-400" />
                        <span>{selectedDino.name} • {difficultyLabel.toUpperCase()} ({gridSize}×{gridSize} • {totalPieces} Pieces)</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight drop-shadow-md">
                        JURASSIC JIGSAW PUZZLE
                    </h1>
                </div>

                {/* Dashboard Bar: Stats & Controls */}
                <div className="w-full max-w-2xl bg-purple-950/40 border border-purple-500/30 rounded-3xl p-4 backdrop-blur-xl mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shadow-xl">
                    <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                            <Puzzle size={13} className="text-purple-400" />
                            <span>MOVES</span>
                        </div>
                        <p className="text-lg font-black text-white mt-0.5">{moves}</p>
                    </div>

                    <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                            <Timer size={13} className="text-purple-400" />
                            <span>TIME</span>
                        </div>
                        <p className="text-lg font-black text-white mt-0.5">{formatTime(time)}</p>
                    </div>

                    <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase">
                            <Trophy size={13} className="text-amber-400" />
                            <span>BEST ({difficultyLabel})</span>
                        </div>
                        <p className="text-xs font-bold text-amber-300 mt-1">
                            {currentBest ? `${currentBest.moves} m (${formatTime(currentBest.time)})` : "--"}
                        </p>
                    </div>

                    <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-2.5 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                            title="Preview target artwork"
                        >
                            <Eye size={14} />
                            <span>PREVIEW</span>
                        </button>
                    </div>
                </div>

                {/* Instructions Bar */}
                <div className="w-full max-w-2xl flex items-center justify-between gap-3 mb-6 bg-black/40 border border-white/10 p-3 rounded-2xl backdrop-blur-md text-xs text-purple-200/90 font-medium">
                    <span className="flex items-center gap-1.5">
                        <HelpCircle size={14} className="text-amber-400 shrink-0" />
                        <span>Click two jigsaw pieces to swap them, or drag & drop onto any slot!</span>
                    </span>
                </div>

                {/* JIGSAW PUZZLE BOARD CANVAS - SEAMLESS ZERO GAP */}
                <div className="relative p-2.5 sm:p-4 rounded-3xl bg-gradient-to-b from-[#2a133d] via-[#1a082b] to-[#0a0412] border-2 border-purple-500/40 shadow-[0_25px_60px_rgba(168,85,247,0.35)] backdrop-blur-2xl">
                    <div
                        className="grid gap-0 rounded-2xl overflow-hidden bg-stone-950 border border-purple-500/30 relative"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                            width: "min(92vw, 560px)",
                            height: "min(92vw, 560px)",
                        }}
                    >
                        {board.map((pieceId, slotIdx) => {
                            const isSelected = selectedSlot === slotIdx;
                            const isCorrect = pieceId === slotIdx;

                            // Piece row & col in original image
                            const origRow = Math.floor(pieceId / gridSize);
                            const origCol = pieceId % gridSize;

                            const svgPath = piecePaths[pieceId];

                            return (
                                <div
                                    key={slotIdx}
                                    onClick={() => handleSlotClick(slotIdx)}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, slotIdx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, slotIdx)}
                                    className={`relative w-full h-full transition-all duration-200 select-none cursor-pointer overflow-visible ${
                                        isSelected
                                            ? "scale-105 z-30 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]"
                                            : "hover:scale-[1.02] hover:z-20 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
                                    }`}
                                >
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="w-full h-full overflow-visible"
                                    >
                                        <defs>
                                            <clipPath id={`jigsaw-clip-${pieceId}`}>
                                                <path d={svgPath} />
                                            </clipPath>
                                        </defs>

                                        {/* Image clipped to jigsaw shape */}
                                        <image
                                            href={selectedDino.src}
                                            x={-origCol * 100}
                                            y={-origRow * 100}
                                            width={gridSize * 100}
                                            height={gridSize * 100}
                                            clipPath={`url(#jigsaw-clip-${pieceId})`}
                                            preserveAspectRatio="none"
                                        />

                                        {/* Outer jigsaw outline stroke */}
                                        <path
                                            d={svgPath}
                                            fill="none"
                                            stroke={isSelected ? "#f59e0b" : isCorrect ? "rgba(82,183,136,0.6)" : "rgba(0,0,0,0.65)"}
                                            strokeWidth={isSelected ? "3" : "2"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    {/* Correct position indicator checkmark */}
                                    {isCorrect && !isSolved && (
                                        <div className="absolute top-1 right-1 bg-emerald-500/90 text-slate-950 p-0.5 rounded-full shadow-md z-30 pointer-events-none">
                                            <Check size={10} className="stroke-[3]" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* FULL UNIFIED COMPLETED ARTWORK OVERLAY (ON GRID FIRST BEFORE POPUP) */}
                        {isSolved && (
                            <div className="absolute inset-0 z-40 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.8)] animate-in fade-in zoom-in-95 duration-500">
                                <img src={selectedDino.src} alt={selectedDino.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-4">
                                    <span className="bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full shadow-xl animate-bounce">
                                        ✨ PUZZLE COMPLETED! ✨
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Target Image Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
                    <div className="max-w-md w-full rounded-3xl bg-[#1a0c2e] border border-purple-500/40 p-6 text-center shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                                <ImageIcon size={18} className="text-purple-400" />
                                Target Artwork Preview
                            </h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-purple-400/40 shadow-lg">
                            <img src={selectedDino.src} alt={selectedDino.name} className="w-full h-64 object-cover" />
                        </div>

                        <div>
                            <h4 className="font-bold text-white text-base">{selectedDino.name}</h4>
                            <p className="text-xs text-purple-300/80">{selectedDino.period} • {selectedDino.role}</p>
                        </div>

                        <button
                            onClick={() => setShowPreview(false)}
                            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase tracking-wider transition cursor-pointer"
                        >
                            BACK TO PUZZLE
                        </button>
                    </div>
                </div>
            )}
        </div>
        
    );
}

                    
