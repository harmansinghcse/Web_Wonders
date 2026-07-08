import Navbar from "../components/home_components/navbar";
import StatsSection from "../components/home_components/stat_section";
import WelcomeHome from "../components/home_components/home-welcome";

function Home() {
  return (
    <>
      <div className="min-h-screen bg-[url('/mobile-home-page.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/jurrasic-home-bg.jpeg')]">
        <div className="pt-4">
          <Navbar />
          <WelcomeHome />
          <StatsSection />
        </div>
      </div>
    </>
  );
}

export default Home;
