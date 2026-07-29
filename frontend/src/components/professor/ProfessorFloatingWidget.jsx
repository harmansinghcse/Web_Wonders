import { useState, useRef, useEffect } from "react";
import { 
    Brain, 
    X, 
    SendHorizontal, 
    RotateCcw, 
    Minus, 
    Sparkles, 
    ChevronDown,
    Maximize2,
    Minimize2,
    Copy,
    Check,
    Bot,
    Zap,
    Flame,
    Dna,
    Layers,
    Lightbulb
} from "lucide-react";
import { useProfessor } from "../../context/ProfessorContext";

const quickPrompts = [
    { label: "Fun Facts", text: "Tell me a crazy dinosaur fact I probably don't know!", icon: Lightbulb },
    { label: "Extinction", text: "How did dinosaurs go extinct 66 million years ago?", icon: Flame },
    { label: "T-Rex vs Spino", text: "Who would win in a fight: T-Rex or Spinosaurus?", icon: Zap },
    { label: "Fossil Formation", text: "How do dinosaur bones turn into stone fossils?", icon: Layers },
    { label: "Bring Dinos Back?", text: "Is it scientifically possible to clone a dinosaur using ancient DNA?", icon: Dna },
];

const ProfessorFloatingWidget = () => {
    const {
        isOpen,
        toggleChat,
        closeChat,
        messages,
        loading,
        sendMessage,
        clearChat,
        unreadCount,
    } = useProfessor();

    const [input, setInput] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, loading, isOpen]);

    const handleSend = () => {
        if (!input.trim() || loading) return;
        sendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
            {/* Floating Chat Window */}
            {isOpen && (
                <div 
                    className={`mb-3 flex flex-col rounded-3xl border border-[#52B788]/40 bg-[#0B170E]/95 text-white 
                               shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(34,197,94,0.12)] backdrop-blur-2xl 
                               overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-6
                               ${
                                   isExpanded 
                                       ? "w-[calc(100vw-2rem)] sm:w-[500px] md:w-[540px] h-[660px] max-h-[88vh]" 
                                       : "w-[calc(100vw-2.5rem)] sm:w-[410px] md:w-[440px] h-[580px] max-h-[80vh]"
                               }`}
                >
                    {/* Header */}
                    <div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#11291A] via-[#1A3D27] to-[#122A1B] px-5 py-3.5 shrink-0">
                        {/* Background decal */}
                        <div className="absolute right-14 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none">
                            <Brain size={75} className="text-[#52B788] stroke-1" />
                        </div>

                        <div className="flex items-center gap-3 z-10">
                            <div className="relative">
                                <img
                                    src="/ross-avatar.png"
                                    alt="Professor Ross"
                                    className="h-11 w-11 rounded-full border-2 border-[#52B788] object-cover shadow-[0_0_12px_rgba(82,183,136,0.4)]"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden h-11 w-11 rounded-full bg-[#1F452C] border-2 border-[#52B788] items-center justify-center text-white">
                                    <Bot size={22} className="text-[#52B788]" />
                                </div>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#22c55e] border-2 border-[#0B170E] shadow-sm"></span>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                                        Professor Ross
                                    </h3>
                                    <span className="rounded-full bg-gradient-to-r from-[#52B788]/30 to-[#22c55e]/20 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#52B788] border border-[#52B788]/40 uppercase shadow-xs">
                                        AI
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#A3B899] flex items-center gap-1.5 mt-0.5 font-medium">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
                                    AI Paleontologist • Online
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 z-10">
                            <button
                                onClick={clearChat}
                                title="Reset conversation"
                                className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                <RotateCcw size={15} />
                            </button>
                            <button
                                onClick={() => setIsExpanded((prev) => !prev)}
                                title={isExpanded ? "Standard size" : "Expand window"}
                                className="hidden sm:flex rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                            </button>
                            <button
                                onClick={closeChat}
                                title="Minimize"
                                className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                <Minus size={17} />
                            </button>
                            <button
                                onClick={closeChat}
                                title="Close"
                                className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm no-scrollbar bg-[radial-gradient(ellipse_at_top,#142A1B_0%,#0B170E_70%)]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 ${
                                    msg.type === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {msg.type !== "user" && (
                                    <img
                                        src="/ross-avatar.png"
                                        alt="Ross"
                                        className="h-8 w-8 rounded-full border border-[#52B788]/60 object-cover shrink-0 mt-0.5 shadow-sm"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                                <div className="group relative max-w-[85%]">
                                    <div
                                        className={`px-4 py-3 shadow-md transition-all ${
                                            msg.type === "user"
                                                ? "rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#224E31] via-[#1B3F27] to-[#163520] border border-[#52B788]/30 text-white"
                                                : "rounded-2xl rounded-tl-xs bg-[#14261A] border border-white/10 text-stone-100 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm selection:bg-[#52B788]/40 selection:text-white">
                                            {msg.message}
                                        </p>

                                        <div
                                            className={`mt-1.5 flex items-center justify-between text-[10px] ${
                                                msg.type === "user"
                                                    ? "text-[#A3B899]"
                                                    : "text-stone-400"
                                            }`}
                                        >
                                            <span>{msg.time}</span>
                                            {msg.type !== "user" && (
                                                <button
                                                    onClick={() => handleCopy(msg.message, msg.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:text-[#52B788] cursor-pointer"
                                                    title="Copy message"
                                                >
                                                    {copiedId === msg.id ? (
                                                        <Check size={12} className="text-[#52B788]" />
                                                    ) : (
                                                        <Copy size={12} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {loading && (
                            <div className="flex gap-2.5 justify-start items-center">
                                <img
                                    src="/ross-avatar.png"
                                    alt="Ross"
                                    className="h-8 w-8 rounded-full border border-[#52B788]/60 object-cover shrink-0"
                                />
                                <div className="rounded-2xl rounded-tl-xs bg-[#14261A] border border-white/10 px-4 py-3 flex items-center gap-1.5 shadow-md">
                                    <span className="h-2 w-2 rounded-full bg-[#52B788] animate-bounce"></span>
                                    <span className="h-2 w-2 rounded-full bg-[#52B788] animate-bounce [animation-delay:150ms]"></span>
                                    <span className="h-2 w-2 rounded-full bg-[#52B788] animate-bounce [animation-delay:300ms]"></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="px-3 py-2 border-t border-white/10 bg-[#08120B]">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                            <Sparkles size={13} className="text-[#52B788] shrink-0 ml-1" />
                            {quickPrompts.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => sendMessage(item.text)}
                                        disabled={loading}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#122517] 
                                                   border border-[#52B788]/20 hover:border-[#52B788]/60 hover:bg-[#1A3822] 
                                                   text-stone-200 text-xs font-medium whitespace-nowrap transition-all 
                                                   duration-200 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
                                    >
                                        <IconComponent size={12} className="text-[#52B788]" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-[#08120B] border-t border-white/10 shrink-0">
                        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#122216] px-3.5 py-2 focus-within:border-[#52B788] focus-within:ring-1 focus-within:ring-[#52B788] transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Professor Ross anything..."
                                disabled={loading}
                                className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-stone-400 outline-none disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="rounded-xl bg-gradient-to-r from-[#225032] to-[#193F27] hover:from-[#2A633F] hover:to-[#205132] p-2 text-white transition-all disabled:opacity-30 disabled:hover:from-[#225032] cursor-pointer shrink-0 active:scale-95 border border-[#52B788]/30 shadow-sm"
                            >
                                <SendHorizontal size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Trigger Button */}
            <button
                onClick={toggleChat}
                title="Ask Professor Ross AI"
                className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#10301B] via-[#1A4527] to-[#27603B] 
                           pl-4 pr-3.5 py-3 text-white shadow-[0_10px_35px_rgba(0,0,0,0.4),0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 
                           hover:scale-105 hover:shadow-[0_15px_45px_rgba(34,197,94,0.35)] border border-[#52B788]/50 
                           active:scale-95 cursor-pointer"
            >
                {/* Pulsing Active Status Dot */}
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#092212]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
                    </span>
                </div>

                {/* Brain / Ross Icon */}
                <Brain size={19} className="text-[#E2F1E5] shrink-0 group-hover:rotate-12 transition-transform duration-300" />

                {/* Text Label */}
                <span className="text-sm font-bold tracking-tight text-[#E2F1E5] select-none font-sans whitespace-nowrap">
                    Ask Prof. Ross
                </span>

                {/* AI Pill Badge */}
                <span className="text-[9px] font-black uppercase tracking-wider text-[#52B788] bg-black/40 px-1.5 py-0.5 rounded-md border border-[#52B788]/30 select-none font-sans">
                    AI
                </span>

                {/* Unread Badge */}
                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-[10px] font-bold text-black animate-bounce shadow-md border border-black">
                        {unreadCount}
                    </span>
                )}

                {/* Chevron */}
                {isOpen && (
                    <ChevronDown size={16} className="text-[#A3B899] shrink-0 ml-0.5" />
                )}
            </button>
        </div>
    );
};

export default ProfessorFloatingWidget;
