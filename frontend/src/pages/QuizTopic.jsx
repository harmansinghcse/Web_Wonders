import Navbar from "../components/home_components/hero/Navbar";

import TopicHero from "../components/quiz/topic/TopicHero";
import ProfessorTip from "../components/quiz/topic/ProfessorTip";
import DifficultyGrid from "../components/quiz/topic/DifficultyGrid";
import TopicFooterCTA from "../components/quiz/topic/TopicFooterCTA";

// TODO (Backend)
//
// Read slug using:
//
// const { slug } = useParams();
//
// Fetch:
//
// GET /api/quiz/topics/:slug
//
// Examples:
// /quiz/topic/fossils
// /quiz/topic/dinosaurs
// /quiz/topic/evolution
//
// Pass the response to:
// <TopicHero />
// <DifficultyGrid />
// <ProfessorTip />

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