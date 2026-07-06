export default function WelcomeHome() {
    return (
        <>
            {/* home-content */}
            <div className="px-20 mt-30 w-160">
                <h1 className="text-3xl text-[#d68c37] font-bold">
                    Journey Back In Time
                </h1>
                <h1 className="text-5xl text-white font-bold">EXPLORE THE</h1>
                <h1 className="text-5xl text-[#cc9401] font-bold">
                    AGE OF DINOSAURS.
                </h1>
                <div className="text-white py-5 text-xl">
                    <p>Discover incredible dinosaurs, ancient</p>
                    <p>fossils, and the fascinating stories of a world</p>
                    <p>that lived millions of years ago.</p>
                </div>

                <div className="pt-4">
                    <div className="flex justify-between">
                        <button className="bg-[#2f5031]/60 px-10 py-2 rounded-full text-white font-semibold">
                            EXPLORE DINOSUAR
                        </button>
                        <button className="bg-[#a18e4c]/80 px-10 py-2 rounded-full text-[#264328] font-bold">
                            PLAY QUIZ
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
