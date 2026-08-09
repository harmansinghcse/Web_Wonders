import React, { useEffect, useState } from "react";
import { decryptMessage } from "../../../utils/encryption";

export default function ConversationItem({ conv, currentUser, isActive, onClick }) {
    const [decryptedText, setDecryptedText] = useState("...");
    const recipient = conv.participants.find(p => p._id.toString() !== currentUser.id.toString());
    
    useEffect(() => {
        const decryptLastMessage = async () => {
            if (conv.lastMessage) {
                // Decrypt the last message client-side
                const text = await decryptMessage(conv.lastMessage.content, conv._id);
                setDecryptedText(text);
            } else {
                setDecryptedText("Started a chat");
            }
        };
        decryptLastMessage();
    }, [conv.lastMessage, conv._id]);

    if (!recipient) return null;

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer transition ${
                isActive
                    ? "bg-[#EBF5EE] border border-[#D1E2D3]"
                    : "hover:bg-[#FAF9F5] border border-transparent"
            }`}
        >
            <div className="relative shrink-0">
                {recipient.avatar ? (
                    <img
                        src={recipient.avatar}
                        alt={recipient.name}
                        className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/20"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-[#E4ECE3] border border-[#1E3A23]/20 flex items-center justify-center font-bold text-xs text-[#2A5231]">
                        {recipient.name[0].toUpperCase()}
                    </div>
                )}
                {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                        {conv.unreadCount}
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-bold truncate text-[#1E3A23]">
                        {recipient.name}
                    </h4>
                    <span className="text-[10px] text-[#6D7A6F] shrink-0">
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ""}
                    </span>
                </div>
                <p className={`text-xs truncate ${conv.unreadCount > 0 ? "font-bold text-[#1E3A23]" : "text-[#6D7A6F]"}`}>
                    {decryptedText}
                </p>
            </div>
        </div>
    );
}
