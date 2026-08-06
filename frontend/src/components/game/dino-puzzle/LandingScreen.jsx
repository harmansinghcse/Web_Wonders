import {
    ArrowLeft,
    Puzzle,
    Play,
} from "lucide-react";

export default function LandingScreen({
    gridSize,
    setGridSize,

    selectedDino,
    setSelectedDino,

    DINO_IMAGES,

    startGame,

    onBackToHub,
}){
    return (
        <main className="relative z-10 max-w-4xl mx-auto pt-28 pb-16 px-4 flex flex-col items-center justify-center min-h-screen text-center space-y-8">
            
            {onBackToHub && (
                <button
                    onClick={onBackToHub}
                    className="inline-flex items-center gap-2 self-start bg-white/15 hover:bg-white/25 text-purple-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-md border border-white/20"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Game Hub</span>
                </button>
            )}

            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#331552]/85 border border-purple-400/50 px-4 py-1.5 rounded-full text-xs font-serif font-bold text-purple-200 uppercase backdrop-blur-md shadow-md">
                    <Puzzle size={15} className="text-purple-300" />
                    <span>PUZZLE & LOGIC</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-lg">
                    JURASSIC DINO PUZZLE TILES
                </h1>
                <p className="text-sm sm:text-base text-purple-100/90 max-w-lg mx-auto font-medium drop-shadow-sm">
                    Choose your artwork and difficulty to reconstruct ancient dinosaur relics in this interlocking jigsaw puzzle!
                </p>
            </div>

            {/* Central Launcher Control Window */}
            <div className="w-full max-w-2xl bg-[#25103d]/90 border border-purple-400/50 p-5 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-5 backdrop-blur-xl">
                
                {/* Select Difficulty Level */}
                <div className="space-y-2.5">
                    <h3 className="text-[11px] sm:text-xs font-serif font-bold text-amber-300 uppercase tracking-widest text-center sm:text-left">
                        SELECT DIFFICULTY LEVEL
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        {[
                            { id: 3, name: "EASY", grid: "3×3 Grid", pieces: "9 Jigsaw Pieces" },
                            { id: 4, name: "MODERATE", grid: "4×4 Grid", pieces: "16 Jigsaw Pieces" },
                            { id: 5, name: "HARD", grid: "5×5 Grid", pieces: "25 Jigsaw Pieces" },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setGridSize(item.id)}
                                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                                    gridSize === item.id
                                        ? item.id === 3
                                            ? "bg-emerald-600/90 border-emerald-400 text-white shadow-lg scale-102"
                                            : item.id === 4
                                            ? "bg-amber-600/90 border-amber-400 text-white shadow-lg scale-102"
                                            : "bg-red-600/90 border-red-400 text-white shadow-lg scale-102"
                                        : "bg-[#180829]/75 border-purple-400/25 text-stone-200 hover:border-purple-300 hover:text-white"
                                }`}
                            >
                                <span className="font-extrabold text-xs sm:text-sm uppercase">{item.name}</span>
                                <span className="text-[10px] opacity-90 mt-0.5 font-medium">{item.grid}</span>
                                <span className="text-[9px] opacity-75">{item.pieces}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Select Dinosaur Artwork */}
                <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] sm:text-xs font-serif font-bold text-purple-200 uppercase tracking-widest">
                            SELECT DINOSAUR ARTWORK
                        </h3>
                        <span className="text-[10px] sm:text-[11px] font-bold text-amber-300">
                            Selected: {selectedDino.name}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {DINO_IMAGES.map((dino) => {
                            const isSelected = selectedDino.id === dino.id;
                            return (
                                <button
                                    key={dino.id}
                                    onClick={() => setSelectedDino(dino)}
                                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer text-left ${
                                        isSelected
                                            ? "border-amber-400 ring-4 ring-amber-400/35 scale-[1.02] shadow-[0_0_25px_rgba(245,158,11,0.4)] z-10"
                                            : "border-white/20 opacity-85 hover:opacity-100 hover:border-purple-300 hover:scale-[1.01]"
                                    }`}
                                >
                                    <div className="h-24 sm:h-28 w-full overflow-hidden relative">
                                        <img
                                            src={dino.src}
                                            alt={dino.name}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
                                                SELECTED ✓
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-2 sm:p-2.5">
                                            <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors drop-shadow-sm truncate">
                                                {dino.name}
                                            </span>
                                            <span className="text-[9px] sm:text-[10px] text-purple-200 font-medium truncate">
                                                {dino.period} • {dino.role}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Start Game Action Button */}
                <button
                    onClick={startGame}
                    className="w-full py-3.5 rounded-2xl bg-[#52B788] hover:bg-[#40a073] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer hover:scale-102 active:scale-95"
                >
                    <Play size={20} className="fill-current" />
                    <span>START PUZZLE GAME</span>
                </button>

            </div>
        </main>
    );
}