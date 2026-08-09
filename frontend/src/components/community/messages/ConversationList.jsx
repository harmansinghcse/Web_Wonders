import React, { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import ConversationItem from "./ConversationItem";

export default function ConversationList({
    conversations,
    currentUser,
    activeConversation,
    loadingConversations,
    selectConversation,
    setShowSearchModal
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = conversations.filter(conv => {
        const recipient = conv.participants.find(p => p._id.toString() !== currentUser.id.toString());
        if (!recipient) return false;
        return recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="w-full flex flex-col h-full">
            <div className="p-4 border-b border-[#F0EFE8] flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#1E3A23]">Conversations</h2>
                <button
                    onClick={() => setShowSearchModal(true)}
                    className="rounded-full bg-[#1E3A23] p-2 text-white hover:bg-[#152A19] transition cursor-pointer"
                    title="New Conversation"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="p-3 border-b border-[#F0EFE8]">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search chats..."
                        className="w-full rounded-xl border border-[#EBE8DB] pl-9 pr-4 py-2 text-xs focus:border-[#1E3A23] focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 text-[#6D7A6F]" size={14} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loadingConversations ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[#6D7A6F]">
                        <Loader2 className="animate-spin mb-2" size={24} />
                        <span className="text-xs">Loading chats...</span>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="text-center py-12 px-4 text-[#6D7A6F] space-y-2">
                        <p className="text-xs font-bold">No chats found</p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <ConversationItem
                            key={conv._id}
                            conv={conv}
                            currentUser={currentUser}
                            isActive={activeConversation?._id === conv._id}
                            onClick={() => selectConversation(conv)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
