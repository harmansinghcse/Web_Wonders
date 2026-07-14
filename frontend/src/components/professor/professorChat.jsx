import { useState } from "react";
import ProfessorHeader from "./ProfessorHeader";
import ChatArea from "./ChatArea";
import PromptChips from "./PromptChips";
import ChatInput from "./ChatInput";
import FloatingButton from "./FloatingButton";
import professorMessages from "../../data/professorMessages";
import { chatWithRoss } from "../../services/rossService";

const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ProfessorChat = () => {
    const [messages, setMessages] = useState(professorMessages);
    const [loading, setLoading] = useState(false);

    const handleSend = async (text) => {
        if (!text.trim() || loading) return;

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: "user", message: text, time: timeNow() },
        ]);
        setLoading(true);

        try {
            const response = await chatWithRoss(text);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "assistant",
                    message: response.reply,
                    time: timeNow(),
                },
            ]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    type: "assistant",
                    message:
                        "Sorry, I couldn't fetch a response. Please try again.",
                    time: timeNow(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ProfessorHeader />
            <ChatArea messages={messages} loading={loading} />
            <PromptChips onSelect={handleSend} />
            <ChatInput onSend={handleSend} loading={loading} />
            <FloatingButton />
        </div>
    );
};

export default ProfessorChat;
