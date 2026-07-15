import HeroStats from "./HeroStats";
import HeroButtons from "./HeroButtons";

export default function HeroContent() {
    return (
        <div className="max-w-2xl">
            {/* Label */}
            <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-14 bg-[#303030]" />

                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#000000]">
                    Journey Back In Time
                </p>

                <div className="h-px w-14 bg-[#303030]" />
            </div>

            {/* Heading */}
            <div className="space-y-1">
                <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-[#241D18] sm:text-6xl lg:text-[6.2rem]">
                    Explore the
                </h1>

                <h2 className="font-display text-5xl italic font-semibold leading-[1.0] tracking-[-0.03em] text-[#006F0F] sm:text-6xl lg:text-[6.2rem]">
                    Age of Dinosaurs
                </h2>
            </div>
            {/* Description */}
            <p className="mt-8 max-w-lg text-lg leading-8 text-[#222D1F] font-medium opacity-95">
                Discover prehistoric giants, uncover ancient fossils, and
                journey through more than{" "}
                <span className="font-semibold text-[#36593D]">
                    180 million years
                </span>{" "}
                of Earth's forgotten history.
            </p>

            {/* Stats */}
            <div className="mt-10">
                <HeroStats />
            </div>

            {/* Buttons */}
            <div className="mt-8">
                <HeroButtons />
            </div>
        </div>
    );
}