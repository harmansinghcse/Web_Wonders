import { Leaf } from "lucide-react";

export default function ProgressCard() {
    return (
        <div
            className="
            absolute
            bottom-4
            left-1/2
            -translate-x-1/2
            sm:bottom-12
            sm:left-8
            sm:translate-x-0
            z-30
            w-[90%]
            max-w-[400px]
            sm:w-[460px]
            rounded-2xl
            sm:rounded-[30px]
            bg-white
            p-5
            sm:p-8
            shadow-[0_25px_60px_rgba(0,0,0,.12)]
            "
        >
            <div className="mb-3 sm:mb-5 flex items-center justify-between">
                <span className="text-sm sm:text-lg font-semibold">
                    Your Progress
                </span>

                <Leaf
                    className="text-[#496A3D] h-4 w-4 sm:h-6 sm:w-6"
                />
            </div>

            <div className="h-2.5 sm:h-4 overflow-hidden rounded-full bg-[#E7E2D5]">
                <div
                    className="
                    h-full
                    w-[68%]
                    rounded-full
                    bg-[#496A3D]
                    "
                />
            </div>

            <div className="mt-2 sm:mt-3 flex justify-end">
                <span className="text-sm sm:text-xl font-bold text-[#496A3D]">
                    68%
                </span>
            </div>
        </div>
    );
}