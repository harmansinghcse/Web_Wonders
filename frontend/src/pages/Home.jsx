import Navbar from "../components/home_components/navbar";
import StatsSection from "../components/home_components/stat_section";
import WelcomeHome from "../components/home_components/home-welcome";

function Home() {
    return (
        <div>
            <div
                className="min-h-screen bg-cover bg-center"
                style={{
                    backgroundImage: "url('/jurrasic-home-bg.jpeg')",
                }}
            >
                <div className="pt-4">
                    <Navbar />
                    <WelcomeHome />
                    <StatsSection />
                </div>
            </div>
        </div>
    );
}

export default Home;
