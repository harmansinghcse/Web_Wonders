import { Link } from "react-router-dom";

export default function HeroButtons() {
    const scrollToNext = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* button at Home page */}
            <button
                onClick={scrollToNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#005611] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2A4530]"
            >
                <span className="font-extrabold">↓</span>
                Scroll to explore
            </button>

            <Link
                to="/professor"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#005611] bg-white/50 backdrop-blur-sm px-6 py-[10px] text-sm font-bold text-[#005611] shadow-md transition hover:-translate-y-0.5 hover:bg-[#005611] hover:text-white"
            >
                Meet Professor Ross 🦖
            </Link>
        </div>
    );
}

