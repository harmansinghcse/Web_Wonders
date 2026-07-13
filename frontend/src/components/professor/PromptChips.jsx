const prompts = [
    "🦖 Fun Facts",
  "🦴 Fossils",
  "⚔ Compare Dinosaurs",
  "🌋 Extinction Theories",
  "🎲 Surprise Me",
];

const PromptChips = () => {
    return (
        <div className="mx-auto mt-4 mb-16 flex w-[95%] max-w-5xl flex-wrap gap-3">
            {prompts.map((prompt) => (
                <button
                key={prompt}
                className="rounded-full border border-[#E8E1CF] bg-white px-5 py-3 text-sm font-medium shadow-sm transition hover:bg-[#F4F8E9]"
                >
                {prompt}
                </button>
            ))}
        </div>
    );
}


export default PromptChips;