import { Trophy } from "lucide-react";

const ResultHero = () => {
    return (
        <section className="mx-auto max-w-5xl px-6">
            <div className="rounded-[32px] border border-[#E7DDC8] bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EDF3E7]">
                    <Trophy
                        size={42}
                        className="text-[#47613F]"
                    />
                </div>

                <h1 className="mt-6 text-5xl font-bold">
                    Congratulations!
                </h1>

                <p className="mt-4 text-xl text-gray-500">
                    You completed the Fossils Quiz.
                </p>

                <div className="mt-10">
                    <p className="text-gray-500">
                        Final Score
                    </p>

                    <h2 className="mt-2 text-7xl font-bold text-[#47613F]">
                        18 / 20
                    </h2>

                    <p className="mt-3 text-lg text-gray-500">
                        Accuracy 90%
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ResultHero;