import React from "react";
import { Sparkles, Trophy, Flame, ArrowRight, Clock } from "lucide-react";

export default function CommunityHeaderBanner({ onParticipate }) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-r from-[#184D30] via-[#1F5C38] to-[#122A1B] p-6 text-white shadow-xl backdrop-blur-md">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#52B788]/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-[#E28F7A]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                {/* Left Banner Info */}
                <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7D3A7]/20 border border-[#E7D3A7]/30 px-3 py-1 text-xs font-extrabold text-[#E7D3A7] uppercase tracking-wider">
                            <Sparkles size={13} className="text-[#E7D3A7]" />
                            Weekly Prehistoric Challenge #14
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-400/30 px-2.5 py-1 text-[11px] font-bold text-red-300">
                            <Clock size={12} />
                            Ends in 2 days
                        </span>
                    </div>

                    <h2 className="font-serif text-2xl font-black text-white sm:text-3xl leading-tight">
                        Apex Raptor Hybrid Expedition
                    </h2>

                    <p className="text-xs text-[#C8DACB] sm:text-sm leading-relaxed">
                        Engineer a high-speed raptor hybrid combining lethal agility and armored defense. Top creations earn the coveted <strong className="text-[#E7D3A7]">Master Geneticist Badge</strong>!
                    </p>
                </div>

                {/* Right CTA Box */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-sm text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-300">
                            <Trophy size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Reward</span>
                        </div>
                        <p className="text-xs font-extrabold text-white mt-0.5">+500 XP • Golden DNA Badge</p>
                    </div>

                    <button
                        onClick={() => onParticipate && onParticipate("Apex Raptor Hybrid", "#ApexRaptor")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E7D3A7] to-[#C8A356] px-6 py-3.5 text-xs font-black text-[#122A1B] uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-amber-500/25 active:scale-95 cursor-pointer"
                    >
                        <Flame size={16} className="fill-[#122A1B]" />
                        <span>Participate Now</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
