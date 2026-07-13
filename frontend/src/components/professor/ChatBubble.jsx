const ChatBubble = ({ type, message, time }) => {
  const isUser = type === "user";

  return (
    <div
      className={`flex gap-4 ${isUser ? "justify-end items-end" : "justify-start items-start"}`}
    >
      {/* Professor Avatar */}
      {!isUser && (
        <img src="/ross-avatar.png" alt="Professor" className="h-16 w-16 rounded-full border-2 border-[#B8D768] object-cover shadow-bd flex-shrink-0"/>
      )}

      {/* Bubble */}
      <div
        className={`relative px-8 py-6 shadow-sm border ${
          isUser
            ? "bg-[#DDE8B8] border-[#D2DEAA] rounded-[28px] rounded-tr-lg max-w-[720px]"
            : "bg-white border-[#ECE8D9] rounded-[28px] rounded-tl-lg max-w-[720px]"
        }`}
      >
        <p className="whitespace-pre-line leading-9 text-[20px] text-gray-800">
          {message}
        </p>

        <div className="mt-5 flex justify-end items-center gap-2 text-xs text-gray-400">
          <span>{time}</span>
          {isUser && (
            <span className="font-semibold text-[#6C8E4E]">
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;