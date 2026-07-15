/**
 * --------------------------------------------
 * Component: ChatBubble
 * Purpose:
 * Displays an individual chat message in the
 * conversation. It supports both user and
 * assistant messages, along with a typing
 * animation and message timestamp.
 * --------------------------------------------
 */
const ChatBubble = ({
    role = "assistant",
    message,
    time,
    isTyping = false,
}) => {
    // Determines whether the message belongs to the user
    const isUser = role === "user";
  // Formats the message timestamp or uses the current time if unavailable
    const formattedTime =
        time ??
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
         // Chat bubble container
        <div
            className={`flex gap-2 sm:gap-4 ${
                isUser ? "justify-end items-end" : "justify-start items-start"
            }`}
        > {/* Assistant avatar */}
            {!isUser && (
                <img
                    src="/ross-avatar.png"
                    alt="Professor Ross"
                    className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 rounded-full border-2 border-[#B8D768] object-cover shadow-md transition duration-300"
                />
            )}
            {/* Message bubble */}
            <div
                className={`relative max-w-[88%] sm:max-w-[80%] md:max-w-[75%] border px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 shadow-sm ${
                    isUser
                        ? "rounded-[22px] rounded-tr-md md:rounded-[28px] md:rounded-tr-lg border-[#D2DEAA] bg-[#DDE8B8]"
                        : "rounded-[22px] rounded-tl-md md:rounded-[28px] md:rounded-tl-lg border-[#ECE8D9] bg-white"
                }`}
            >{/* Display typing animation or message text */}
                {isTyping ? (
                    <div className="flex gap-1.5 py-1 sm:py-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap break-words text-[15px] sm:text-lg md:text-[20px] leading-relaxed sm:leading-8 md:leading-9 text-gray-800 font-normal">
                        {message}
                    </p>
                )}
                {/* Message timestamp and delivery status */}
                <div className="mt-2 sm:mt-4 md:mt-5 flex items-center justify-end gap-1.5 text-[10px] sm:text-xs text-gray-400">
                     {/* Time when the message was sent */}
                    <span>{formattedTime}</span>
                    {/* Read indicator for user messages */}
                    {isUser && (
                        <span className="font-semibold text-[#6C8E4E]">✓✓</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
