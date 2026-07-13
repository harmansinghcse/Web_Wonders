import ChatBubble from "./ChatBubble";

const ChatArea = () => {
  const messages = [
    {
      id: 1,
      type: "assistant",
      message:"Hello there, future paleontologist! 🦖\n\nI'm Professor Rex. I live and breathe dinosaurs.\nAsk me anything about them, and let's explore the prehistoric world together!",
      time: "10:30 AM",
    },

    {
      id: 2,
      type: "user",
      message: "Why did Carnotaurus have such tiny arms?",
      time: "10:31 AM",
    },

    {
      id: 3,
      type: "assistant",
      message:"Great question! Carnotaurus had tiny arms mainly because it was a lightweight, fast-running predator. Those small arms helped reduce weight and balance while chasing prey. 🦕",
      time: "10:31 AM",
    },

    {
      id: 4,
      type: "user",
      message: "Was T-Rex the biggest dinosaur ever?",
      time: "10:32 AM",
    },

    {
      id: 5,
      type: "assistant",
      message:"Not quite! Argentinosaurus was much larger than T-Rex. Imagine an animal weighing over 70 tons! 🤯",
      time: "10:32 AM",
    },
  ];

  return (
    <section className="mx-auto mt-10 w-[95%] max-w-7xl">

      <div className="space-y-16">

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            type={message.type}
            message={message.message}
            time={message.time}
          />
        ))}

      </div>

    </section>
  );
};

export default ChatArea;