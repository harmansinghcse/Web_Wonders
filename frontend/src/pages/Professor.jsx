import { useState } from "react";
import Navbar from "../components/home_components/hero/Navbar";
import ProfessorHeader from "../components/professor/ProfessorHeader";
import ChatArea from "../components/professor/ChatArea";
import ChatInput from "../components/professor/ChatInput";
import PromptChips from "../components/professor/PromptChips";
import FloatingButton from "../components/professor/FloatingButton";
import { chatWithRoss } from "../services/rossService"; // adjust path

const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initialMessages = [
    {
        id: 1,
        type: "assistant",
        message:
            "Hey there! I'm Professor Ross 🦖 Ask me anything about dinosaurs, fossils, or extinction events!",
        time: timeNow(),
    },
];

const Professor = () => {
    const [messages, setMessages] = useState(initialMessages);
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
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F7F6F1] pt-24">
                <ProfessorHeader />
                <ChatArea messages={messages} loading={loading} />
                <PromptChips onSelect={handleSend} />
                <ChatInput onSend={handleSend} loading={loading} />
                <FloatingButton />
            </main>
        </>
    );
};

export default Professor;
