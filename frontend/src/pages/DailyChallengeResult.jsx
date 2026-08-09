import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Dna, Trophy } from "lucide-react";
import Navbar from "../components/home_components/hero/Navbar";

const DailyChallengeResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const score = location.state?.score ?? 0;
    const totalQuestions = location.state?.totalQuestions ?? 5;
    const dnaReward = location.state?.dnaEarned ?? 0;
    const title = location.state?.title ?? "Jurassic Sprint";

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] px-6 pb-16 pt-28">

                <div className="mx-auto flex max-w-4xl justify-center">

                    <div className="w-full rounded-[32px] border border-[#E7DDC8] bg-white p-8 text-center shadow-sm md:p-12">

                        {/* Trophy */}

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EDF3E7]">
                            <Trophy
                                size={38}
                                className="text-[#47613F]"
                            />
                        </div>

                        {/* Heading */}

                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#47613F]">
                            Daily Challenge Complete
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-[#222] md:text-5xl">
                            {title}
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                            Great work! Come back tomorrow for a new
                            Jurassic challenge.
                        </p>

                        {/* Score */}

                        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-4">

                            <div className="rounded-2xl bg-[#F4F8EF] p-5">

                                <Trophy
                                    size={22}
                                    className="mx-auto mb-2 text-[#47613F]"
                                />

                                <p className="text-sm text-gray-500">
                                    Score
                                </p>

                                <p className="mt-1 text-3xl font-bold text-[#47613F]">
                                    {score}/{totalQuestions}
                                </p>

                            </div>

                            <div className="rounded-2xl bg-[#F4F8EF] p-5">

                                <Dna
                                    size={22}
                                    className="mx-auto mb-2 text-[#47613F]"
                                />

                                <p className="text-sm text-gray-500">
                                    DNA Earned
                                </p>

                                <p className="mt-1 text-3xl font-bold text-[#47613F]">
                                    +{dnaReward}
                                </p>

                            </div>

                        </div>

                        {/* Actions */}

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                            <button
                                onClick={() => navigate("/quiz")}
                                className="flex items-center gap-2 rounded-2xl border border-[#E7DDC8] bg-white px-6 py-3 font-semibold text-[#47613F] transition-all hover:bg-[#EDF3E7]"
                            >
                                <ArrowLeft size={18} />
                                Back to Quiz
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="rounded-2xl bg-[#47613F] px-7 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-[#385032]"
                            >
                                Back to Home
                            </button>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
};

export default DailyChallengeResult;