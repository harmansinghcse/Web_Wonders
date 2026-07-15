import { BookOpen, Target, Trophy, CalendarDays} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Learn 4 Topics",
    },
    {
        icon: Target,
        title: "Easy • Medium • Hard",
    },
    {
        icon: Trophy,
        title: "Earn DNA Points",
    },
    {
        icon: CalendarDays,
        title: "New Challenge Daily",
    },
];

const QuizFeatures = () => {
    return (
        <div className="mt-10 grid grid-cols-2 gap-5">

            {features.map((feature) => {

                const Icon = feature.icon;

                return (

                    <div key={feature.title} className=" flex items-center gap-4 rounded-2xl border border-[#E8E0D1] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="rounded-xl bg-[#EDF5E7] p-3">
                            <Icon
                                size={22}
                                className="text-[#47613F]"
                            />
                        </div>

                        <span className="font-semibold text-[#2A2A2A]">
                            {feature.title}
                        </span>
                    </div>

                );

            })}

        </div>
    );
};

export default QuizFeatures;