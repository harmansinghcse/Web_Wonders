export default function StatsSection() {
    return (
        <div className="flex justify-center">
            <div className="mt-16 grid w-full max-w-6xl overflow-hidden rounded-4xl border border-[#C9AA5B]/15 bg-linear-to-br from-[#20281b]/90 to-[#171d14]/90 shadow-[0_25px_80px_rgba(0,0,0,.35)] md:grid-cols-3">
                {/* Card 1 */}
                <div className="border-b border-white/10 px-8 py-7 md:border-b-0 md:border-r">
                    <h2 className="text-4xl lg:text-6xl font-bold text-white">
                        300+
                    </h2>

                    <h3 className="mt-1 text-sm font-semibold uppercase tracking-widest text-white">
                        DINOSAURS
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-200">
                        Explore species from the past
                    </p>
                </div>

                {/* Card 2 */}
                <div className="border-b border-white/10 px-8 py-7 md:border-b-0 md:border-r">
                    <h2 className="text-4xl lg:text-6xl font-bold text-white">
                        1000+
                    </h2>

                    <h3 className="mt-1 text-sm font-semibold uppercase tracking-widest text-white">
                        Fossils
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-200">
                        Uncover ancient fossil discoveries
                    </p>
                </div>

                {/* Card 3 */}
                <div className="px-8 py-7">
                    <h2 className="text-4xl lg:text-6xl font-bold text-white">
                        50+
                    </h2>

                    <h3 className="mt-1 text-sm font-semibold uppercase tracking-widest text-white">
                        Games &amp; Quizzes
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-200">
                        Learn, play and test your knowledge
                    </p>
                </div>
            </div>
        </div>
    );
}
