import Navbar from "../components/home_components/hero/Navbar";

import ResultHero from "../components/quiz/result/ResultHero";
import StatsSummary from "../components/quiz/result/StatsSummary";
import ProfessorFeedback from "../components/quiz/result/ProfessorFeedback";
import ResultActions from "../components/quiz/result/ResultActions";

// TODO (Backend)
//
// POST /api/quiz/result
//
// Response:
//
// {
//    score,
//    total,
//    accuracy,
//    dnaEarned,
//    badge,
//    correct,
//    wrong,
//    timeTaken
// }

const QuizResult = () => {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24">

                <ResultHero />

                <StatsSummary />

                <ProfessorFeedback />

                <ResultActions />

            </main>

        </>
    );
};

export default QuizResult;