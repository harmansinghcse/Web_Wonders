import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

const ChatArea = ({ messages, loading }) => {
    return (
        <section className="mx-auto mt-10 w-[95%] max-w-7xl rounded-4xl bg-[#F9F8F3] px-4 py-8">
            <div className="space-y-12">
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
