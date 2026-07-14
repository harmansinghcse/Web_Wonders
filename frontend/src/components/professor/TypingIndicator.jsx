const TypingIndicator = () => {
    return (
        <div className="flex items-start gap-4">
            <img
                src="/ross-avatar.png"
                alt="Professor Ross"
                className="h-14 w-14 rounded-full border-2 border-[#B8D768] object-cover shadow-md"
            />
            <div className="rounded-[28px] rounded-tl-lg border border-[#ECE8D9] bg-white px-8 py-5 shadow-sm">
                <div className="flex gap-2">
                    <span className="h-3 w-3 animate-bounce rounded-full bg-[#6C8E4E]" />

                    <span
                        className="h-3 w-3 animate-bounce rounded-full bg-[#6C8E4E]"
                        style={{ animationDelay: "0.2s" }}
                    />

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
