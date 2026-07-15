import {
    BookOpen,
    Target,
    Trophy,
    CalendarDays,
} from "lucide-react";

import QuizFeature from "./QuizFeature";

export default function QuizFeatures() {

    return (

        <div
            className="
            grid
            grid-cols-2
            gap-6
            sm:gap-8
            "
        >

            <QuizFeature
                icon={<BookOpen size={30} className="text-[#496A3D]" />}
                title="4 Topics"
                subtitle="Fossils, Dinosaurs, Extinction & Evolution"
            />

            <QuizFeature
                icon={<Target size={28} className="text-[#496A3D]" />}
                title="3 Levels"
                subtitle="Easy, Medium & Hard"
            />

            <QuizFeature
                icon={<Trophy size={28} className="text-[#496A3D]" />}
                title="DNA Rewards"
                subtitle="Earn points & unlock badges"
            />

            <QuizFeature
                icon={<CalendarDays size={28} className="text-[#496A3D]" />}
                title="Daily Challenge"
                subtitle="New quiz every day"
            />

        </div>

    );

}