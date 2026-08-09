import React from "react";
import { X, Search, Loader2 } from "lucide-react";

export default function NewChat({
    showSearchModal,
    setShowSearchModal,
    searchQuery,
    setSearchQuery,
    searchingUsers,
    searchResults,
    handleStartConversation,
    followingList,
    loadingFollowing
}) {
    if (!showSearchModal) return null;

    return (
        <div className="fixed inset-0 z-50 bg-[#0E1A11]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#EBE8DB] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-[#F0EFE8] flex items-center justify-between bg-[#FAF9F5]">
                    <h3 className="font-serif font-bold text-sm text-[#1E3A23]">New Conversation</h3>
                    <button
                        onClick={() => {
                            setShowSearchModal(false);
                            setSearchQuery("");
                        }}
                        className="text-[#6D7A6F] hover:text-[#1E3A23] cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b border-[#F0EFE8] relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search explorers by name..."
                        className="w-full rounded-xl border border-[#EBE8DB] pl-9 pr-4 py-2 text-xs focus:border-[#1E3A23] focus:outline-none"
                    />
                    <Search className="absolute left-7 top-5 text-[#6D7A6F]" size={14} />
                </div>

                {/* Results list */}
                <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {searchQuery.trim() ? (
                        searchingUsers ? (
                            <div className="text-center py-8 text-xs text-[#6D7A6F]">
                                Searching for explorers...
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-center py-8 text-xs text-[#6D7A6F]">
                                No explorers found.
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <div
                                    key={user._id || user.id}
                                    onClick={() => handleStartConversation(user._id || user.id)}
                                    className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#FAF9F5] cursor-pointer transition"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-9 w-9 rounded-full object-cover border border-[#1E3A23]/10"
                                        />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-[#E4ECE3] flex items-center justify-center font-bold text-xs text-[#2A5231] border border-[#1E3A23]/10">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#1E3A23]">{user.name}</h4>
                                        <p className="text-[10px] text-[#6D7A6F] bg-[#EBF5EE] px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        <div>
                            <p className="text-xs font-bold text-[#6D7A6F] px-3 py-1.5 border-b border-[#F0EFE8] mb-1.5">People you follow</p>
                            {loadingFollowing ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="animate-spin text-[#1E3A23]" size={16} />
                                </div>
                            ) : followingList.length === 0 ? (
                                <div className="text-center py-6 text-xs text-[#8A968C]">
                                    You aren't following anyone yet.
                                </div>
                            ) : (
                                followingList.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleStartConversation(user.id)}
                                        className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#FAF9F5] cursor-pointer transition"
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-9 w-9 rounded-full object-cover border border-[#1E3A23]/10"
                                            />
                                        ) : (
                                            <div className="h-9 w-9 rounded-full bg-[#E4ECE3] flex items-center justify-center font-bold text-xs text-[#2A5231] border border-[#1E3A23]/10">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-bold text-[#1E3A23]">{user.name}</h4>
                                            <p className="text-[10px] text-[#6D7A6F] bg-[#EBF5EE] px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                                {user.role}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
