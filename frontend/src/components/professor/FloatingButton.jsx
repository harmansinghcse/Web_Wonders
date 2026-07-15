import {MessageCircle} from "lucide-react";
/**
 * --------------------------------------------
 * Component: FloatingButton
 * Purpose:
 * Displays a floating action button that
 * allows users to quickly navigate to the
 * top of the page and access Professor Ross.
 * --------------------------------------------
 */
const FloatingButton = () => {
     // Smoothly scrolls the page to the top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        // Floating action button
        <button
            onClick={scrollToTop}
            title="Chat with Professor Ross"
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3 rounded-full bg-[#36593D] px-5 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
             {/* Chat icon */}
            <MessageCircle size={22} />
            {/* Button text */}
            <div className="flex flex-col items-start leading-none">
                 {/* Small label */}
                <span className="text-xs opacity-80">
                    Ask
                </span>
                 {/* Assistant name */}
                <span className="font-semibold">
                    Ross
                </span>
            </div>
        </button>
    );
};
export default FloatingButton;