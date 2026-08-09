import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Bell, Heart, MessageSquare, Dna, Trophy, CheckCheck } from "lucide-react";
import { getNotificationsService, markNotificationsReadService } from "../../services/communityService";

export default function NotificationsModal({ currentUser, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotificationsService();
            if (res.success) {
                setNotifications(res.data);
            }
        } catch (e) {
            console.error("Error fetching notifications:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
            await markNotificationsReadService();
        } catch (e) {
            console.error("Error marking notifications as read:", e);
        }
    };

    const handleNotificationClick = (n) => {
        onClose();
        if (n.type === "follow") {
            navigate(`/profile/${n.senderId || n.id}`);
        } else if (n.type === "like") {
            navigate(`/community?postId=${n.postId}`);
        } else if (n.type === "comment") {
            navigate(`/community?postId=${n.postId}&commentId=${n.commentId}`);
        }
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
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllRead}
                                title="Mark all as read"
                                className="flex items-center gap-1 text-[11px] font-bold text-[#2F7D4D] hover:underline cursor-pointer"
                            >
                                <CheckCheck size={14} />
                                <span>Mark all read</span>
                            </button>
                        )}
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
                    {loading ? (
                        <div className="flex h-24 items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#2F7D4D] border-t-transparent" />
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`flex items-start gap-3 rounded-2xl p-3 border transition cursor-pointer ${
                                    n.isUnread
                                        ? "bg-[#EFEFE6]/80 border-[#2F7D4D]/30 hover:bg-[#EBF5EE]"
                                        : "bg-[#FAF9F5] border-[#F0ECE1] hover:bg-[#FAF9F5]/60"
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
                        ))
                    ) : (
                        <div className="text-center py-10 text-xs text-[#8A968C]">
                            <Bell size={24} className="mx-auto mb-2 text-[#8A968C]/50" />
                            <p>No new activity notifications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
