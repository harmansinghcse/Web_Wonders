import QuizContent from "./QuizContent";
import QuizVisual from "./QuizVisual";
import quizBackground from "../../../assets/home-assets/quiz-background.png";

export default function QuizSection() {
    return (
        <section
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8F4EA] bg-no-repeat bg-cover bg-center py-20 lg:py-0"
            style={{
                backgroundImage: `url(${quizBackground})`,
            }}
        >
            {/* Ambient visual overlay highlights */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(234,243,228,0.5),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(248,244,234,0.9),transparent_60%)]" />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:px-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
                <QuizContent />
                <QuizVisual />
            </div>
        </section>
    );
}
