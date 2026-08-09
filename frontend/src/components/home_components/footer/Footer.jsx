import {
  BookOpen,
  MapPin,
  Clock3,
  Gamepad2,
  CircleHelp,
  Users,
  Mail,
  SquarePlus,
  ArrowUp,
} from "lucide-react";

import FooterLogo from "./FooterLogo";
import FooterColumn from "./FooterColumn";
import FooterItem from "./FooterItem";

const Footer = () => {
    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative w-full bg-top bg-cover bg-no-repeat min-h-[300px]"
        style={{backgroundImage: "url('/footer-bg.webp')"}}
        >
        
            <div className="max-w-[1400px] mx-auto px-8 lg:px-12 xl:px-16 pt-10 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-x-10 items-start">

                    {/* Logo */}
                    <div>
                        <FooterLogo/>
                    </div>

                    {/* Explore */}
                    <div className="border-l border-[#D9D1C2] pl-6">

                        <FooterColumn title="Explore">

                            <FooterItem icon={BookOpen} to="/explore">
                                Dinosaur Encyclopedia
                            </FooterItem>

                            <FooterItem icon={MapPin} to="map">
                                Map View
                            </FooterItem>

                            <FooterItem icon={Clock3} to="/timeline">
                                Timeline View
                            </FooterItem>

                            <div className="my-1 w-full h-px bg-[#D9D3C5]"></div>

                            <h4 className="text-lg font-bold uppercase text-[#45653A]">
                                Create
                            </h4>

                            <FooterItem icon={SquarePlus} to="/create">
                                Create Your Dinosaur
                            </FooterItem>

                        </FooterColumn>

                    </div>

                    {/* Learn */}
                    <div className="border-l border-[#D9D1C2] pl-6">
                        <FooterColumn title="Learn">

                            <FooterItem icon={CircleHelp} to="/quiz">
                            Interactive Quiz
                            </FooterItem>

                            <FooterItem icon={Gamepad2} to="/games">
                            Games
                            </FooterItem>

                            <FooterItem icon={Users} to="/community">
                            Community
                            </FooterItem>

                        </FooterColumn>
                    </div>

                    {/* Contact */}
                    <div className="border-l border-[#D9D1C2] pl-6">
                        <FooterColumn title="Contact">

                            <div className="flex items-start gap-3">

                            <Mail
                                size={18}
                                className="mt-1 flex-shrink-0 text-[#45653A]"
                            />

                            <p className="max-w-[240px] text-[14px] leading-6 text-[#2F2F2F]">
                                This website is a student initiative built for a competition.
                            </p>

                            </div>

                            <div className="w-full h-px bg-[#D9D3C5] my-3"></div>

                            <p className="text-[16px] italic leading-7 text-[#45653A]">
                            Learning today,
                            <br />
                            shaping tomorrow.
                            </p>

                        </FooterColumn>
                    </div>

                </div>

                <button
                    onClick={handleBackToTop}
                    aria-label="Back to top"
                    className="
                        group
                        absolute
                        bottom-6
                        right-8
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[#45653A]/30
                        bg-[#F7F2E7]/90
                        px-4
                        py-2
                        text-[13px]
                        font-medium
                        text-[#45653A]
                        shadow-sm
                        backdrop-blur-sm
                        transition-all
                        duration-300
                        hover:bg-[#45653A]
                        hover:text-white
                        hover:shadow-md
                    ">
                    <ArrowUp
                        size={15}
                        className="
                        transition-transform
                        duration-300
                        group-hover:-translate-y-1"
                    />

                    <span>Back to Top</span>
                </button>
            </div>
        </footer>
    );
}

export default Footer;