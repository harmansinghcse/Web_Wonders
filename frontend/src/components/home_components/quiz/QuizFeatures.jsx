import {
    BookOpen,
    Target,
    Trophy,
    CalendarDays,
} from "lucide-react";

import QuizFeature from "./QuizFeature";

export default function QuizFeatures() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">

            <QuizFeature
                icon={<BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#496A3D]" />}
                title="4 Topics"
                subtitle="Fossils, Dinosaurs, Extinction & Evolution"
            />

            <QuizFeature
                icon={<Target className="h-5 w-5 sm:h-6 sm:w-6 text-[#496A3D]" />}
                title="3 Levels"
                subtitle="Easy, Medium & Hard"
            />

            <QuizFeature
                icon={<Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-[#496A3D]" />}
                title="DNA Rewards"
                subtitle="Earn points & unlock badges"
            />

            <QuizFeature
                icon={<CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-[#496A3D]" />}
                title="Daily Challenge"
                subtitle="New quiz every day"
            />

        </div>

    );

}