import { ArrowRight, Users } from "lucide-react";

export default function QuizButton() {
    return (
        <div className="flex flex-wrap items-center gap-8 pt-4">

            {/* Start Quiz Button */}

            <button
                className="
                group
                flex
                h-[72px]
                w-[260px]
                items-center
                justify-between
                rounded-3xl
                bg-[#496A3D]
                px-8
                text-xl
                font-semibold
                text-white
                shadow-[0_18px_40px_rgba(73,106,61,0.25)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#3E5D33]
            "
            >
                <span>Start Quiz</span>

                <ArrowRight
                    size={26}
                    className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                "
                />
            </button>

            {/* Explorer Count */}

            <div className="flex items-center gap-4">

                <Users
                    size={28}
                    className="text-[#496A3D]"
                />

                <p className="max-w-[260px] text-[15px] leading-6 text-[#5A5A5A]">

                    <span className="font-bold text-[#202020]">
                        1,200+
                    </span>

                    {" "}explorers have completed today's challenge!

                </p>

            </div>

        </div>
    );
}