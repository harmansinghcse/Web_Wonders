import QuizFeatures from "./QuizFeatures";
import QuizCTA from "./QuizCTA";
import QuizIllustration from "./QuizIllustration";

const QuizSection = () => {
    return (
        <section className="relative overflow-hidden bg-[#F9F5EC] py-24">

            {/* Background */}
            <div className="absolute inset-0 opacity-20">
                {/* Decorative pattern later */}
            </div>

            <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-20 px-6">

                {/* LEFT */}
                <div className="max-w-xl">
                    <p className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#47613F]">
                        <span className="h-px w-14 bg-[#47613F]" />
                        TEST YOUR KNOWLEDGE
                    </p>

                    <h2 className="leading-none">
                        <span className="block text-6xl font-black text-[#202020]">
                            Interactive
                        </span>

                        <span className="mt-2 block text-6xl font-black text-[#47613F]">
                            Jurassic Quiz
                        </span>
                    </h2>

                    <p className="mt-8 text-xl leading-9 text-[#5B5B5B]">
                        Challenge yourself with exciting dinosaur quizzes,
                        earn DNA Points, unlock achievements and become a
                        Jurassic expert.
                    </p>

                    <QuizFeatures />

                    <QuizCTA />
                </div>

                {/* RIGHT */}
                <QuizIllustration />
            </div>

        </section>
    );
};

export default QuizSection;