import { ArrowLeft, ArrowRight } from "lucide-react";

// TODO (Backend)
//
// Previous Question
//
// Next Question
//
// Submit Answer
//
// Finish Quiz

const QuizNavigation = () => {
    return (
        <section className="mx-auto my-10 max-w-5xl px-6">
            <div className="flex items-center justify-between">
                <button className=" flex items-center gap-2 rounded-2xl border border-[#E7DDC8] bg-white px-6 py-4 font-semibold text-[#47613F] transition-all hover:bg-[#EDF3E7]">
                    <ArrowLeft size={18} />
                    Previous
                </button>

                <button className=" flex items-center gap-2 rounded-2xl bg-[#47613F] px-8 py-4 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-[#365239]">
                    Next
                    <ArrowRight size={18} />
                </button>
            </div>
        </section>
    );
};

export default QuizNavigation;