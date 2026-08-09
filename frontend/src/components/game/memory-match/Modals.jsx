import { Link } from "react-router-dom";

import {
    RotateCcw,
    BookOpen,
} from "lucide-react";

export default function Modals({
    gameState,
    setGameState,

    matchOverlay,
    
    timer,
    moves,

    difficulty,

    unlockedFacts,

    formatTime,
    calculateScore,

    startNewGame,
    setDifficulty,

    isPreloading,

    onBackToHub,
}){
    return (
        <>
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
            {gameState === "gameover" && !isPreloading && (
                <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-4 flex items-center justify-center min-h-screen bg-black/85 backdrop-blur-md custom-scrollbar">
                    <div className="w-full max-w-lg bg-gradient-to-b from-[#14261a] to-[#0b160f] border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(82,183,136,0.3)] text-center relative text-white space-y-4 my-auto overflow-hidden">
                        
                        {/* Confetti Glow Background */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-2xl mx-auto shadow-inner animate-bounce">
                            🏆
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#52B788] tracking-tight uppercase drop-shadow">
                                LEVEL COMPLETE!
                            </h2>
                            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium italic">
                                Excellent matching! You mastered all prehistoric dinosaur pairs.
                            </p>
                        </div>

                        {/* Stars Rating */}
                        <div className="flex justify-center gap-1.5 text-2xl">
                            <span className="text-amber-400">⭐</span>
                            <span className="text-amber-400">⭐</span>
                            <span className="text-amber-400">⭐</span>
                        </div>

                        {/* Final Stats Summary Grid */}
                        <div className="grid grid-cols-3 gap-3 bg-[#071109] p-4 rounded-2xl border border-emerald-500/30 shadow-inner">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-xs text-gray-400 block uppercase font-bold">Time</span>
                                <span className="text-xl font-bold text-white font-mono">{formatTime(timer)}</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-xs text-gray-400 block uppercase font-bold">Moves</span>
                                <span className="text-xl font-bold text-amber-300 font-mono">{moves}</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-xs text-gray-400 block uppercase font-bold">Score</span>
                                <span className="text-xl font-bold text-emerald-400 font-mono">{calculateScore()}</span>
                            </div>
                        </div>

                        {/* Unlocked Dinosaur Trivia Gallery */}
                        {unlockedFacts.length > 0 && (
                            <div className="text-left">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                                    <BookOpen size={16} />
                                    <span>Unlocked Prehistoric Facts ({unlockedFacts.length})</span>
                                </h3>
                                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                    {unlockedFacts.map((dino) => (
                                        <div key={dino.id} className="bg-[#0b1b11] border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
                                            {dino.image ? (
                                                <img
                                                    src={dino.image}
                                                    alt={dino.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-emerald-500/25 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-emerald-950 flex items-center justify-center text-xl border border-emerald-500/25 shrink-0">
                                                    🦕
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate">{dino.name} ({dino.era})</h4>
                                                <p className="text-[11px] text-gray-300 mt-0.5 line-clamp-2">{dino.fact}</p>
                                                {dino.slug && (
                                                    <Link
                                                        to={`/dinosaur/${dino.slug}`}
                                                        className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-[#52B788] hover:underline uppercase tracking-wider"
                                                    >
                                                        <span>Learn More</span>
                                                        <span>➔</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons Grid */}
                        <div className="space-y-3 pt-2">
                            {/* Primary Highlighted Button: NEXT LEVEL */}
                            <button
                                onClick={() => {
                                    if (difficulty === "easy") {
                                        setDifficulty("moderate");
                                        setTimeout(() => startNewGame(), 100);
                                    } else if (difficulty === "moderate") {
                                        setDifficulty("hard");
                                        setTimeout(() => startNewGame(), 100);
                                    } else {
                                        startNewGame();
                                    }
                                }}
                                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/50 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>▶</span>
                                <span>{difficulty === "hard" ? "PLAY AGAIN (HARD)" : `NEXT LEVEL (${difficulty === "easy" ? "MODERATE" : "HARD"})`}</span>
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Secondary Button: TRY AGAIN */}
                                <button
                                    onClick={startNewGame}
                                    className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                                >
                                    <RotateCcw size={16} />
                                    <span>TRY AGAIN</span>
                                </button>

                                {/* Secondary Button: GAME CENTER */}
                                <button
                                    onClick={() => {
                                        if (onBackToHub) {
                                            onBackToHub();
                                        } else {
                                            setGameState("landing");
                                        }
                                    }}
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

        {/* EDUCATIONAL MATCH OVERLAY */}
            {matchOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="bg-[#122317] border-2 border-[#52B788] rounded-3xl p-6 shadow-2xl text-center space-y-4 max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <span className="text-sm font-bold text-[#52B788] uppercase tracking-wider block">🎉 Match Unlocked! 🎉</span>
                        {matchOverlay.image ? (
                            <img
                                src={matchOverlay.image}
                                alt={matchOverlay.name}
                                className="w-24 h-24 rounded-2xl object-cover border border-[#52B788]/30 mx-auto shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-emerald-950 flex items-center justify-center text-4xl border border-[#52B788]/30 mx-auto shadow-lg">
                                🦕
                            </div>
                        )}
                        <h3 className="text-2xl font-serif font-black text-amber-300">{matchOverlay.name}</h3>
                        <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">{matchOverlay.era} • {matchOverlay.diet}</p>
                        <p className="text-xs text-slate-300 leading-relaxed italic bg-emerald-950/45 p-3 rounded-xl border border-[#2b4c34]/45">
                            "{matchOverlay.fact}"
                        </p>
                    </div>
                </div>
            )}
        </>   
    );
}
                    
                