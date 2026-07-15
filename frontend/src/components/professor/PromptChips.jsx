/**
 * --------------------------------------------
 * Component: PromptChips
 * Purpose:
 * Displays a collection of predefined prompt
 * buttons that help users quickly start a
 * conversation with Professor Ross.
 * --------------------------------------------
 */

// Predefined prompts displayed as quick action buttons
const prompts = [
    "🦖 Fun Facts",
    "🦴 Fossils",
    "⚔ Compare Dinosaurs",
    "🌋 Extinction Theories",
    "🎲 Surprise Me",
];

const PromptChips = ({ onSelect }) => {
    return (
        <div className="mx-auto mt-3 mb-4 flex w-full max-w-5xl gap-2 sm:gap-3 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center px-4 md:px-0 scroll-smooth pb-2 sm:pb-0">
            {/* Render all predefined prompt buttons */}
            {prompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => onSelect(prompt)}
                    className="rounded-full border border-[#E8E1CF] bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 hover:bg-[#F4F8E9] hover:scale-105 active:scale-95 shrink-0"
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
};

export default PromptChips;
