import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/home_components/hero/Navbar";

import QuizHeader from "../components/quiz/play/QuizHeader";
import QuestionCard from "../components/quiz/play/QuestionCard";
import HintCard from "../components/quiz/play/HintCard";
import QuizNavigation from "../components/quiz/play/QuizNavigation";

const dailyQuestions = [
    {
        id: 1,
        text: "Which dinosaur is known for having three horns?",
        hint: "Think of the dinosaur with a large frill around its head.",
        options: [
            "Triceratops",
            "Velociraptor",
            "Stegosaurus",
            "Brachiosaurus",
        ],
        answer: 0,
    },

    {
        id: 2,
        text: "Which dinosaur is famous for its extremely long neck?",
        hint: "Think of one of the famous long-necked dinosaurs.",
        options: [
            "Brachiosaurus",
            "Tyrannosaurus Rex",
            "Triceratops",
            "Velociraptor",
        ],
        answer: 0,
    },

    {
        id: 3,
        text: "What does the word Dinosauria roughly mean?",
        hint: "The name comes from ancient Greek words.",
        options: [
            "Terrible lizards",
            "Giant animals",
            "Ancient birds",
            "Huge reptiles",
        ],
        answer: 0,
    },
];

const DailyChallenge = () => {
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);

    const question = dailyQuestions[currentQuestion];

    const handleNext = () => {
        // Don't continue without selecting an answer
        if (selectedOption === null) {
            return;
        }

        const isCorrect = selectedOption === question.answer;

        const updatedScore = isCorrect
            ? score + 1
            : score;

        setScore(updatedScore);

        // Last question
        if (currentQuestion === dailyQuestions.length - 1) {

            navigate("/daily-challenge/result", {
                state: {
                    score: updatedScore,
                },
            });

            return;
        }

        // Move to next question
        setCurrentQuestion((previous) => previous + 1);

        // Clear selected answer
        setSelectedOption(null);
    };

    const handlePrevious = () => {

        if (currentQuestion === 0) {
            navigate("/quiz");
            return;
        }

        setCurrentQuestion((previous) => previous - 1);

        setSelectedOption(null);
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8F5EF] pt-24 pb-16">

                {/* Daily Challenge Intro */}

                <div className="mx-auto max-w-6xl px-6 pt-8">

                    <div className="mb-8">

                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#47613F]">
                            Daily Challenge
                        </p>

                        <h1 className="mt-2 text-4xl font-bold text-[#2A2A2A]">
                            Jurassic Sprint
                        </h1>

                        <p className="mt-2 max-w-2xl text-gray-600">
                            Complete today's 3-question challenge
                            and earn bonus DNA points.
                        </p>

                    </div>

                </div>

                {/* Quiz Header */}

                <QuizHeader
                    topic="Daily Challenge"
                    currentQuestion={currentQuestion + 1}
                    totalQuestions={dailyQuestions.length}
                />

                {/* Question */}

                <QuestionCard
                    question={question}
                    selectedOption={selectedOption}
                    onSelect={setSelectedOption}
                />

                {/* Hint */}

                <HintCard
                    hint={question.hint}
                />

                {/* Navigation */}

                <QuizNavigation
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />

            </main>
        </>
    );
};

export default DailyChallenge;