/**
 * --------------------------------------------
 * Component: TypingIndicator
 * Purpose:
 * Displays a typing animation to indicate
 * that Professor Ross is generating a
 * response to the user's message.
 * --------------------------------------------
 */
const TypingIndicator = () => {
    return (
        // Typing indicator container
        <div className="flex items-start gap-4">
             {/* Professor Ross avatar */}
            <img
                src="/ross-avatar.png"
                alt="Professor Ross"
                className="h-14 w-14 rounded-full border-2 border-[#B8D768] object-cover shadow-md"
            />
            {/* Typing animation bubble */}
            <div className="rounded-[28px] rounded-tl-lg border border-[#ECE8D9] bg-white px-8 py-5 shadow-sm">
                 {/* Animated typing dots */}
                <div className="flex gap-2">
                    {/* First typing dot */}
                    <span className="h-3 w-3 animate-bounce rounded-full bg-[#6C8E4E]" />
                     {/* Second typing dot */}
                    <span
                        className="h-3 w-3 animate-bounce rounded-full bg-[#6C8E4E]"
                        style={{ animationDelay: "0.2s" }}
                    />
                     {/* Third typing dot */}
                    <span
                        className="h-3 w-3 animate-bounce rounded-full bg-[#6C8E4E]"
                        style={{ animationDelay: "0.4s" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
