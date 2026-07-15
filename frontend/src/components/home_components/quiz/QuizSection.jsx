import QuizContent from "./QuizContent";
import QuizVisual from "./QuizVisual";
import quizBackground from "../../../assets/home-assets/quiz-background.png";


export default function QuizSection() {
    return (
        
        <section className="relative overflow-hidden py-16 lg:py-20 bg-[#F8F4EA] bg-no-repeat bg-cover bg-center"
        style={{
            backgroundImage:`url(${quizBackground})`,
        }}>
            
            <div className="mx-auto grid max-w-[1380px] grid-cols-1 items-center gap-16 px-8 lg:grid-cols-[1fr_1.15fr]">

                <QuizContent />
                <QuizVisual />

            </div>

        </section>
    );
}