import { useState } from "react";
import ProfessorHeader from "./ProfessorHeader";
import ChatArea from "./ChatArea";
import PromptChips from "./PromptChips";
import ChatInput from "./ChatInput";
import FloatingButton from "./FloatingButton";
import professorMessages from "../../data/professorMessages";
import { chatWithRoss } from "../../services/rossService";
/**
 * --------------------------------------------
 * Component: ProfessorChat
 * Purpose:
 * Serves as the main chat interface for
 * Professor Ross. It manages chat messages,
 * handles user interactions, communicates
 * with the AI service, and renders all
 * chat-related components.
 * --------------------------------------------
 */
// Returns the current time in HH:MM format
const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ProfessorChat = () => {
        // Stores the complete chat conversation
    const [messages, setMessages] = useState(professorMessages);
    // Tracks whether Professor Ross is generating a response
    const [loading, setLoading] = useState(false);
    // Handles sending messages and receiving AI responses
    const handleSend = async (text) => {
        // Prevent empty messages or multiple requests
        if (!text.trim() || loading) return;
         // Add the user's message to the conversation
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: "user", message: text, time: timeNow() },
        ]);
        // Display typing indicator
        setLoading(true);

        try {
            // Send the user's message to Professor Ross
            const response = await chatWithRoss(text);
            // Add Professor Ross's response to the chat
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
            // Log any errors during the API request
            console.error(err);
            // Display a fallback message if the request fails
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
             // Hide the typing indicator
            setLoading(false);
        }
    };

    return (
        // Main Professor Ross chat interface
        <div>
              {/* Chat page header */}
            <ProfessorHeader />

              {/* Conversation area */}
            <ChatArea messages={messages} loading={loading} />

             {/* Suggested prompt buttons */}
            <PromptChips onSelect={handleSend} />
            <ChatInput onSend={handleSend} loading={loading} />
            <FloatingButton />
        </div>
    );
};

export default ProfessorChat;
