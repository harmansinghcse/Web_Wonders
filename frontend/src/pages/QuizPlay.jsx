import Navbar from "../components/home_components/hero/Navbar";

import QuizHeader from "../components/quiz/play/QuizHeader";
import QuestionCard from "../components/quiz/play/QuestionCard";
import HintCard from "../components/quiz/play/HintCard";
import QuizNavigation from "../components/quiz/play/QuizNavigation";

// TODO (Backend)
//
// Route:
//
// /quiz/play/:slug/:difficulty
//
// Example:
//
// /quiz/play/fossils/easy
//
// Read:
//
// const { slug, difficulty } = useParams();
//
// Fetch:
//
// GET /api/quiz/play/:slug/:difficulty
//
// Pass data to child components.

const QuizPlay = () => {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24">

                <QuizHeader />

                <QuestionCard />

                <HintCard />

                <QuizNavigation />

            </main>

        </>
    );
};

export default QuizPlay;