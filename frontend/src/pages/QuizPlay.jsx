import { useState } from "react";
import Navbar from "../components/home_components/hero/Navbar";

import QuizHeader from "../components/quiz/play/QuizHeader";
import QuestionCard from "../components/quiz/play/QuestionCard";
import HintCard from "../components/quiz/play/HintCard";
import QuizNavigation from "../components/quiz/play/QuizNavigation";
import fossilImage from "../assets/quiz-assets/topic-fossils.png";

// TODO (Backend)
//
// Route:
//
// /quiz/play/:slug/:difficulty
//
// Later:
//
// const { slug, difficulty } = useParams();
//
// const quizData = await GET /api/quiz/play/:slug/:difficulty;

const QuizPlay = () => {

    const [selectedOption, setSelectedOption] = useState(null);

    const [currentQuestion] = useState(4);

    const totalQuestions = 20;

    const quizData = {
        topic: "Fossils",
        question: {
            id: 1,
            text: "Which fossil preserves insects trapped inside tree resin?",
            image: fossilImage,
            hint: "Think about tree resin.",
            options: [
                "Amber Fossil",
                "Trace Fossil",
                "Cast Fossil",
                "Mold Fossil",
            ],
        },
    };

    const handleNext = () => {
        // TODO (Backend)

        // Submit Answer

        // Load Next Question

        // Navigate to Result

        console.log("Next Question");
    };

    const handlePrevious = () => {
        console.log("Previous");
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24">

                <QuizHeader
                    topic={quizData.topic}
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                />

                <QuestionCard
                    question={quizData.question}
                    selectedOption={selectedOption}
                    onSelect={setSelectedOption}
                />

                <HintCard
                    hint={quizData.question.hint}
                />

                <QuizNavigation
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />

            </main>

        </>
    );
};

export default QuizPlay;