import {MessageCircle} from "lucide-react";

const FloatingButton = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        <button
            onClick={scrollToTop}
            title="Chat with Professor Ross"
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3 rounded-full bg-[#36593D] px-5 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
            <MessageCircle size={22} />
            <div className="flex flex-col items-start leading-none">
                <span className="text-xs opacity-80">
                    Ask
                </span>

                <span className="font-semibold">
                    Ross
                </span>
            </div>
        </button>
    );
};
export default FloatingButton;