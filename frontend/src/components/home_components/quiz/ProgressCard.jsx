import { Leaf } from "lucide-react";

export default function ProgressCard() {

    return (

        <div
            className="
            absolute
            bottom-12
            left-8
            z-30
            w-[500px]
            rounded-[30px]
            bg-white
            p-8
            shadow-[0_25px_60px_rgba(0,0,0,.12)]
            "
        >

            <div className="mb-5 flex items-center justify-between">

                <span className="text-lg font-semibold">

                    Your Progress

                </span>

                <Leaf
                    className="text-[#496A3D]"
                />

            </div>

            <div className="h-4 overflow-hidden rounded-full bg-[#E7E2D5]">

                <div
                    className="
                    h-full
                    w-[68%]
                    rounded-full
                    bg-[#496A3D]
                    "
                />

            </div>

            <div className="mt-3 flex justify-end">

                <span className="text-xl font-bold text-[#496A3D]">

                    68%

                </span>

            </div>

        </div>

    );

}