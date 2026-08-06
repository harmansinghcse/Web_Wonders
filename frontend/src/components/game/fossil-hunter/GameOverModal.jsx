import { RefreshCw } from "lucide-react";
               
export default function GameOverModel({
    gameState,

    difficulty,

    score,

    fossilsFound,
    totalFossils,

    initGrid,

    setDifficulty,
    setGameState,

    onBackToHub,
}) {
    return (
        <>
            {gameState === "gameover" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="w-full max-w-lg bg-gradient-to-b from-[#14261a] to-[#0b160f] border-2 border-emerald-400 rounded-3xl p-8 shadow-[0_0_50px_rgba(82,183,136,0.3)] text-center space-y-6 text-white">
                        <div className="text-6xl mb-1 drop-shadow-lg animate-bounce">
                            {fossilsFound >= totalFossils ? "🦖" : "🦴"}
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="text-3xl font-serif font-black tracking-wider text-amber-300 uppercase drop-shadow">
                                {fossilsFound >= totalFossils ? "LEVEL COMPLETE!" : "EXCAVATION ENDED"}
                            </h2>
                            <p className="text-sm font-medium text-emerald-200/90 italic">
                                {fossilsFound >= totalFossils ? "Excellent excavation, Paleontologist!" : "Nice dig effort! Give it another try."}
                            </p>
                        </div>

                        <div className="bg-[#071109] p-5 rounded-2xl border border-emerald-500/30 grid grid-cols-2 gap-4 font-mono shadow-inner">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-xs text-gray-400 block uppercase font-bold">Total Score</span>
                                <span className="text-2xl font-black text-emerald-400">{score}</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                <span className="text-xs text-gray-400 block uppercase font-bold">Fossils Found</span>
                                <span className="text-2xl font-black text-amber-300">{fossilsFound} / {totalFossils}</span>
                            </div>
                        </div>

                        {/* Three Actions Navigation Grid */}
                        <div className="space-y-3 pt-2">
                            {/* Primary Highlighted Button: NEXT LEVEL */}
                            <button
                                onClick={() => {
                                    if (difficulty === "easy") {
                                        setDifficulty("moderate");
                                        initGrid("moderate");
                                    } else if (difficulty === "moderate") {
                                        setDifficulty("hard");
                                        initGrid("hard");
                                    } else {
                                        // Already on Hard -> Restart Hard or Choose another game
                                        initGrid("hard");
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
                                    onClick={() => initGrid(difficulty)}
                                    className="py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                                >
                                    <RefreshCw size={16} />
                                    <span>TRY AGAIN</span>
                                </button>

                                {/* Secondary Button: GAME CENTER */}
                                <button
                                    onClick={onBackToHub || (() => setGameState("landing"))}
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
        </>
    );
}
                    
                    