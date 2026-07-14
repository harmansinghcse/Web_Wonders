import ChatBubble from "./ChatBubble";
import professorMessages from "../../data/professorMessages";
import TypingIndicator from "./TypingIndicator";

const ChatArea = () => {

  return (
    <section className="mx-auto mt-10 w-[95%] max-w-7xl rounded-[32px] bg-[#F9F8F3] px-4 py-8">

      <div className="space-y-12">

        {professorMessages.map((message) => (
          <ChatBubble
            key={message.id}
            type={message.type}
            message={message.message}
            time={message.time}
          />
        ))}
        <div className="pt-4">
          <TypingIndicator/>
        </div>

      </div>

    </section>
  );
};

export default ChatArea;