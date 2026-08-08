import { useNavigate } from "react-router-dom";

const FooterLogo = () => {
    const navigate = useNavigate();

    const handleLogoClick = (e) => {
        e.preventDefault();

        // Go to the main homepage
        navigate("/");

        // Make sure the homepage starts from the very top
        setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        }, 100);
    };
    return (
        <div className="flex flex-col pl-16 lg:pl-20">
            {/* Clickable Logo */}
            <button
                onClick={handleLogoClick}
                aria-label="Go to Jurassic Explorer homepage"
                className="ml-8 w-fit cursor-pointer border-none bg-transparent p-0 text-left"
            >
                {/* Logo Placeholder */}
                <img
                    src="/jurassic-explorer-logo.png"
                    alt="Jurassic Explorer"
                    className="w-36  h-auto object-contain transition-transform duration-300 ease-out hover:scale-[1.02]"
                />
            </button>
            

            {/* Description */}
            <p className="mt-2 max-w-[250px] text-[14px] leading-6 text-[#5B5B5B]">
                Explore dinosaurs, fossils, evolution and prehistoric life
                through interactive experiences and engaging adventures.
            </p>

        </div>
    );
};

export default FooterLogo;