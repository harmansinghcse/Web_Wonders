import Navbar from "../components/home_components/hero/Navbar";
import ChatArea from "../components/professor/ChatArea";
import ChatInput from "../components/professor/ChatInput";
import PromptChips from "../components/professor/PromptChips";
import { useProfessor } from "../context/ProfessorContext";

const Professor = () => {
    const { messages, loading, sendMessage } = useProfessor();

    const handleSend = (text) => {
        sendMessage(text);
    };

    return (
        <>
            <Navbar />
            <main className="h-screen max-h-[100dvh] bg-[#F7F6F1] pt-24 pb-4 flex flex-col overflow-hidden">
                <ChatArea messages={messages} loading={loading} />
                
                <div className="w-full max-w-5xl mx-auto px-4 md:px-0 shrink-0">
                    <PromptChips onSelect={handleSend} />
                    <ChatInput onSend={handleSend} loading={loading} />
                </div>
            </main>
        </>
    );
};

export default Professor;
