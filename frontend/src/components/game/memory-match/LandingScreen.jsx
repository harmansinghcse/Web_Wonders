// LANDING / HERO SCREEN
import Navbar from "../../home_components/hero/Navbar";
import {
    Play,
    RotateCcw,
    Award,
    BookOpen,
    Volume2,
    VolumeX,
    ArrowLeft,
} from "lucide-react";

export default function LandingScreen({difficulty, setDifficulty, startNewGame, bestScore, soundEnabled, setSoundEnabled, onBackToHub}){
    return (
        <div className="flex-1 flex flex-col justify-between pt-2">
            
            {/* Top Back Nav Button if coming from Hub */}
            {onBackToHub && (
                <button
                    onClick={onBackToHub}
                    className="inline-flex items-center gap-2 self-start bg-white/80 hover:bg-white text-[#1b3827] px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all mb-4 backdrop-blur-md cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Game Hub</span>
                </button>
            )}

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
                
                {/* Left Column: Text & Start Action */}
                <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left z-10">
                    
                    {/* Jurassic Silhouette Brand Header */}
                    <div className="flex items-center gap-2.5 bg-[#1b3827]/80 border border-[#52B788]/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                        <div className="w-5 h-5 rounded-full bg-[#52B788] flex items-center justify-center text-slate-950 font-bold text-xs">
                            🦖
                        </div>
                        <span className="text-xs sm:text-sm font-serif tracking-widest text-[#52B788] uppercase font-extrabold">
                            JURASSIC WORLD MATCH
                        </span>
                    </div>

                    {/* Main Title */}
                    <div className="space-y-0.5">
                        <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black font-serif tracking-tight text-white drop-shadow-lg leading-none">
                            JURASSIC
                        </h1>
                        <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black font-serif tracking-tight text-[#52B788] drop-shadow-lg leading-none">
                            MEMORY MATCH
                        </h1>
                    </div>

                    {/* Subtitle Text */}
                    <p className="text-base sm:text-xl text-emerald-100 max-w-xl font-medium leading-relaxed drop-shadow">
                        Flip the cards. Match the dinosaurs. <br />
                        Test your memory. Explore the Jurassic world.
                    </p>

                    {/* Difficulty Selector */}
                    <div className="w-full max-w-md bg-[#132317]/90 border border-[#2b4c34] p-4 rounded-2xl backdrop-blur-md shadow-xl text-white">
                        <p className="text-xs font-bold text-[#52B788] uppercase tracking-wider mb-2.5">
                            SELECT DIFFICULTY
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: "easy", name: "Easy", cards: "12 Cards" },
                                { id: "medium", name: "Medium", cards: "16 Cards" },
                                { id: "hard", name: "Hard", cards: "20 Cards" },
                            ].map((diff) => (
                                <button
                                    key={diff.id}
                                    onClick={() => setDifficulty(diff.id)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center cursor-pointer ${
                                        difficulty === diff.id
                                            ? "bg-[#52B788] text-slate-950 shadow-lg scale-105"
                                            : "bg-white/10 text-emerald-200 hover:bg-white/20"
                                    }`}
                                >
                                    <span>{diff.name}</span>
                                    <span className="text-[10px] opacity-80">{diff.cards}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Controls & Audio toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={startNewGame}
                            className="group inline-flex items-center justify-center gap-3 bg-[#52B788] hover:bg-[#66d29f] text-slate-950 px-10 py-4 rounded-2xl font-black text-base tracking-widest uppercase shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                            <Play size={22} className="fill-current text-slate-950 group-hover:scale-110 transition-transform" />
                            <span>START GAME</span>
                            {bestScore > 0 && (
                                <span className="ml-2 text-xs bg-slate-950/20 px-2.5 py-1 rounded-full text-slate-900 border border-slate-950/20 font-bold">
                                    Best: {bestScore}
                                </span>
                            )}
                        </button>
                        
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-4 rounded-2xl bg-[#132317]/90 border border-[#2b4c34] text-emerald-300 hover:bg-white/10 shadow-xl transition-all cursor-pointer"
                            title={soundEnabled ? "Mute Audio" : "Enable Audio"}
                        >
                            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                        </button>
                    </div>

                </div>

                {/* Right Column: Featured Dino Artwork Card Stack */}
                <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px] lg:min-h-[460px]">
                    <div className="relative w-72 h-96 rounded-3xl bg-gradient-to-b from-[#2b251b] via-[#1c1811] to-[#0d0b08] border-4 border-[#8a7b63] p-4 shadow-2xl flex flex-col items-center justify-between rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="w-full flex items-center justify-between text-amber-300 font-serif text-xs font-bold">
                            <span>APEX PREDATOR</span>
                            <span>★ ★ ★ ★ ★</span>
                        </div>
                        <div className="w-52 h-52 rounded-2xl border border-amber-500/30 bg-[#16120c] flex items-center justify-center shadow-inner overflow-hidden my-auto p-2">
                            <img 
                                src="/trex-dino.png" 
                                alt="T-Rex Preview"
                                className="w-full h-full object-contain filter drop-shadow-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden flex-col items-center justify-center text-amber-300">
                                <span className="text-6xl">👑</span>
                                <span className="text-xs font-bold mt-2">TYRANNOSAURUS</span>
                            </div>
                        </div>
                        <div className="w-full bg-[#1b1711] py-2 px-3 rounded-xl border border-amber-500/20 text-center">
                            <p className="text-sm font-serif font-black text-amber-200">TYRANNOSAURUS REX</p>
                            <p className="text-[10px] text-amber-400/80">Late Cretaceous • 12,000 lbs Bite Force</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Info Parchment Cards Banner */}
            <div className="mt-8 mb-4 w-full bg-[#142418]/90 text-[#e4dac6] rounded-3xl p-6 shadow-2xl border border-[#2b4c34] backdrop-blur-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#2b4c34]">
                    
                    {/* Feature 1: MATCH CARDS */}
                    <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                        <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#52B788]/40 flex items-center justify-center bg-[#0c1810]">
                            <RotateCcw size={26} className="text-[#52B788]" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-white">
                                MATCH CARDS
                            </h3>
                            <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                                Find all matching dinosaur pairs
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: EARN POINTS */}
                    <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                        <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#52B788]/40 flex items-center justify-center bg-[#0c1810]">
                            <Award size={26} className="text-[#52B788]" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-white">
                                EARN POINTS
                            </h3>
                            <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                                The faster you match, the higher your score
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: UNLOCK FACTS */}
                    <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
                        <div className="w-14 h-14 shrink-0 rounded-2xl border border-[#52B788]/40 flex items-center justify-center bg-[#0c1810]">
                            <BookOpen size={26} className="text-[#52B788]" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-base sm:text-lg font-serif tracking-wide text-white">
                                UNLOCK FACTS
                            </h3>
                            <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                                Discover amazing facts about dinosaurs
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

                