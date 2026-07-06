import { useEffect, useState } from "react";

export default function InterestingFact() {
    const [fact, setFact] = useState(null);

    const getFact = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/dinosaurs/fact",
            );

            if (!response.ok) {
                throw new Error("Failed to fetch fact");
            }

            const data = await response.json();

            console.log(data);

            setFact(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getFact();
    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: "url('fact-bg.jpg')",
            }}
        >
            <div className="text-center pt-8">
                <h1 className="text-4xl text-[#303c29] font-bold mb-4">
                    INTERESTING FACT
                </h1>
                <p className="text-2xl font-semibold text-[#6a6a6a]">
                    Amazing truth from the prehistoric world!
                </p>
            </div>
            <div className="flex px-40 py-20 justify-between items-center">
                <div>
                    <div className="w-1/2 flex justify-start">
                        <div className="max-w-lg">
                            <h1 className="text-5xl font-bold leading-tight text-[#c8960b]">
                                T. REX had the strongest bite of any land
                                animal!
                            </h1>

                            <p className="mt-6 leading-8 text-2xl font-semibold">
                                Tyrannosaurus Rex could bite with a force of up
                                to 12,800 pounds per square inch strong enough
                                to crush bone with ease.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-3xl text-[#182818] font-bold">
                                Length
                            </h1>
                            <p className="text-2xl">40 feet</p>
                            <p className="text-2xl">(12m)</p>
                        </div>
                        <div>
                            <h1 className="text-3xl text-[#182818] font-bold">
                                Length
                            </h1>
                            <p className="text-2xl">40 feet</p>
                            <p className="text-2xl">(12m)</p>
                        </div>
                        <div>
                            <h1 className="text-3xl text-[#182818] font-bold">
                                Length
                            </h1>
                            <p className="text-2xl">40 feet</p>
                            <p className="text-2xl">(12m)</p>
                        </div>
                    </div>
                </div>
                {/* creature picture */}
                <div className="h-80 w-160 overflow-hidden  rounded-4xl">
                    <img
                        src="trex.jpg"
                        alt=""
                        className="w-full h-full object-cover object-top"
                    />
                </div>
            </div>
        </div>
    );
}
