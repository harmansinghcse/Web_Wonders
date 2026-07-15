const letters = ["A", "B", "C", "D"];

const AnswerOption = ({
    index,
    text,
    selected,
    onClick,
}) => {
    return (
        <button onClick={onClick} className={` w-full rounded-2xl border px-6 py-5 text-left transition-all duration-300
                ${
                    selected
                        ? "border-[#47613F] bg-[#EDF3E7] shadow-md"
                        : "border-[#E7DDC8] bg-white hover:border-[#47613F] hover:bg-[#F5F8F0]"
                }
            `}>

            <div className="flex items-center gap-5">
                <div className={` flex h-11 w-11 items-center justify-center rounded-full font-bold
                        ${
                            selected
                                ? "bg-[#47613F] text-white"
                                : "bg-[#ECE6D9] text-[#47613F]"
                        }
                    `}>
                    {letters[index]}
                </div>

                <span className="text-lg font-medium text-[#222]">
                    {text}
                </span>
            </div>
        </button>
    );
};

export default AnswerOption;