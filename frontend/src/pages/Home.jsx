import Hero from "../components/home_components/hero/Hero";
import CreateSection from "../components/home_components/create/CreateSection";
import QuizSection from "../components/home_components/quiz/QuizSection";

export default function Home() {
    return (
        <>
            <Hero />
            <CreateSection />
            <QuizSection />

            {/* <TrendingSection />
            <Footer /> */}
        </>
    );
}
