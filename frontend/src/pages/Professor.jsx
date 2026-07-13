import Navbar from "../components/home_components/hero/Navbar";
import ProfessorHeader from "../components/professor/ProfessorHeader";
import ChatArea from "../components/professor/ChatArea";
import ChatInput from "../components/professor/ChatInput";
import PromptChips from "../components/professor/PromptChips";
import FloatingButton from "../components/professor/FloatingButton";

const Professor = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F7F6F1] pt-24">
                <ProfessorHeader />
                <ChatArea />
                <ChatInput />
                <PromptChips />
                <FloatingButton />
            </main>
        </>
    );
}

export default Professor;