import { useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";

const ChatInput = ({ onSend, loading }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim() || loading) return;
        const text = message;
        setMessage("");
        onSend(text);
    };

    return (
        <div className="mx-auto mt-12 w-[95%] max-w-5xl" mb-5>
            <div className="rounded-3xl border border-[#E8E1CF] bg-white p-4 shadow-md">
                <div className="flex items-center gap-4">
                    <Paperclip className="text-gray-400" size={22} />
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        type="text"
                        placeholder="Ask Professor Ross..."
                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="rounded-2xl bg-[#6C8E4E] p-3 text-white transition hover:bg-[#5D7E42] disabled:opacity-50"
                    >
                        <SendHorizontal size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
