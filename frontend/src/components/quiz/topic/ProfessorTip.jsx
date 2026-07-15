import professorAvatar from "../../../assets/quiz-assets/ross-avatar.png";

const ProfessorTip = () => {
    return (
        <section className="mx-auto mt-10 max-w-7xl px-6">
            <div className="rounded-[28px] border border-[#E7DDC8] bg-white p-6 shadow-sm">

                <div className="flex items-center gap-5">
                    <img
                        src={professorAvatar}
                        alt="Professor Rex"
                        className="h-20 w-20 rounded-full border-4 border-[#D8E4B4]"
                    />

                    <div>
                        <h3 className="text-xl font-bold text-[#47613F]">
                            Professor Rex's Tip
                        </h3>

                        <p className="mt-2 leading-7 text-gray-600">
                            Start with Beginner if you're new to this topic.
                            Remember, accuracy is more important than speed.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ProfessorTip;