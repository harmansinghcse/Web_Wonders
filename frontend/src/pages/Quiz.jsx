const quiz_bg = "./quiz-bg.png";
import Navbar from "../components/home_components/hero/navbar";

export default function Quiz() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white lg:h-screen">
            <Navbar />
            <img
                src={quiz_bg}
                alt="Quiz Background"
                className="absolute inset-0 h-full w-full object-cover object-[80%_top] sm:object-top"
            />
        </div>
    );
}
