import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { generateDinosaur } from "../../services/acquisitionService";
import { useEditor } from "../../context/EditorContext";

const LOADING_MESSAGES = [
    "Researching fossil records...",
    "Analyzing scientific sources...",
    "Building dinosaur page...",
];

export default function AiGeneratorCard({ onSuccess }) {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    const { setDinosaur, setIsDirty, setSaveStatus } = useEditor();

    useEffect(() => {
        let interval;
        if (loading) {
            setMessageIndex(0);
            interval = setInterval(() => {
                setMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
            }, 2000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    const handleGenerate = async (e) => {
        e.preventDefault();

        const trimmedTopic = topic.trim();
        if (!trimmedTopic) {
            toast.error("Please enter a dinosaur name.");
            return;
        }

        setLoading(true);

        try {
            const data = await generateDinosaur(trimmedTopic);

            if (data) {
                setDinosaur(data);
                if (setIsDirty) setIsDirty(true);
                if (setSaveStatus) setSaveStatus("unsaved");

                toast.success("AI successfully generated the dinosaur page.");

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast.error("Unable to generate dinosaur. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border border-[#C6A87C]/30 bg-gradient-to-br from-[#0B1A13] via-[#162A1E] to-[#0B1A13] p-6 sm:p-8 text-white shadow-2xl backdrop-blur-md mb-8">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C9AA5B]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#2D6A4F]/20 blur-3xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-[#C9AA5B]/40 bg-[#C9AA5B]/15 text-[#C9AA5B] shadow-inner">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
                            Generate Dinosaur with AI
                        </h2>
                        <p className="mt-0.5 text-xs sm:text-sm text-gray-300">
                            Enter a dinosaur name to generate a complete, scientifically accurate dinosaur page using AI.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="mt-6">
                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Example: Spinosaurus"
                                disabled={loading}
                                className="w-full rounded-2xl border border-white/20 bg-black/40 px-5 py-3.5 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 outline-none transition focus:border-[#C9AA5B] focus:ring-2 focus:ring-[#C9AA5B]/30 disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C9AA5B] to-[#b89745] px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-neutral-950 shadow-lg transition hover:from-[#d8bb70] hover:to-[#C9AA5B] hover:shadow-[#C9AA5B]/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    <span>Generate</span>
                                </>
                            )}
                        </button>
                    </div>

                    {loading && (
                        <div className="mt-4 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#C9AA5B] animate-fade-in pl-1">
                            <div className="h-2 w-2 rounded-full bg-[#C9AA5B] animate-ping" />
                            <span>{LOADING_MESSAGES[messageIndex]}</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
