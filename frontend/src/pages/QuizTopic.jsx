import Navbar from "../components/home_components/hero/Navbar";

import TopicHero from "../components/quiz/topic/TopicHero";
import ProfessorTip from "../components/quiz/topic/ProfessorTip";
import DifficultyGrid from "../components/quiz/topic/DifficultyGrid";
import TopicFooterCTA from "../components/quiz/topic/TopicFooterCTA";

const QuizTopic = () => {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24">

                <TopicHero />

                <ProfessorTip />

                <DifficultyGrid />

                <TopicFooterCTA />

            </main>
        </>
    );
};

export default QuizTopic;