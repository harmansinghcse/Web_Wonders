/* ACTIVE GAMEPLAY SCREEN */
import {
    ArrowLeft,
    Clock,
    Sparkles,
    Star,
    Lightbulb,
    Pause,
    Menu as MenuIcon,
} from "lucide-react";

export default function Gameplay({
    cards,
    flippedIndices,
    matchedIds,
    moves,
    timer,
    hintsRemaining,
    gameState,
    matchOverlay,
    recentFact,
    imageErrors,
    difficulty,

    handleCardClick,
    handleUseHint,

    calculateScore,
    formatTime,
    getPairCount,

    setGameState,
    setImageErrors,

    onBackToHub,
}){
    return (
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
    );
}                
                    
