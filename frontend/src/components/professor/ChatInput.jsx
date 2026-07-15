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
        <div className="mx-auto w-full max-w-5xl px-4 md:px-0 mb-4 sm:mb-6">
            {/* Input box */}
            <div className="rounded-[22px] sm:rounded-[28px] border border-[#E8E1CF] bg-white p-2.5 sm:p-4 shadow-md focus-within:ring-2 focus-within:ring-[#6C8E4E]/30 focus-within:border-[#6C8E4E] transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                     {/* Attachment icon */}
                    <Paperclip className="text-gray-400 hover:text-gray-600 cursor-pointer transition shrink-0" size={20} />
                    {/* User message input */}
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        type="text"
                        placeholder="Ask Professor Ross..."
                        className="flex-1 bg-transparent text-sm sm:text-base md:text-lg outline-none placeholder:text-gray-400 text-gray-800"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="rounded-xl sm:rounded-2xl bg-[#6C8E4E] p-2.5 sm:p-3 text-white transition-all duration-200 hover:bg-[#5D7E42] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:hover:bg-[#6C8E4E] cursor-pointer shrink-0"
                    >
                        <SendHorizontal size={18} className="sm:hidden" />
                        <SendHorizontal size={22} className="hidden sm:block" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
