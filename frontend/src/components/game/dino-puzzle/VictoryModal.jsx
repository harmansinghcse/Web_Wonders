import { Trophy } from "lucide-react";

export default function VictoryModal({
    showVictoryModal,

    difficultyLabel,
    selectedDino,
    totalPieces,

    moves,
    time,

    initializeGame,
    setGameState,

    formatTime,
}) {
    return (
        <>
            {showVictoryModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex items-center justify-center min-h-screen bg-black/85 backdrop-blur-md">
                    <div className="max-w-sm w-full max-h-[88vh] overflow-hidden my-auto rounded-3xl bg-gradient-to-b from-[#2a0e4a] via-[#1a0833] to-[#0e041d] border-2 border-amber-400/60 p-6 text-center shadow-[0_0_60px_rgba(245,158,11,0.4)] space-y-5 relative">
                        
                        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

                        <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-xl animate-bounce">
                            <Trophy size={36} />
                        </div>

                        <div>
                            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
                                JIGSAW PUZZLE SOLVED ({difficultyLabel.toUpperCase()})!
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white mt-2 tracking-tight">
                                {selectedDino.name} Reconstructed!
                            </h2>
                            <p className="text-xs text-purple-200/80 mt-1">
                                Outstanding work, Paleontologist! You assembled all {totalPieces} interlocking pieces flawlessly.
                            </p>
                        </div>

                        {/* Final Stats */}
                        <div className="grid grid-cols-2 gap-3 bg-black/50 border border-white/10 p-3 rounded-2xl font-mono text-sm">
                            <div className="text-center">
                                <span className="text-[10px] text-stone-400 uppercase block font-sans">Swaps Made</span>
                                <span className="text-lg font-bold text-amber-300">{moves}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] text-stone-400 uppercase block font-sans">Time Taken</span>
                                <span className="text-lg font-bold text-emerald-300">{formatTime(time)}</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <button
                                onClick={initializeGame}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-102 active:scale-95"
                            >
                                PLAY AGAIN
                            </button>
                            <button
                                onClick={() => setGameState("landing")}
                                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                            >
                                BACK TO PUZZLE MENU
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}