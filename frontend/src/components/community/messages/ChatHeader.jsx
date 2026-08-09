import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ChatHeader({ recipient, onBack, onNavigateToProfile }) {
    if (!recipient) return null;

    return (
        <div className="p-4 border-b border-[#F0EFE8] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-1.5 hover:bg-[#FAF9F5] rounded-full md:hidden text-[#6D7A6F] cursor-pointer"
                    title="Back to conversations"
                >
                    <ArrowLeft size={18} />
                </button>
                
                <div 
                    onClick={onNavigateToProfile}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    {recipient.avatar ? (
                        <img
                            src={recipient.avatar}
                            alt={recipient.name}
                            className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/20 group-hover:scale-105 transition"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-[#E4ECE3] border border-[#1E3A23]/20 flex items-center justify-center font-bold text-[#2A5231] group-hover:scale-105 transition">
                            {recipient.name[0].toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="text-sm font-bold text-[#1E3A23] group-hover:underline">
                            {recipient.name}
                        </h3>
                        <span className="text-[10px] text-[#6D7A6F] font-semibold bg-[#E4ECE3] px-2 py-0.5 rounded-md">
                            {recipient.role || "Explorer"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
