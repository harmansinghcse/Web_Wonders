export default function HeroButtons() {
    const scrollToNext = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
                onClick={scrollToNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#36593D] px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-[#2A4530]"
            >
                <span>↓</span>
                Scroll to explore
            </button>
        </div>
    );
}
