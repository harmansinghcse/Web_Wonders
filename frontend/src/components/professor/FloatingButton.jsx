import { Brain } from "lucide-react";

const FloatingButton = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            title="Ask Professor Ross"
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2.5 rounded-full bg-[#164225] pl-4 pr-3.5 py-2.5 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/5 active:scale-95"
        >
            {/* Pulsing Active Status Green Dot */}
            <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#0d2a17] border border-[#22c55e]/20">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
                </span>
            </div>

            {/* Brain Icon */}
            <Brain size={18} className="text-[#F5F2EA] shrink-0" />

            {/* Text Label */}
            <span className="text-sm font-bold tracking-tight text-[#F5F2EA] leading-none select-none font-sans">
                Ask Professor Ross
            </span>

            {/* AI Pill Badge */}
            <span className="text-[9px] font-black uppercase tracking-widest text-[#F5F2EA] bg-white/10 px-1.5 py-0.5 rounded-md border border-white/20 leading-none select-none font-sans">
                AI
            </span>
        </button>
    );
};

export default FloatingButton;