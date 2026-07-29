import { Lightbulb, Layers, Zap, Flame, Sparkles } from "lucide-react";

/**
 * --------------------------------------------
 * Component: PromptChips
 * Purpose:
 * Displays a collection of predefined prompt
 * buttons that help users quickly start a
 * conversation with Professor Ross.
 * --------------------------------------------
 */

const prompts = [
    { label: "Fun Facts", text: "Fun Facts", icon: Lightbulb },
    { label: "Fossils", text: "Fossils", icon: Layers },
    { label: "Compare Dinosaurs", text: "Compare Dinosaurs", icon: Zap },
    { label: "Extinction Theories", text: "Extinction Theories", icon: Flame },
    { label: "Surprise Me", text: "Surprise Me", icon: Sparkles },
];

const PromptChips = ({ onSelect }) => {
    return (
        <div className="mx-auto mt-3 mb-4 flex w-full max-w-5xl gap-2 sm:gap-3 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center px-4 md:px-0 scroll-smooth pb-2 sm:pb-0">
            {prompts.map(({ label, text, icon: IconComponent }) => (
                <button
                    key={label}
                    onClick={() => onSelect(text)}
                    className="flex items-center gap-2 rounded-full border border-[#E8E1CF] bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-stone-700 shadow-xs transition-all duration-200 hover:bg-[#F4F8E9] hover:border-[#6C8E4E]/40 hover:text-[#36593D] hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                >
                    <IconComponent size={15} className="text-[#6C8E4E]" />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
};

export default PromptChips;
