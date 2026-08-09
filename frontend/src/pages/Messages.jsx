import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { encryptMessage } from "../utils/encryption";

// Import modular components
import ConversationList from "../components/community/messages/ConversationList";
import ChatWindow from "../components/community/messages/ChatWindow";
import EmptyChatState from "../components/community/messages/EmptyChatState";
import NewChat from "../components/community/messages/NewChat";

export default function Messages() {
    const { user: authUser } = useAuth();
    const [apiProfile, setApiProfile] = useState(null);
    const [searchParams] = useSearchParams();
    const { conversationId } = useParams();
    const navigate = useNavigate();

    // Fetch user profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getProfile();
                if (res && res.profile) setApiProfile(res.profile);
            } catch (e) {
                // guest fallback
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

    // Redirect if not authenticated
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

    // New conversation search modal
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // Followed users list
    const [followingList, setFollowingList] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(false);

    // Optimistic status tracking
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
                    const existingConv = res.data.find(c => 
                        c.participants.some(p => p._id.toString() === targetUserId.toString())
                    );
                    if (existingConv) {
                        navigate(`/community/messages/${existingConv._id}`, { replace: true });
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

    // Handle URL conversationId synchronization
    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const found = conversations.find(c => c._id === conversationId);
            if (found) {
                setActiveConversation(found);
                loadMessages(found._id, 1, false);
            }
        } else if (!conversationId) {
            setActiveConversation(null);
            setMessages([]);
        }
    }, [conversationId, conversations]);

    // Polling for new messages (4-second intervals)
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

    // Load messages
    const loadMessages = async (conversationId, pageNum = 1, appendTop = false) => {
        if (pageNum === 1) setLoadingMessages(true);
        else setLoadingOlder(true);

        try {
            const res = await fetchMessagesService(conversationId, pageNum, 20);
            if (res.success) {
                if (appendTop) {
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
                    setTimeout(() => {
                        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                }
                setHasMoreMessages(res.pagination?.page < res.pagination?.totalPages);
                setMessagePage(pageNum);

                await markAsReadService(conversationId);
            }
        } catch (err) {
            console.error("Error loading messages:", err);
        } finally {
            setLoadingMessages(false);
            setLoadingOlder(false);
        }
    };

    // Load new messages silently (polling)
    const loadNewMessagesOnly = async () => {
        if (!activeConversation) return;
        try {
            const res = await fetchMessagesService(activeConversation._id, 1, 15);
            if (res.success) {
                const currentIds = new Set(messages.map((m) => m._id));
                const newMessages = res.data.filter((m) => !currentIds.has(m._id));
                if (newMessages.length > 0) {
                    setMessages((prev) => [...prev, ...newMessages]);
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

    // Start new conversation
    const handleStartConversation = async (targetUserId) => {
        try {
            const res = await startConversationService(targetUserId);
            if (res.success) {
                const conv = res.data;
                if (!conversations.some((c) => c._id === conv._id)) {
                    setConversations((prev) => [conv, ...prev]);
                }
                navigate(`/community/messages/${conv._id}`, { replace: true });
                setShowSearchModal(false);
                setSearchQuery("");
            }
        } catch (err) {
            console.error("Error starting conversation:", err);
        }
    };

    // Send encrypted message
    const handleSendMessage = async (text) => {
        if (!text.trim() || !activeConversation) return;

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

        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);

        try {
            // E2EE client-side message encryption
            const ciphertext = await encryptMessage(text, activeConversation._id);
            const res = await sendMessageService(activeConversation._id, ciphertext);
            if (res.success) {
                setMessages((prev) =>
                    prev.map((msg) => (msg._id === tempId ? res.data : msg))
                );
            }
        } catch (err) {
            console.error("Failed to send message:", err);
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

    const getRecipient = (conv) => {
        if (!conv || !currentUser) return null;
        return conv.participants.find((p) => p._id.toString() !== currentUser.id.toString());
    };

    const recipient = getRecipient(activeConversation);

    return (
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:py-6 flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)] overflow-hidden">
            {/* Conversations list panel */}
            <div className={`w-full md:w-80 rounded-2xl border border-[#EBE8DB] bg-white shadow-md flex flex-col overflow-hidden ${
                activeConversation ? "hidden md:flex" : "flex"
            }`}>
                <ConversationList
                    conversations={conversations}
                    currentUser={currentUser}
                    activeConversation={activeConversation}
                    loadingConversations={loadingConversations}
                    selectConversation={(conv) => navigate(`/community/messages/${conv._id}`)}
                    setShowSearchModal={setShowSearchModal}
                />
            </div>

            {/* Conversation view / Empty placeholder */}
            <div className={`flex-1 rounded-2xl border border-[#EBE8DB] bg-white shadow-md flex flex-col overflow-hidden ${
                activeConversation ? "flex" : "hidden md:flex items-center justify-center p-8 bg-[#FAF9F5]/30"
            }`}>
                {activeConversation ? (
                    <ChatWindow
                        activeConversation={activeConversation}
                        recipient={recipient}
                        messages={messages}
                        currentUser={currentUser}
                        loadingMessages={loadingMessages}
                        hasMoreMessages={hasMoreMessages}
                        loadingOlder={loadingOlder}
                        loadOlderMessages={() => loadMessages(activeConversation._id, messagePage + 1, true)}
                        threadContainerRef={threadContainerRef}
                        messageEndRef={messageEndRef}
                        onSendMessage={handleSendMessage}
                        onBack={() => navigate("/community/messages")}
                        onNavigateToProfile={() => recipient && navigate(`/profile/${recipient._id || recipient.id}`)}
                    />
                ) : (
                    <EmptyChatState
                        loadingFollowing={loadingFollowing}
                        followingList={followingList}
                        handleStartConversation={handleStartConversation}
                        navigate={navigate}
                    />
                )}
            </div>

            {/* New conversation modal */}
            <NewChat
                showSearchModal={showSearchModal}
                setShowSearchModal={setShowSearchModal}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchingUsers={searchingUsers}
                searchResults={searchResults}
                handleStartConversation={handleStartConversation}
                followingList={followingList}
                loadingFollowing={loadingFollowing}
            />
        </div>
    );
}
