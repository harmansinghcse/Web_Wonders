import HeroContent from "./HeroContent";
import Navbar from "./Navbar";

const heroImage = "/jurrasic-home-bg.png";

export default function Hero() {
    return (
        <section className="relative min-h-screen bg-white lg:min-h-screen">
            {/* Background */}
            <img
                src={heroImage}
                alt="Jurassic Landscape"
                className="absolute inset-0 h-full w-full object-cover object-[80%_top] sm:object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-[#F8F6F1]/15 via-[#F8F6F1]/10 to-transparent" />

            {/* Soft Light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,#FFFFFF_0%,transparent_45%)] opacity-55" />

            {/* Content */}
            <div className="relative z-10 flex min-h-screen flex-col lg:min-h-screen">
                {/* Navbar */}
                <Navbar />

                {/* Hero Content */}
                <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pt-24 pb-8 sm:px-8 sm:pt-32 lg:px-12 lg:pt-28 lg:pb-12">
                    <div className="flex-1">
                        <HeroContent />
                    </div>
                </div>
            </div>
        </section>
    );
}
