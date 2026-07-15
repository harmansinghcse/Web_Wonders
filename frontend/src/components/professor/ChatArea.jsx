import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import ProfessorHeader from "./ProfessorHeader";

/**
 * --------------------------------------------
 * Component: ChatArea
 * Purpose:
 * Displays the conversation between the
 * user and the AI assistant. It renders
 * all chat messages and shows a typing
 * indicator while the AI is generating
 * a response.
 * --------------------------------------------
 */

const ChatArea = ({ messages, loading }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <section className="flex-1 min-h-0 w-full overflow-y-auto px-4 py-4 md:px-0 no-scrollbar">
            <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8 pb-4">
                <ProfessorHeader />

                <div className="space-y-6 sm:space-y-8 mt-6">
                    {messages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            role={message.type}
                            message={message.message}
                            time={message.time}
                        />
                    ))}
                    {loading && (
                        <div className="pt-2">
                            <TypingIndicator />
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </section>
    );
};

export default ChatArea;
