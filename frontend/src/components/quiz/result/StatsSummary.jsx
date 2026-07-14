import { CheckCircle2, XCircle, Clock3, Dna} from "lucide-react";

// TODO (Backend)
//
// Replace these static values using:
//
// POST /api/quiz/result

const StatsSummary = () => {
    const stats = [
        {
            icon: <CheckCircle2 className="text-green-600" size={28} />,
            title: "Correct",
            value: "18",
            bg: "bg-green-100",
        },
        {
            icon: <XCircle className="text-red-600" size={28} />,
            title: "Wrong",
            value: "2",
            bg: "bg-red-100",
        },
        {
            icon: <Clock3 className="text-blue-600" size={28} />,
            title: "Time",
            value: "12m 18s",
            bg: "bg-blue-100",
        },
        {
            icon: <Dna className="text-[#47613F]" size={28} />,
            title: "DNA Earned",
            value: "+180",
            bg: "bg-[#EDF3E7]",
        },
    ];

    return (
        <section className="mx-auto mt-8 max-w-5xl px-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                {stats.map((stat) => (

                    <div
                        key={stat.title}
                        className="rounded-[24px] border border-[#E7DDC8] bg-white p-6 shadow-sm">

                        <div className={`inline-flex rounded-2xl p-4 ${stat.bg}`}>
                            {stat.icon}
                        </div>

                        <h3 className="mt-5 text-3xl font-bold">
                            {stat.value}
                        </h3>

                        <p className="mt-2 text-gray-500">
                            {stat.title}
                        </p>
                    </div>

                ))}

            </div>
        </section>
    );
};

export default StatsSummary;