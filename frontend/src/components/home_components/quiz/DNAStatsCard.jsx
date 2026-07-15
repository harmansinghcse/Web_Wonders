import { Dna } from "lucide-react";

export default function DNAStatsCard() {
    return (
        <div
            className="
            absolute
            right-2
            top-4
            sm:right-0
            sm:top-12
            z-30
            flex
            items-center
            gap-3
            sm:gap-5
            rounded-2xl
            sm:rounded-3xl
            bg-white
            px-4
            py-3
            sm:px-7
            sm:py-5
            shadow-[0_18px_40px_rgba(0,0,0,0.12)]
            "
        >
            <div
                className="
                flex
                h-10
                w-10
                sm:h-14
                sm:w-14
                items-center
                justify-center
                rounded-full
                bg-[#EDF4E7]
                "
            >
                <Dna
                    className="text-[#496A3D] h-5 w-5 sm:h-7 sm:w-7"
                />
            </div>

            <div>
                <p className="text-[10px] sm:text-sm uppercase tracking-wide text-gray-500">
                    DNA POINTS
                </p>

                <h3 className="text-2xl sm:text-5xl font-bold text-[#496A3D]">
                    1,250
                </h3>
            </div>
        </div>
    );
}