import quizDino from "../../../assets/home-assets/quiz-dino.png";
import DNAStatsCard from "./DNAStatsCard";
import ProgressCard from "./ProgressCard";

export default function QuizVisual() {
    return (
        <div className="relative flex h-[560px] w-full items-center justify-center">

            {/* Background Circle */}

            <div
                className="
                absolute
                h-[470px]
                w-[470px]
                rounded-full
                bg-gradient-to-br
                from-[#EAF3E4]
                to-[#D8E7D2]
                opacity-70
                "
            />

            {/* Dinosaur */}

            <img
                src={quizDino}
                alt="Baby Dinosaur"
                className="
                relative-translate-y-10
                z-20
                w-[650px]
                object-contain
                "
            />

            <DNAStatsCard />

            <ProgressCard />

        </div>
    );
}