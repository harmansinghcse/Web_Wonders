import HeroContent from "./HeroContent";
import Navbar from "./Navbar";

const heroImage = "/jurrasic-home-bg.jpeg";

export default function Hero() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-white lg:h-screen">
            {/* Background */}
            <img
                src={heroImage}
                alt="Jurassic Landscape"
                className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-white/85 via-white/50 to-transparent sm:from-white/60 sm:via-white/35" />

            {/* Soft Light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,#FFFFFF_0%,transparent_45%)] opacity-60" />

            {/* Bottom fade into next section */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-[#EFEAE0] sm:h-56" />

            {/* Content */}
            <div className="relative z-10 flex min-h-screen flex-col lg:h-full">
                {/* Navbar */}
                <Navbar />

                {/* Hero Content */}
                <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pt-32 pb-10 sm:px-8 sm:pt-40 lg:px-12 lg:pt-44">
                    <div className="flex-1">
                        <HeroContent />
                    </div>
                </div>
            </div>
        </section>
    );
}
