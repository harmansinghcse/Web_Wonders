import { ArrowLeft, Play } from "lucide-react";

export default function LandingScreen({
    difficulty, 
    setDifficulty,

    initGrid,

    onBackToHub
}) {
    return (
        <main className="relative z-10 max-w-4xl mx-auto pt-28 pb-16 px-4 flex flex-col items-center justify-center min-h-screen text-center space-y-8">
            
            {onBackToHub && (
                <button
                    onClick={onBackToHub}
                    className="inline-flex items-center gap-2 self-start bg-white/10 hover:bg-white/20 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer backdrop-blur-md"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Game Hub</span>
                </button>
            )}

            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#1b3827]/80 border border-[#52B788]/40 px-4 py-1 rounded-full text-xs font-serif font-bold text-[#52B788] uppercase backdrop-blur-md">
                    <span>⛏️ EXCAVATION GAME</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black font-serif text-white uppercase tracking-wider drop-shadow-md">
                    JURASSIC FOSSIL EXCAVATOR
                </h1>
                <p className="text-sm sm:text-base text-emerald-200/90 max-w-lg mx-auto font-medium">
                    Unearth ancient dinosaur bones, avoid dense bedrock hazards, and assemble complete prehistoric skeletons!
                </p>
            </div>

            {/* Difficulty Selection */}
            <div className="w-full max-w-md bg-[#18291c]/95 border border-[#2b4c34] p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-md">
                <h3 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
                    SELECT DIFFICULTY LEVEL
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: "easy", name: "Easy", digs: "20 Digs", fossils: "4 Fossils", rocks: "3 Rocks" },
                        { id: "moderate", name: "Moderate", digs: "15 Digs", fossils: "6 Fossils", rocks: "5 Rocks" },
                        { id: "hard", name: "Hard", digs: "10 Digs", fossils: "8 Fossils", rocks: "7 Rocks" },
                    ].map((diff) => (
                        <button
                            key={diff.id}
                            onClick={() => setDifficulty(diff.id)}
                            className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center space-y-1 cursor-pointer border ${
                                difficulty === diff.id
                                    ? "bg-[#52B788] text-slate-950 border-[#52B788] shadow-lg scale-105"
                                    : "bg-white/5 text-emerald-200 border-white/10 hover:bg-white/10"
                            }`}
                        >
                            <span className="font-extrabold uppercase">{diff.name}</span>
                            <span className="text-[10px] opacity-80">{diff.digs}</span>
                            <span className="text-[9px] opacity-70">{diff.fossils}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => initGrid(difficulty)}
                    className="w-full py-4 rounded-2xl bg-[#52B788] text-slate-950 hover:bg-[#64cca2] font-black text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                    <Play size={18} />
                    <span>START EXCAVATION</span>
                </button>
            </div>

        </main>
    );
}         
            