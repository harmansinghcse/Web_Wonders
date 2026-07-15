import HeroStats from "./HeroStats";
import HeroButtons from "./HeroButtons";

export default function HeroContent() {
    return (
        <div className="max-w-2xl space-y-6 sm:space-y-8">
            {/* Home page content */}
            <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-[#8A867E]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6A675E] sm:text-xs sm:tracking-[0.35em]">
                    Journey Back In Time
                </p>
            </div>

            <div>
                <h1 className="font-display text-4xl leading-tight text-[#1F1F1F] sm:text-6xl lg:text-8xl lg:leading-[1.05]">
                    Explore the
                </h1>
                <h1 className="font-display text-4xl italic leading-tight text-[#36593D] sm:text-6xl lg:text-8xl lg:leading-[1.05]">
                    Age of Dinosaurs
                </h1>
            </div>
            {/* discription */}
            <p className="max-w-md text-base leading-7 text-[#5D5D5D] sm:text-lg sm:leading-8">
                Discover prehistoric giants, uncover ancient fossils, and travel
                through over{" "}
                <span className="font-semibold text-[#36593D]">
                    180 million years
                </span>{" "}
                of Earth's history.
            </p>

            <HeroStats />

            <HeroButtons />
        </div>
    );
}
