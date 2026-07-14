const ChatBubble = ({
    role = "assistant",
    message,
    time,
    isTyping = false,
}) => {
    const isUser = role === "user";

    const formattedTime =
        time ??
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div
            className={`flex gap-4 ${
                isUser ? "justify-end items-end" : "justify-start items-start"
            }`}
        >
            {!isUser && (
                <img
                    src="/ross-avatar.png"
                    alt="Professor Ross"
                    className="h-16 w-16 shrink-0 rounded-full border-2 border-[#B8D768] object-cover shadow-md"
                />
            )}

            <div
                className={`relative max-w-[75%] border px-8 py-6 shadow-sm ${
                    isUser
                        ? "rounded-[28px] rounded-tr-lg border-[#D2DEAA] bg-[#DDE8B8]"
                        : "rounded-[28px] rounded-tl-lg border-[#ECE8D9] bg-white"
                }`}
            >
                {isTyping ? (
                    <div className="flex gap-2 py-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap wrap-break-words text-[20px] leading-9 text-gray-800">
                        {message}
                    </p>
                )}

                <div className="mt-5 flex items-center justify-end gap-2 text-xs text-gray-400">
                    <span>{formattedTime}</span>

                    {isUser && (
                        <span className="font-semibold text-[#6C8E4E]">✓✓</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
