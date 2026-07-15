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
        // Prompt chips container
        <div className="mx-auto mt-4 mb-16 flex w-[95%] max-w-5xl flex-wrap gap-3">
            {/* Render all predefined prompt buttons */}
            {prompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => onSelect(prompt)}
                    className="rounded-full border border-[#E8E1CF] bg-white px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-[#F4F8E9]"
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
};

export default PromptChips;
