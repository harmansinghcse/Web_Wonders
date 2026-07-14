import { Lightbulb } from "lucide-react";
import { useState } from "react";

// TODO (Backend)
//
// Replace the static hint with:
//
// question.hint

const HintCard = () => {
    const [showHint, setShowHint] = useState(false);

    return (
        <section className="mx-auto mt-8 max-w-5xl px-6">
            <div className="rounded-[28px] border border-[#E7DDC8] bg-white p-6 shadow-sm">
                <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#EDF3E7] p-3">
                            <Lightbulb
                                className="text-[#47613F]"
                                size={22}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-[#222]">
                                Need a Hint?
                            </h3>

                            <p className="text-sm text-gray-500">
                                Reveal a clue before answering.
                            </p>
                        </div>
                    </div>

                    <span className="text-[#47613F] font-semibold">
                        {showHint ? "Hide" : "Show"}
                    </span>
                </button>

                {showHint && (

                    <div className="mt-6 rounded-2xl bg-[#F4F8EF] p-5">
                        <p className="leading-7 text-[#47613F]">
                            💡 Think about fossils that preserve organisms inside tree resin.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HintCard;