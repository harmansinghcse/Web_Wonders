import QuizFeatures from "./QuizFeatures";
import QuizButton from "./QuizButton";

export default function QuizContent() {

    return (

        <div className="w-full max-w-[620px] space-y-10">

            <div className="flex items-center gap-5">

                <div className="h-px w-12 bg-[#496A3D]" />

                <span className=" text-sm font-semibold uppercase tracking-[0.38em] text-[#496A3D]">
                    Test Your Knowledge
                </span>

            </div>

            <div>

                <h2 className="text-[82px] font-black leading-[0.82] tracking-[-0.04em] text-[#202020]">
                    Interactive
                    <span className="block text-[#4B6A3E]">
                        Jurassic Quiz
                    </span>

                </h2>

            </div>

            <p className="max-w-[580px] text-[22px] leading-[44px] text-[#5A5A5A]">
                Challenge yourself with exciting dinosaur quizzes,
                earn DNA Points, unlock achievements and become a Jurassic expert.
            </p>

            <QuizFeatures />

            <QuizButton />

        </div>

    );
}