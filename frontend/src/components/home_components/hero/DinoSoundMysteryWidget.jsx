import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, X, Play, Pause, VolumeX, Sparkles, HelpCircle, Film, PartyPopper } from "lucide-react";

export default function DinoSoundMysteryWidget({ videoSrc = "/dino_sound_video.mp4", isOpen: externalIsOpen, setIsOpen: externalSetIsOpen, hideTrigger = false }) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalOpen;
    const setIsOpen = externalSetIsOpen || setInternalOpen;
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [activeFact, setActiveFact] = useState(0);
    const videoRef = useRef(null);

    // Prevent background page scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const facts = [
        {
            id: 1,
            title: "Soft Tissue Vocal Organs Decay",
            short: "1. Vocal Organs Rot Rapidly",
            detail: "Unlike bones and teeth, vocal organs like the larynx, vocal cords, or avian syrinx are soft cartilaginous tissue that decomposes completely within days—leaving zero fossil imprints for paleontologists.",
            badge: "Biological Fact 🌿",
            cardBg: "bg-[#08291D]/90 border-[#10B981]/30 hover:border-[#10B981]/70",
            activeCardBg: "bg-[#0B402B] border-[#10B981] text-[#E6F7F0] shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-[#10B981]/50",
            badgeStyle: "bg-[#10B981]/25 text-[#34D399] border-[#10B981]/40 font-bold",
            accentText: "text-[#34D399]",
            drawerBg: "bg-[#093021] border-[#10B981]/50 text-[#E6F7F0]"
        },
        {
            id: 2,
            title: "CT-Scan Skull Resonance",
            short: "2. CT Skull Sound Simulation",
            detail: "Scientists use 3D CT scans of hollow crests in duck-billed dinosaurs like Parasaurolophus to simulate air acoustics, revealing deep low-frequency foghorn honks rather than Hollywood lion roars!",
            badge: "Acoustic Simulation 🎺",
            cardBg: "bg-[#331E05]/90 border-[#F59E0B]/30 hover:border-[#F59E0B]/70",
            activeCardBg: "bg-[#4D2E07] border-[#F59E0B] text-[#FFFBEB] shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-[#F59E0B]/50",
            badgeStyle: "bg-[#F59E0B]/25 text-[#FBBF24] border-[#F59E0B]/40 font-bold",
            accentText: "text-[#FBBF24]",
            drawerBg: "bg-[#3A2206] border-[#F59E0B]/50 text-[#FFFBEB]"
        },
        {
            id: 3,
            title: "Our Made-Up Human Voice Roar!",
            short: "3. The Hilarious Human Roar 🤪",
            detail: "Since real sound recordings from 66 million years ago are impossible, we recorded our very own hilarious human dinosaur roar shouting 'YAAAAAAAAAAAAAAAA!' for your entertainment!",
            badge: "Fun Fan Edition 🤪",
            cardBg: "bg-[#3B071F]/90 border-[#EC4899]/30 hover:border-[#EC4899]/70",
            activeCardBg: "bg-[#540B2D] border-[#EC4899] text-[#FDF2F8] shadow-[0_0_25px_rgba(236,72,153,0.35)] ring-2 ring-[#EC4899]/50",
            badgeStyle: "bg-[#EC4899]/25 text-[#F472B6] border-[#EC4899]/40 font-bold",
            accentText: "text-[#F472B6]",
            drawerBg: "bg-[#400822] border-[#EC4899]/50 text-[#FDF2F8]"
        }
    ];

    const currentFact = facts[activeFact];

    return (
        <>
            {/* HERO BUTTON SHORTCUT TRIGGER */}
            {!hideTrigger && (
                <motion.button 
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#005611] bg-white/70 backdrop-blur-sm px-6 py-[10px] text-sm font-bold text-[#005611] shadow-md transition hover:bg-[#005611] hover:text-white cursor-pointer group"
                >
                    <Volume2 size={18} className="animate-pulse text-[#005611] group-hover:text-white transition-colors" />
                    <span>Dinosaur Sound Mystery</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            )}

            {/* EXPANDED FULL-SCREEN SOUND MYSTERY MODAL */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[99999] overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex items-center justify-center min-h-screen bg-black/80 backdrop-blur-md custom-scrollbar">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 15 }}
                            className="w-full max-w-4xl bg-gradient-to-br from-[#0F1E19] via-[#122820] to-[#0A1612] border-2 border-[#10B981]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-[#E2F0EA] relative space-y-6 my-auto overflow-hidden"
                        >
                            {/* Close Modal Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#E2F0EA] flex items-center justify-center transition cursor-pointer z-10 border border-white/15 shadow-md"
                            >
                                <X size={20} />
                            </button>

                            {/* Modal Header */}
                            <div className="space-y-2 pr-10 border-b border-[#1C3E32] pb-5">
                                <div className="inline-flex items-center gap-2 bg-[#F59E0B]/20 border border-[#F59E0B]/40 px-3.5 py-1 rounded-full text-xs font-serif font-bold text-[#FBBF24] uppercase tracking-widest shadow-sm">
                                    <Sparkles size={14} className="text-[#FBBF24] animate-spin" />
                                    <span>PALEO-ACOUSTICS & FUN ROAR EDITION 🤣</span>
                                </div>
                                <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight uppercase drop-shadow-sm">
                                    Why Don’t We Know How Dinosaurs Sounded?
                                </h2>
                                <p className="text-xs sm:text-sm text-[#B8E2D2] font-medium leading-relaxed">
                                    Since 66-million-year-old voice recordings don't exist, Hollywood made up lion roars... and we made up our own epic human dinosaur roar: <strong className="text-[#FBBF24] font-mono text-sm bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">"YAAAAAAAAAAAAAAAA!"</strong>
                                </p>
                            </div>

                            {/* TOP SECTION: 3 VIBRANT FUN SUBSECTION CARDS (Horizontal Grid) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {facts.map((fact, index) => {
                                    const isActive = activeFact === index;
                                    return (
                                        <button
                                            key={fact.id}
                                            onClick={() => setActiveFact(index)}
                                            className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 ${
                                                isActive ? fact.activeCardBg : fact.cardBg
                                            }`}
                                        >
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${fact.badgeStyle}`}>
                                                        {fact.badge}
                                                    </span>
                                                    <span className={`text-xs font-bold ${fact.accentText}`}>
                                                        #{fact.id}
                                                    </span>
                                                </div>
                                                <h4 className="text-xs sm:text-sm font-serif font-extrabold text-white pt-1">
                                                    {fact.title}
                                                </h4>
                                            </div>

                                            <p className="text-[11px] text-[#CBE9DE] leading-relaxed line-clamp-3 font-normal opacity-90">
                                                {fact.detail}
                                            </p>

                                            <div className="pt-2 flex items-center justify-between text-[10px] text-[#9BD7C1] font-semibold border-t border-white/10">
                                                <span>{isActive ? "Viewing Active Fact" : "Click to Explore"}</span>
                                                <ArrowRight size={13} className={isActive ? `${fact.accentText} translate-x-1 transition-transform` : ""} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ACTIVE FACT HIGHLIGHT DRAWER */}
                            <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3.5 transition-all duration-300 shadow-md ${currentFact.drawerBg}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${currentFact.badgeStyle}`}>
                                    <HelpCircle size={20} />
                                </div>
                                <div className="space-y-0.5">
                                    <span className={`font-extrabold font-serif uppercase tracking-wider text-[11px] ${currentFact.accentText}`}>
                                        INSIGHT #{currentFact.id}: {currentFact.title}
                                    </span>
                                    <p className="text-[11px] leading-relaxed opacity-95 text-[#E6F4EE]">
                                        {currentFact.detail}
                                    </p>
                                </div>
                            </div>

                            {/* BOTTOM SECTION: DEDICATED FULL-WIDTH INTERACTIVE VIDEO SHOWCASE */}
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between text-xs text-[#FBBF24] font-serif font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-2">
                                        <Film size={16} className="text-[#FBBF24]" />
                                        Human Dinosaur Voice Showcase 🎬🎉
                                    </span>

                                    {/* Mute/Unmute Audio Control */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={toggleMute}
                                            className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-[#FBBF24] border border-amber-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                                        >
                                            {isMuted ? (
                                                <>
                                                    <VolumeX size={14} className="text-rose-400" />
                                                    <span>Muted</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Volume2 size={14} className="text-amber-400 animate-pulse" />
                                                    <span>Audio On</span>
                                                </>
                                            )}
                                        </button>
                                        <span className="text-[10px] text-[#FBBF24]/80 font-sans font-semibold flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full hidden sm:inline-flex">
                                            <PartyPopper size={12} className="text-amber-400" /> FUN VIDEO
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full relative rounded-2xl overflow-hidden border-2 border-[#F59E0B]/50 bg-black shadow-[0_0_30px_rgba(245,158,11,0.25)] group">
                                    
                                    {/* Video Element - Native controls enabled, no overlay blocking native volume controls */}
                                    <video
                                        ref={videoRef}
                                        src={videoSrc}
                                        className="w-full h-56 sm:h-64 object-cover"
                                        playsInline
                                        controls={true}
                                        muted={isMuted}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onEnded={() => setIsPlaying(false)}
                                    />

                                    {/* Video Play Overlay Button (Hidden once user starts playing) */}
                                    {!isPlaying && (
                                        <div 
                                            onClick={togglePlay}
                                            className="absolute inset-0 bg-black/65 backdrop-brightness-95 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 hover:bg-black/50 p-4 text-center z-10"
                                        >
                                            {/* Sound Wave Animation Bars */}
                                            <div className="flex items-end gap-1.5 h-6 mb-3">
                                                <span className="w-1.5 h-4 bg-[#10B981] rounded-full animate-bounce" />
                                                <span className="w-1.5 h-6 bg-[#F59E0B] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-1.5 h-5 bg-[#EC4899] rounded-full animate-bounce [animation-delay:0.4s]" />
                                                <span className="w-1.5 h-3 bg-[#34D399] rounded-full animate-bounce [animation-delay:0.1s]" />
                                            </div>

                                            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-slate-950 font-black flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 mb-2.5 border-2 border-amber-200 cursor-pointer">
                                                <Play size={28} className="fill-current ml-1 text-slate-950" />
                                            </button>
                                            
                                            <span className="text-xs sm:text-sm font-black font-serif text-[#FBBF24] uppercase tracking-widest drop-shadow-md">
                                                PLAY THE EPIC "YAAAAAAAAAAAAAAAA!" ROAR
                                            </span>
                                            <span className="text-[10px] text-amber-200/90 font-medium italic mt-1 bg-black/50 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                                                (100% Scientifically Unverified & Hilarious Human Roar!)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-[10px] text-[#9BD7C1] font-medium italic text-center pt-1">
                                    🎬 Featuring our hilarious made-up human voice dinosaur roar! Click Play to listen.
                                </p>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
