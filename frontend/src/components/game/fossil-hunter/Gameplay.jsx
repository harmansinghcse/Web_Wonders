import {
    ArrowLeft,
    RefreshCw,
    Volume2,
    VolumeX,
    Compass,
} from "lucide-react";

export default function Gameplay({
    difficulty,
    gameState,
    attempts,
    maxAttempts,

    fossilsFound,
    totalFossils,

    score,

    grid,

    discoveredLogs,

    soundEnabled,

    handleTileClick,

    initGrid,

    setGameState,
    setSoundEnabled,

    onBackToHub,
}) {
    return(
        <>
            {/* Top HUD Header */}
            <div className="flex items-center justify-between bg-[#192b1e]/95 border border-[#2b4c34] rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                    <button
                        onClick={onBackToHub || (() => setGameState("landing"))}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer hover:scale-105"
                        title="Return to Game Center"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-lg sm:text-xl font-serif font-black text-amber-200 uppercase tracking-wider">
                                FOSSIL EXCAVATOR
                            </h1>
                            <span className="bg-[#52B788]/20 border border-[#52B788]/50 px-3 py-0.5 rounded-full text-xs font-black text-[#52B788] uppercase tracking-wider">
                                {difficulty}
                            </span>
                        </div>
                        <p className="text-xs text-emerald-300/90 font-medium">Unearth ancient dinosaur bones!</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                    <div className="bg-[#0b160f] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[80px]">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Digs Left</span>
                        <span className="text-lg font-mono font-black text-amber-300">{attempts} / {maxAttempts}</span>
                    </div>
                    <div className="bg-[#0b160f] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[80px]">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Fossils</span>
                        <span className="text-lg font-mono font-black text-emerald-400">{fossilsFound} / {totalFossils}</span>
                    </div>
                    <div className="bg-[#0b160f] px-4 py-2 rounded-xl border border-[#2b4c34] text-center min-w-[80px]">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Score</span>
                        <span className="text-lg font-mono font-black text-white">{score}</span>
                    </div>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                        {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                    </button>
                </div>
            </div>

            {/* Main Play Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Dig Site Grid */}
                <div className="lg:col-span-8 bg-[#18291c]/90 border border-[#2b4c34] rounded-2xl p-6 shadow-2xl flex flex-col items-center backdrop-blur-md">
                    <h2 className="text-base font-serif font-bold text-amber-300 tracking-wider uppercase mb-5 flex items-center gap-2">
                        <Compass size={20} />
                        <span>EXCAVATION GRID (CLICK TILE TO DIG)</span>
                    </h2>

                    <div className="grid grid-cols-5 gap-3.5 w-full max-w-lg aspect-square">
                        {grid.map((tile, idx) => (
                            <button
                                key={tile.id}
                                onClick={() => handleTileClick(idx)}
                                disabled={tile.revealed || attempts <= 0 || gameState === "gameover"}
                                className={`relative w-full h-full rounded-2xl border-2 transition-all duration-300 flex items-center justify-center text-3xl shadow-lg cursor-pointer ${
                                    !tile.revealed
                                        ? "bg-gradient-to-b from-[#4a3f31] to-[#2e261c] border-[#6b5a45] hover:border-amber-400 hover:scale-105"
                                        : tile.content === "fossil"
                                        ? "bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
                                        : tile.content === "rock"
                                        ? "bg-stone-800 border-red-500/50"
                                        : "bg-[#142017] border-[#203a27]"
                                }`}
                            >
                                {!tile.revealed ? (
                                    <span className="opacity-60 text-sm font-mono font-bold text-amber-200">⛏️</span>
                                ) : tile.content === "fossil" ? (
                                    <span className="animate-bounce" style={{ animationDuration: "2s" }}>
                                        {tile.fossilInfo.icon}
                                    </span>
                                ) : tile.content === "rock" ? (
                                    <span>🪨</span>
                                ) : (
                                    <span className="text-stone-600 text-sm font-bold">·</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Excavation Log & Actions */}
                <div className="lg:col-span-4 bg-[#18291c]/90 border border-[#2b4c34] rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-5 backdrop-blur-md">
                    <div>
                        <h3 className="text-sm font-serif font-bold text-amber-300 uppercase tracking-wider mb-3">
                            EXCAVATION LOG
                        </h3>
                        <div className="bg-[#0e1710] border border-white/10 rounded-xl p-3.5 h-56 overflow-y-auto space-y-2 text-xs font-mono">
                            {discoveredLogs.length === 0 ? (
                                <p className="text-gray-500 italic">No digs recorded yet. Click tiles to excavate!</p>
                            ) : (
                                discoveredLogs.map((log, index) => (
                                    <p key={index} className="text-emerald-300 border-b border-white/5 pb-1 leading-relaxed">
                                        {log}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        <button
                            onClick={() => initGrid(difficulty)}
                            className="w-full py-3.5 rounded-xl bg-[#52B788] text-[#0a180e] hover:bg-[#66d29f] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                            <RefreshCw size={18} />
                            <span>Reset Site</span>
                        </button>

                        <button
                            onClick={() => setGameState("landing")}
                            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                            Change Level
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
}