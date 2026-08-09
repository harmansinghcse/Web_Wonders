import React, { useEffect, useState } from "react";
import { decryptMessage } from "../../../utils/encryption";

export default function MessageBubble({ msg, currentUser, conversationId }) {
    const [decryptedText, setDecryptedText] = useState("...");
    const isSelf = msg.sender._id.toString() === currentUser.id.toString() || msg.sender === currentUser.id;

    useEffect(() => {
        const decryptText = async () => {
            const text = await decryptMessage(msg.content, conversationId);
            setDecryptedText(text);
        };
        decryptText();
    }, [msg.content, conversationId]);

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex flex-col max-w-[75%] ${isSelf ? "ml-auto items-end" : "mr-auto items-start"}`}>
            <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-xs leading-relaxed ${
                isSelf ? "bg-[#1E3A23] text-white rounded-tr-xs" : "bg-white border border-[#EBE8DB] text-[#1E3A23] rounded-tl-xs"
            }`}>
                {decryptedText}
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-[9px] text-[#6D7A6F] font-bold px-1">
                <span>{formatTime(msg.createdAt)}</span>
                {msg.isPending && <span className="animate-pulse">● Sending...</span>}
                {msg.isFailed && <span className="text-red-500 font-bold">✕ Failed</span>}
            </div>
        </div>
    );
}
