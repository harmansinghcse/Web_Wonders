import professorAvatar from "../../../assets/quiz-assets/ross-avatar.png";

// TODO (Backend)
//
// Replace message based on accuracy.
//
// 90%+
// Excellent
//
// 70%+
// Great Job
//
// below 70%
// Keep Practicing

const ProfessorFeedback = () => {
    return (
        <section className="mx-auto mt-8 max-w-5xl px-6">
            <div className="rounded-[28px] border border-[#E7DDC8] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-5">
                    <img src={professorAvatar} alt="Professor Rex" className="h-20 w-20 rounded-full border-4 border-[#D7E4B2]"/>

                    <div>
                        <h2 className="text-2xl font-bold text-[#47613F]">
                            Professor Rex says...
                        </h2>

                        <p className="mt-3 leading-7 text-gray-600">
                            Outstanding work! Your understanding of fossils is
                            excellent. Keep exploring new topics to become a
                            true Jurassic Expert.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfessorFeedback;