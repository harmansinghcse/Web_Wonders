import { ArrowLeft, ArrowRight } from "lucide-react";

const QuizNavigation = ({
    onPrevious,
    onNext,
    nextLabel = "Next",
    disabled = false,
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
                <button 
                    onClick={onNext} 
                    disabled={disabled}
                    className={`flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold text-white transition-all duration-300 ${
                        disabled 
                            ? "bg-gray-300 cursor-not-allowed opacity-70" 
                            : "bg-[#47613F] hover:-translate-y-1 hover:bg-[#385032]"
                    }`}
                >
                    {nextLabel}
                    <ArrowRight size={18} />
                </button>
            </div>
        </section>
    );
};

export default QuizNavigation;