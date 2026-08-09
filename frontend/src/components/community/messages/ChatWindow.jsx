import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({
    activeConversation,
    recipient,
    messages,
    currentUser,
    loadingMessages,
    hasMoreMessages,
    loadingOlder,
    loadOlderMessages,
    threadContainerRef,
    messageEndRef,
    onSendMessage,
    onBack,
    onNavigateToProfile
}) {
    if (!activeConversation) return null;

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            <ChatHeader
                recipient={recipient}
                onBack={onBack}
                onNavigateToProfile={onNavigateToProfile}
            />

            <MessageList
                messages={messages}
                currentUser={currentUser}
                conversationId={activeConversation._id}
                loadingMessages={loadingMessages}
                hasMoreMessages={hasMoreMessages}
                loadingOlder={loadingOlder}
                loadOlderMessages={loadOlderMessages}
                threadContainerRef={threadContainerRef}
                messageEndRef={messageEndRef}
            />

            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
}
