export default function EditorWelcome({ showWelcome, setShowWelcome }) {
    return (
        <>
            {showWelcome && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="mx-6 w-full max-w-xl rounded-2xl border border-[#C6A87C]/30 bg-[#1B1B1B] p-8 shadow-2xl">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C6A87C]/20 text-3xl">
                                🦖
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Welcome to Dinosaur Creator
                                </h2>

                                <p className="text-sm text-gray-400">
                                    Editing Tyrannosaurus Rex Template
                                </p>
                            </div>
                        </div>

                        <p className="mb-6 leading-8 text-gray-300">
                            This page starts with a Tyrannosaurus Rex template.
                            Replace every piece of text, every image and every
                            fact to create your own dinosaur.
                        </p>

                        <div className="space-y-3 rounded-xl bg-[#262626] p-5">
                            <div className="flex items-center gap-3 text-gray-200">
                                ✏️ <span>Click any text to edit it.</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-200">
                                📷 <span>Click images to upload your own.</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-200">
                                🦴 <span>Every section is customizable.</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowWelcome(false)}
                            className="mt-8 w-full rounded-xl bg-[#C6A87C] py-4 text-lg font-semibold text-black transition hover:scale-[1.02]"
                        >
                            Start Editing
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
