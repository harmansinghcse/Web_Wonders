import { useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
/**
 * --------------------------------------------
 * Component: ChatInput
 * Purpose:
 * Provides an input area where users can
 * type and send messages to Professor Ross.
 * It also prevents empty messages and
 * disables sending while a response is loading.
 * --------------------------------------------
 */

const ChatInput = ({ onSend, loading }) => {
     // Stores the user's current message
    const [message, setMessage] = useState("");
    // Handles sending the user's message
    const handleSend = () => {
         // Prevent sending empty messages or sending while loading
        if (!message.trim() || loading) return;
        const text = message;
         // Clear the input field after sending
        setMessage("");
         // Pass the message to the parent component
        onSend(text);
    };

    return (
        // Chat input container
        <div className="mx-auto mt-12 w-[95%] max-w-5xl" mb-5>
            {/* Input box */}
            <div className="rounded-3xl border border-[#E8E1CF] bg-white p-4 shadow-md">
                <div className="flex items-center gap-4">
                     {/* Attachment icon */}
                    <Paperclip className="text-gray-400" size={22} />
                    {/* User message input */}
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
