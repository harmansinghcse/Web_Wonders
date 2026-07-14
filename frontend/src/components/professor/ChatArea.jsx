import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
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
    return (
        // Main chat container
        <section className="mx-auto mt-10 w-[95%] max-w-7xl rounded-4xl bg-[#F9F8F3] px-4 py-8">
             {/* Chat messages container */}
            <div className="space-y-12">
                {/* Display all chat messages */}
                {messages.map((message) => (
                    <ChatBubble
                        key={message.id}
                        role={message.type}
                        message={message.message}
                        time={message.time}
                    />
                ))}
                {loading && (
                    <div className="pt-4">
                        <TypingIndicator />
                    </div>
                )}
            </div>
        </section>
    );
};

export default ChatArea;
