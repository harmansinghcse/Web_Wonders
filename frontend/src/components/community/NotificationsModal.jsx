import React, { useState } from "react";
import { X, Bell, Heart, MessageSquare, Dna, Trophy, CheckCheck } from "lucide-react";

export default function NotificationsModal({ currentUser, onClose }) {
    const defaultNotifications = [
        {
            id: "n-1",
            type: "like",
            user: "Rohan Explorer",
            userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
            text: "liked your Tyrastego hybrid post.",
            timeAgo: "10 mins ago",
            isUnread: true,
        },
        {
            id: "n-2",
            type: "comment",
            user: "Palak FossilHunter",
            userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250",
            text: "commented: 'That defense score is insane!'",
            timeAgo: "45 mins ago",
            isUnread: true,
        },
        {
            id: "n-3",
            type: "badge",
            user: "Jurassic System",
            userAvatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=250",
            text: "awarded you the Apex Geneticist Badge! 🏆",
            timeAgo: "2 hours ago",
            isUnread: false,
        },
        {
            id: "n-4",
            type: "remix",
            user: "Aarav DinoFan",
            userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
            text: "remixed your Tyrastego hybrid specimen.",
            timeAgo: "5 hours ago",
            isUnread: false,
        },
    ];

    const [notifications, setNotifications] = useState(defaultNotifications);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E6E4D9] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EFE8] bg-[#FAF9F5] px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Bell size={20} className="text-[#1E3A23]" />
                        <h3 className="font-serif text-base font-bold text-[#1E3A23]">
                            Activity Notifications
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={markAllRead}
                            title="Mark all as read"
                            className="flex items-center gap-1 text-[11px] font-bold text-[#2F7D4D] hover:underline cursor-pointer"
                        >
                            <CheckCheck size={14} />
                            <span>Mark all read</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-[#6D7A6F] hover:bg-[#EFEFE6] cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto p-4 space-y-2.5">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start gap-3 rounded-2xl p-3 border transition ${
                                n.isUnread
                                    ? "bg-[#EFEFE6]/80 border-[#2F7D4D]/30"
                                    : "bg-[#FAF9F5] border-[#F0ECE1]"
                            }`}
                        >
                            <img
                                src={n.userAvatar}
                                alt={n.user}
                                className="h-9 w-9 rounded-full object-cover border border-[#1E3A23]/20 shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#2C352E] leading-snug">
                                    <strong className="font-bold text-[#1E3A23]">{n.user}</strong> {n.text}
                                </p>
                                <span className="text-[10px] text-[#6D7A6F] font-semibold block mt-1">
                                    {n.timeAgo}
                                </span>
                            </div>
                            {n.type === "like" && <Heart size={14} className="text-red-500 fill-red-500 shrink-0 mt-1" />}
                            {n.type === "comment" && <MessageSquare size={14} className="text-blue-500 shrink-0 mt-1" />}
                            {n.type === "remix" && <Dna size={14} className="text-purple-600 shrink-0 mt-1" />}
                            {n.type === "badge" && <Trophy size={14} className="text-amber-500 shrink-0 mt-1" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
