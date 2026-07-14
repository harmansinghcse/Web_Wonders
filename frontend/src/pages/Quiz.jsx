import Navbar from "../components/home_components/hero/Navbar";
import DashboardHero from "../components/quiz/dashboard/DashboardHero";
import StatsCards from "../components/quiz/dashboard/StatsCards";
import TopicGrid from "../components/quiz/dashboard/TopicGrid";

const Quiz = () => {
    return (
        <>
            <Navbar/>

            <main className="min-h-screen bg-[#F8F5EF] pt-24">
                <DashboardHero/>
                <StatsCards/>
                <TopicGrid/>
            </main>
        </>
    );
};

export default Quiz;