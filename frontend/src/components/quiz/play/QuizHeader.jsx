import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TODO (Backend)
//
// Replace static values using:
//
// GET /api/quiz/play/:slug/:difficulty
//
// {
//    topic,
//    currentQuestion,
//    totalQuestions
// }

const QuizHeader = ({
    topic,
    currentQuestion,
    totalQuestions,
}) => {
    const navigate = useNavigate();

    const progress = (currentQuestion / totalQuestions) * 100;

    return (
        <section className="mx-auto max-w-5xl px-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-[#47613F] transition-all hover:gap-3">
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="rounded-[30px] border border-[#E7DDC8] bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#47613F]">
                            {topic} Quiz
                        </p>

                        <h1 className="mt-2 text-4xl font-bold text-[#222]">
                            Question {currentQuestion} of {totalQuestions}
                        </h1>
                    </div>

                    <div className="rounded-2xl bg-[#EDF3E7] px-5 py-3">
                        <p className="text-sm text-[#47613F]">
                            Progress
                        </p>

                        <h2 className="text-2xl font-bold text-[#47613F]">
                            {Math.round(progress)}%
                        </h2>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                    <div className="h-3 overflow-hidden rounded-full bg-[#ECE6D9]">
                        <div className="h-full rounded-full bg-[#47613F] transition-all duration-500"
                            style={{
                                width: `${progress}%`}}/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuizHeader;