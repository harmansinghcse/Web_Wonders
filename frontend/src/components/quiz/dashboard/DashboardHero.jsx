import dashboardBanner from "../../../assets/quiz-assets/dashboard-banner.png";
import professorAvatar from "../../../assets/quiz-assets/ross-avatar.png";
// TODO (Backend)
// Replace dashboardData prop with API response from:
// GET /quiz/dashboard

const DashboardHero = ({ user }) => {
    const name = user?.name || "Explorer";
    const dnaPoints = user?.dnaPoints ?? 0;

    return (
        <section className="mx-auto max-w-7xl px-6 pt-8">
            <div className="relative overflow-hiddden rounded-[32px] border border-[#E8DEC9] shadow-lg"
            style={{backgroundImage: `url(${dashboardBanner})`,backgroundSize: "cover",backgroundPosition: "center",}}>
                {/* Light overlay */}
                <div className="absolute inset-0 bg-[#FFFDF8]/55 backdrop-blur-[1px]" />

                <div className="relative p-6 sm:p-8 lg:p-10">

                    {/* Top Row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-md sm:text-lg text-[#555]">
                                Welcome back,
                            </p>

                            <h1 className="mt-1 text-3xl sm:text-5xl font-bold text-[#222] break-words">
                                {name}
                            </h1>
                        </div>

                        <div className="w-fit rounded-2xl bg-white/90 px-6 py-4 shadow">
                            <p className="text-xs sm:text-sm text-gray-500">
                                DNA Points
                            </p>

                            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F5A3F]">
                                {dnaPoints}
                            </h2>
                        </div>
                    </div>
                        {/* Professor Card */}

                        <div className="mt-8 max-w-lg rounded-3xl bg-white/90 p-5 shadow-lg backdrop-blur">
                            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
                                <img src={professorAvatar} alt="Professor Rex" className="h-20 w-20 shrink-0 rounded-full border-4 border-[#C7D78A]"/>

                                <div>
                                    <h3 className="text-xl font-bold text-[#2F5A3F]">
                                        Professor Rex
                                    </h3>

                                    <p className="mt-1 text-gray-700 leading-relaxed text-sm sm:text-base">
                                        Ready for another Jurassic Challenge?
                                    </p>

                                    <p className="text-gray-600 text-xs sm:text-sm">
                                        Test your knowledge and earn DNA Points!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </section>
    );
};

export default DashboardHero;