import { ArrowLeft, ArrowRight } from "lucide-react";

// TODO (Backend)
//
// Replace handleNext() logic.
//
// Current:
// Clicking Next directly navigates to Result page.
//
// Later:
//
// 1. Submit selected answer.
// 2. If more questions remain:
//      Load next question.
// 3. Else:
//      Navigate to Result screen.
//
// Previous button should:
// - Go to previous question if available.

const QuizNavigation = ({
    onPrevious,
    onNext,
}) => {

    return (
        <section className="mx-auto my-10 max-w-5xl px-6">
            <div className="flex items-center justify-between">
                {/* Previous Button */}
                <button onClick={onPrevious} className="flex items-center gap-2 rounded-2xl border border-[#E7DDC8] bg-white px-6 py-4 font-semibold text-[#47613F] transition-all duration-300 hover:bg-[#EDF3E7]">
                    <ArrowLeft size={18} />
                    Previous
                </button>

                {/* Next Button */}
                <button onClick={onNext} className="
                        flex items-center gap-2 rounded-2xl bg-[#47613F] px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#385032]">
                    Next
                    <ArrowRight size={18} />
                </button>
            </div>
        </section>
    );
};

export default QuizNavigation;