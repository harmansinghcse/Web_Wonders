import React, { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSendMessage }) {
    const [messageInput, setMessageInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        onSendMessage(messageInput.trim());
        setMessageInput("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-[#F0EFE8] bg-white flex gap-2 items-center shrink-0"
        >
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-[#EBE8DB] px-4 py-2 text-xs focus:border-[#1E3A23] focus:outline-none"
            />
            <button
                type="submit"
                disabled={!messageInput.trim()}
                className="rounded-full bg-[#1E3A23] p-2.5 text-white hover:bg-[#152A19] transition cursor-pointer disabled:opacity-40"
            >
                <Send size={14} />
            </button>
        </form>
    );
}
