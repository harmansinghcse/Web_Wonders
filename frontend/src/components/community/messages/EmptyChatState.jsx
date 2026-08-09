import React from "react";
import { MessageSquare, Loader2 } from "lucide-react";

export default function EmptyChatState({
    loadingFollowing,
    followingList,
    handleStartConversation,
    navigate
}) {
    return (
        <div className="w-full py-8 px-4 text-center">
            <div className="h-16 w-16 bg-[#EBF5EE] rounded-full flex items-center justify-center mx-auto text-[#1E3A23] border border-[#D1E2D3] mb-4">
                <MessageSquare size={32} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E3A23] mb-4">Start a Conversation</h3>
            
            {loadingFollowing ? (
                <div className="flex flex-col items-center justify-center py-6 text-[#6D7A6F]">
                    <Loader2 className="animate-spin mb-2" size={20} />
                    <span className="text-xs">Loading people you follow...</span>
                </div>
            ) : followingList.length > 0 ? (
                <div className="max-w-md mx-auto space-y-2 text-left max-h-[300px] overflow-y-auto pr-2">
                    <p className="text-xs text-[#6D7A6F] font-bold border-b border-[#F0EFE8] pb-1.5 mb-2">People you follow</p>
                    {followingList.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF9F5] border border-transparent hover:border-[#EBE8DB] transition">
                            <div className="flex items-center gap-3">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover border border-[#1E3A23]/10" />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-[#E4ECE3] flex items-center justify-center font-bold text-xs text-[#2A5231]">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-xs font-bold text-[#1E3A23]">{user.name}</h4>
                                    <p className="text-[10px] text-[#6D7A6F]">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleStartConversation(user.id)}
                                className="rounded-xl bg-[#1E3A23] text-white px-3.5 py-1.5 text-xs font-bold hover:bg-[#152A19] transition cursor-pointer"
                            >
                                Message
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-xs max-w-xs mx-auto leading-relaxed text-[#6D7A6F]">
                        You aren't following anyone yet. Explore the community and find people whose dinosaur interests match yours.
                    </p>
                    <button
                        onClick={() => navigate("/community")}
                        className="rounded-xl bg-[#1E3A23] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#152A19] transition cursor-pointer"
                    >
                        Explore Community
                    </button>
                </div>
            )}
        </div>
    );
}
