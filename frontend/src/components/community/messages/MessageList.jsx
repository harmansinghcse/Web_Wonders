import React from "react";
import { Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
    messages,
    currentUser,
    conversationId,
    loadingMessages,
    hasMoreMessages,
    loadingOlder,
    loadOlderMessages,
    threadContainerRef,
    messageEndRef
}) {
    return (
        <div
            ref={threadContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5]/40"
        >
            {hasMoreMessages && (
                <div className="text-center py-2 shrink-0">
                    <button
                        onClick={loadOlderMessages}
                        disabled={loadingOlder}
                        className="text-xs font-bold text-[#1E3A23] hover:underline bg-white px-3 py-1.5 rounded-full shadow-xs border border-[#EBE8DB] cursor-pointer disabled:opacity-50"
                    >
                        {loadingOlder ? "Loading older messages..." : "Load older messages"}
                    </button>
                </div>
            )}

            {loadingMessages ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#6D7A6F]">
                    <Loader2 className="animate-spin mb-2" size={24} />
                    <span className="text-xs">Loading thread...</span>
                </div>
            ) : (
                messages.map((msg) => (
                    <MessageBubble
                        key={msg._id}
                        msg={msg}
                        currentUser={currentUser}
                        conversationId={conversationId}
                    />
                ))
            )}
            <div ref={messageEndRef} />
        </div>
    );
}
