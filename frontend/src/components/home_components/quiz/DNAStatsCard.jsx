import { Dna } from "lucide-react";

export default function DNAStatsCard() {

    return (

        <div
            className="
            absolute
            right-0
            top-12
            z-30
            flex
            items-center
            gap-5
            rounded-3xl
            bg-white
            px-7
            py-5
            shadow-[0_18px_40px_rgba(0,0,0,0.12)]
            "
        >

            <div
                className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-[#EDF4E7]
                "
            >
                <Dna
                    size={28}
                    className="text-[#496A3D]"
                />
            </div>

            <div>

                <p className="text-sm uppercase tracking-wide text-gray-500">
                    DNA POINTS
                </p>

                <h3 className="text-5xl font-bold text-[#496A3D]">

                    1,250

                </h3>

            </div>

        </div>

    );

}