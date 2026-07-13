import { Paperclip, SendHorizontal } from "lucide-react";

const ChatInput = () => {
    return (
        <div className="mx-auto mt-12 w-[95%] max-w-5xl">
            <div className="rounded-3xl border border-[#E8E1CF] bg-whitep-4 shadow-md">
                <div className="flex items-center gap-4">
                    <Paperclip className="text-gray-400" size={22} />
                    <input
                        type="text"
                        placeholder="TAsk Professor Ross something..."
                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                    />
                    <button className="rounded-2xl bg-[#6C8E4E] p-3 text-white transition hover:bg-[#5D7E42]">
                        <SendHorizontal size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;