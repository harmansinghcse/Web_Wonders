import { createContext, useContext, useState } from "react";
import { chatWithRoss } from "../services/rossService";

const ProfessorContext = createContext();

const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initialMessages = [
    {
        id: 1,
        type: "assistant",
        message:
            "Hello there, future paleontologist!\n\nI'm Professor Ross. I live and breathe dinosaurs!\nAsk me anything about prehistoric creatures, fossils, or ancient Earth, and let's explore together!",
        time: timeNow(),
    },
];

export function ProfessorProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(initialMessages);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const openChat = () => {
        setIsOpen(true);
        setUnreadCount(0);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const toggleChat = () => {
        if (!isOpen) {
            setUnreadCount(0);
        }
        setIsOpen((prev) => !prev);
    };

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;

        const userMsg = {
            id: Date.now(),
            type: "user",
            message: text,
            time: timeNow(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await chatWithRoss(text);
            const rossMsg = {
                id: Date.now() + 1,
                type: "assistant",
                message: response.reply,
                time: timeNow(),
            };

            setMessages((prev) => [...prev, rossMsg]);

            if (!isOpen) {
                setUnreadCount((prev) => prev + 1);
            }
        } catch (err) {
            console.error("Error communicating with Professor Ross:", err);
            const errorMsg = {
                id: Date.now() + 2,
                type: "assistant",
                message:
                    "Sorry! My fossil scanners ran into a glitch. Please try asking again!",
                time: timeNow(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages(initialMessages);
    };

    return (
        <ProfessorContext.Provider
            value={{
                isOpen,
                openChat,
                closeChat,
                toggleChat,
                messages,
                loading,
                sendMessage,
                clearChat,
                unreadCount,
            }}
        >
            {children}
        </ProfessorContext.Provider>
    );
}

export const useProfessor = () => useContext(ProfessorContext);
