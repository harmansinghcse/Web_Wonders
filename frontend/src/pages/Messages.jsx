import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    Send,
    Search,
    Plus,
    User,
    Shield,
    X,
    MessageSquare,
    Loader2,
    Calendar
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/profileService";
import { searchUsersService, getFollowingService } from "../services/communityService";
import {
    fetchConversationsService,
    fetchMessagesService,
    startConversationService,
    sendMessageService,
    markAsReadService
} from "../services/messageService";

export default function Messages() {
    const { user: authUser } = useAuth();
    const [apiProfile, setApiProfile] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Fetch user profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getProfile();
                if (res && res.profile) setApiProfile(res.profile);
            } catch (e) {
                // Not logged in fallback
            }
        };
        loadProfile();
    }, []);

    const currentUser = useMemo(() => {
        const u = authUser || apiProfile;
        if (u) {
            return {
                name: u.name || u.username || "Explorer",
                id: u._id || u.id,
                avatar: u.avatar || "",
                role: u.role || "Explorer"
            };
        }
        return null;
    }, [authUser, apiProfile]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!currentUser && !localStorage.getItem("user")) {
            navigate("/login");
        }
    }, [currentUser, navigate]);

    // Messaging states
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    // Pagination for messages
    const [messagePage, setMessagePage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);

    // New conversation search
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // Followed users list
    const [followingList, setFollowingList] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(false);

    // Message input
    const [messageInput, setMessageInput] = useState("");
    
    // Optimistic / Sending status tracking
    const [sendingMessageIds, setSendingMessageIds] = useState(new Set());

    const messageEndRef = useRef(null);
    const threadContainerRef = useRef(null);

    // Fetch followed users
    useEffect(() => {
        const loadFollowing = async () => {
            if (!currentUser) return;
            try {
                setLoadingFollowing(true);
                const res = await getFollowingService(currentUser.id);
                if (res.success) {
                    setFollowingList(res.data);
                }
            } catch (err) {
                console.error("Error loading following list:", err);
            } finally {
                setLoadingFollowing(false);
            }
        };
        loadFollowing();
    }, [currentUser]);

    // Load conversations list
    const loadConversations = async (silent = false) => {
        if (!silent) setLoadingConversations(true);
        try {
            const res = await fetchConversationsService();
            if (res.success) {
                setConversations(res.data);

                // Handle starting a conversation from search query params (e.g. ?userId=...)
                const targetUserId = searchParams.get("userId");
                if (targetUserId && !silent) {
                    // Find if conversation already exists
                    const existingConv = res.data.find(c => 
                        c.participants.some(p => p._id.toString() === targetUserId.toString())
                    );
                    if (existingConv) {
                        selectConversation(existingConv);
                        navigate("/community/messages", { replace: true });
                    } else {
                        await handleStartConversation(targetUserId);
                    }
                }
            }
        } catch (err) {
            console.error("Error loading conversations:", err);
        } finally {
            if (!silent) setLoadingConversations(false);
        }
    };

    // Load initial conversations on mount
    useEffect(() => {
        if (currentUser) {
            loadConversations();
        }
    }, [currentUser, searchParams]);

    // Polling for new messages and conversation updates (4-second intervals)
    useEffect(() => {
        if (!currentUser) return;
        const interval = setInterval(() => {
            loadConversations(true);
            if (activeConversation) {
                loadNewMessagesOnly();
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [currentUser, activeConversation, messages]);

    // Load message thread for active conversation
    const loadMessages = async (conversationId, pageNum = 1, appendTop = false) => {
        if (pageNum === 1) setLoadingMessages(true);
        else setLoadingOlder(true);

        try {
            const res = await fetchMessagesService(conversationId, pageNum, 20);
            if (res.success) {
                if (appendTop) {
                    // Prepend older messages and retain scroll position
                    const prevScrollHeight = threadContainerRef.current?.scrollHeight || 0;
                    setMessages((prev) => [...res.data, ...prev]);
                    setTimeout(() => {
                        if (threadContainerRef.current) {
                            threadContainerRef.current.scrollTop = 
                                threadContainerRef.current.scrollHeight - prevScrollHeight;
                        }
                    }, 50);
                } else {
                    setMessages(res.data);
                    // Scroll to bottom on initial load
                    setTimeout(() => {
                        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                }
                setHasMoreMessages(res.pagination?.page < res.pagination?.totalPages);
                setMessagePage(pageNum);

                // Mark messages as read
                await markAsReadService(conversationId);
            }
        } catch (err) {
            console.error("Error loading messages:", err);
        } finally {
            setLoadingMessages(false);
            setLoadingOlder(false);
        }
    };

    // Load only new messages silently for polling
    const loadNewMessagesOnly = async () => {
        if (!activeConversation) return;
        try {
            const res = await fetchMessagesService(activeConversation._id, 1, 15);
            if (res.success) {
                // Find messages not already in state
                const currentIds = new Set(messages.map((m) => m._id));
                const newMessages = res.data.filter((m) => !currentIds.has(m._id));
                if (newMessages.length > 0) {
                    setMessages((prev) => [...prev, ...newMessages]);
                    // Mark as read
                    await markAsReadService(activeConversation._id);
                    setTimeout(() => {
                        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }
            }
        } catch (err) {
            console.error("Error polling new messages:", err);
        }
    };

    // Handle selecting a conversation
    const selectConversation = (conv) => {
        setActiveConversation(conv);
        loadMessages(conv._id, 1, false);
    };

    // Search users to start conversation
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setSearchingUsers(true);
            try {
                const res = await searchUsersService(searchQuery);
                if (res.success) {
                    // Filter out self
                    setSearchResults(res.data.filter((u) => u._id !== currentUser?.id && u.id !== currentUser?.id));
                }
            } catch (err) {
                console.error("Error searching users:", err);
            } finally {
                setSearchingUsers(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Start a new conversation
    const handleStartConversation = async (targetUserId) => {
        try {
            const res = await startConversationService(targetUserId);
            if (res.success) {
                const conv = res.data;
                // Add to list if not already there
                if (!conversations.some((c) => c._id === conv._id)) {
                    setConversations((prev) => [conv, ...prev]);
                }
                selectConversation(conv);
                setShowSearchModal(false);
                setSearchQuery("");
                navigate("/community/messages", { replace: true });
            }
        } catch (err) {
            console.error("Error starting conversation:", err);
        }
    };

    // Send a message (with optimistic updates)
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeConversation) return;

        const text = messageInput.trim();
        setMessageInput("");

        // Optimistic message object
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            _id: tempId,
            content: text,
            sender: {
                _id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                role: currentUser.role
            },
            createdAt: new Date().toISOString(),
            isPending: true
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setSendingMessageIds((prev) => new Set([...prev, tempId]));

        // Scroll to bottom
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);

        try {
            const res = await sendMessageService(activeConversation._id, text);
            if (res.success) {
                // Replace optimistic message with actual response
                setMessages((prev) =>
                    prev.map((msg) => (msg._id === tempId ? res.data : msg))
                );
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            // Mark optimistic message as failed
            setMessages((prev) =>
                prev.map((msg) => (msg._id === tempId ? { ...msg, isFailed: true } : msg))
            );
        } finally {
            setSendingMessageIds((prev) => {
                const next = new Set(prev);
                next.delete(tempId);
                return next;
            });
        }
    };

    // Helper to get active participant (the other user)
    const getRecipient = (conv) => {
        if (!conv || !currentUser) return null;
        return conv.participants.find((p) => p._id.toString() !== currentUser.id.toString());
    };

    // Format message time
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:py-6 flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)] overflow-hidden">
            
            {/* LEFT CONVERSATION LIST PANEL */}
            <div className={`w-full md:w-80 rounded-2xl border border-[#EBE8DB] bg-white shadow-md flex flex-col overflow-hidden ${
                activeConversation ? "hidden md:flex" : "flex"
            }`}>
                
                {/* Header */}
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

                {/* Conversations Scroll Container */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loadingConversations ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[#6D7A6F]">
                            <Loader2 className="animate-spin mb-2" size={24} />
                            <span className="text-xs">Loading chats...</span>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-12 px-4 text-[#6D7A6F] space-y-2">
                            <MessageSquare size={32} className="mx-auto opacity-40" />
                            <p className="text-xs font-bold">No conversations yet</p>
                            <button
                                onClick={() => setShowSearchModal(true)}
                                className="text-xs underline text-[#1E3A23] font-bold"
                            >
                                Start chatting
                            </button>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const recipient = getRecipient(conv);
                            if (!recipient) return null;
                            const isActive = activeConversation?._id === conv._id;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => selectConversation(conv)}
                                    className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer transition ${
                                        isActive
                                            ? "bg-[#EBF5EE] border border-[#D1E2D3]"
                                            : "hover:bg-[#FAF9F5] border border-transparent"
                                    }`}
                                >
                                    {/* Avatar */}
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

                                    {/* Info */}
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
                                            {conv.lastMessage ? conv.lastMessage.content : "Started a chat"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT CONVERSATION THREAD WINDOW */}
            <div className={`flex-1 rounded-2xl border border-[#EBE8DB] bg-white shadow-md flex flex-col overflow-hidden ${
                activeConversation ? "flex" : "hidden md:flex items-center justify-center p-8 bg-[#FAF9F5]/30"
            }`}>
                
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#F0EFE8] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveConversation(null)}
                                    className="p-1.5 hover:bg-[#FAF9F5] rounded-full md:hidden text-[#6D7A6F] cursor-pointer"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                
                                {/* Avatar & Info */}
                                <div className="flex items-center gap-3">
                                    {getRecipient(activeConversation)?.avatar ? (
                                        <img
                                            src={getRecipient(activeConversation).avatar}
                                            alt={getRecipient(activeConversation).name}
                                            className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/20"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-[#E4ECE3] border border-[#1E3A23]/20 flex items-center justify-center font-bold text-[#2A5231]">
                                            {getRecipient(activeConversation)?.name[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-bold text-[#1E3A23]">
                                            {getRecipient(activeConversation)?.name}
                                        </h3>
                                        <span className="text-[10px] text-[#6D7A6F] font-semibold bg-[#E4ECE3] px-2 py-0.5 rounded-md">
                                            {getRecipient(activeConversation)?.role || "Explorer"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Scroll Thread Container */}
                        <div
                            ref={threadContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5]/40"
                        >
                            {/* Load More Button */}
                            {hasMoreMessages && (
                                <div className="text-center py-2 shrink-0">
                                    <button
                                        onClick={() => loadMessages(activeConversation._id, messagePage + 1, true)}
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
                                messages.map((msg, index) => {
                                    const isSelf = msg.sender._id.toString() === currentUser.id.toString() || msg.sender === currentUser.id;

                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex flex-col max-w-[75%] ${
                                                isSelf ? "ml-auto items-end" : "mr-auto items-start"
                                            }`}
                                        >
                                            {/* Text Bubble */}
                                            <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-xs leading-relaxed ${
                                                isSelf
                                                    ? "bg-[#1E3A23] text-white rounded-tr-xs"
                                                    : "bg-white border border-[#EBE8DB] text-[#1E3A23] rounded-tl-xs"
                                            }`}>
                                                {msg.content}
                                            </div>

                                            {/* Time / Pending / Failed Indicators */}
                                            <div className="flex items-center gap-1.5 mt-1 text-[9px] text-[#6D7A6F] font-bold px-1">
                                                <span>{formatTime(msg.createdAt)}</span>
                                                {msg.isPending && <span className="animate-pulse">● Sending...</span>}
                                                {msg.isFailed && <span className="text-red-500 font-bold">✕ Failed to send</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messageEndRef} />
                        </div>

                        {/* Message Composer Footer Input */}
                        <form
                            onSubmit={handleSendMessage}
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
                    </>
                ) : (
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
                                    onClick={() => {
                                        navigate("/community");
                                    }}
                                    className="rounded-xl bg-[#1E3A23] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#152A19] transition cursor-pointer"
                                >
                                    Explore Community
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SEARCH USERS MODAL */}
            {showSearchModal && (
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
                            {searchingUsers ? (
                                <div className="text-center py-8 text-xs text-[#6D7A6F]">
                                    Searching for explorers...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-8 text-xs text-[#6D7A6F]">
                                    {searchQuery ? "No explorers found." : "Search to see results."}
                                </div>
                            ) : (
                                searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleStartConversation(user._id)}
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
                    </div>
                </div>
            )}
        </div>
    );
}
