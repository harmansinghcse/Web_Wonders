import { useState } from "react";

import DinoIntro from "../components/editor-components/dinoIntro";
import Fossil from "../components/editor-components/fossil";
import PhysicalFeatures from "../components/editor-components/physicalFeatures";
import TimelineStrat from "../components/editor-components/TimlineStrat";
import DietFact from "../components/editor-components/DietFact";
import QuickFacts from "../components/editor-components/QuickFacts";
import EditorWelcome from "../components/editor-components/EditorWelcome";
import dinosaurTemplate from "../data/dinosaurTemplate";
import BasicInfo from "../components/editor-components/BasicInfo";
import SubmissionSuccess from "../components/editor-components/SubmissionSuccess";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const CreateDinosaur = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [dinosaur, setDinosaur] = useState(() =>
        JSON.parse(JSON.stringify(dinosaurTemplate)),
    );

    const [files, setFiles] = useState({
        heroBackground: null,
        fossilImage: null,
        dietImage: null,
        featureImages: [null, null, null, null],
    });

    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Save the real file
        setFiles((prev) => ({
            ...prev,
            heroBackground: file,
        }));

        // Create preview
        const preview = URL.createObjectURL(file);

        // Show preview
        setDinosaur((prev) => ({
            ...prev,
            images: {
                ...prev.images,
                heroBackground: preview,
            },
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const formData = new FormData();

            // Entire dinosaur object
            formData.append("dinosaur", JSON.stringify(dinosaur));

            // Hero image
            if (files.heroBackground) {
                formData.append("heroBackground", files.heroBackground);
            }

            // Fossil image
            if (files.fossilImage) {
                formData.append("fossilImage", files.fossilImage);
            }

            // Feature images
            files.featureImages.forEach((file) => {
                if (file) {
                    formData.append("featureImages", file);
                }
            });

            const response = await fetch(`${API_URL}/api/dinosaur`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            if (data.success) {
                setSubmitted(true);
            }

            console.log(data);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div>
                <SubmissionSuccess open={submitted} />
            </div>
            <div>
                <EditorWelcome
                    showWelcome={showWelcome}
                    setShowWelcome={setShowWelcome}
                />
            </div>
            <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/90 px-8 py-4 backdrop-blur">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-700 transition hover:text-black"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <h1 className="text-lg font-bold">Dinosaur Creator</h1>

                <div />
            </div>
            <div>
                <BasicInfo dinosaur={dinosaur} setDinosaur={setDinosaur} />
            </div>
            <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black font-sans">
                {/* Background */}

                <div className="absolute inset-0 z-0">
                    {dinosaur.images.heroBackground ? (
                        <img
                            src={dinosaur.images.heroBackground}
                            alt="Background"
                            className="h-full w-full object-cover opacity-70"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white">
                            Upload Hero Background
                        </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>

                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>

                    {/* Upload Button */}

                    <label className="absolute top-6 right-6 z-50 cursor-pointer rounded-lg bg-black/70 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-black">
                        Change Background
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBackgroundUpload}
                        />
                    </label>
                </div>

                {/* Hero */}

                <DinoIntro hero={dinosaur.hero} setDinosaur={setDinosaur} />

                {/* Quick Facts */}

                <QuickFacts stats={dinosaur.stats} setDinosaur={setDinosaur} />
            </div>

            <Fossil
                about={dinosaur.about}
                fossil={dinosaur.fossil}
                setDinosaur={setDinosaur}
                setFiles={setFiles}
            />

            <hr className="border-[#c6a87c]" />

            <PhysicalFeatures
                physicalFeatures={dinosaur.physicalFeatures}
                setDinosaur={setDinosaur}
                setFiles={setFiles}
            />

            <TimelineStrat
                timeline={dinosaur.timeline}
                hunting={dinosaur.hunting}
            />

            <DietFact
                diet={dinosaur.diet}
                setDinosaur={setDinosaur}
                setFiles={setFiles}
            />

            <div className="sticky bottom-0 z-50 border-t bg-white p-5 shadow-xl">
                <div className="mx-auto flex max-w-7xl justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-lg bg-[#2D6A4F] px-8 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#1B4332]"
                    >
                        {submitting ? "Submitting..." : "Submit Dinosaur"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CreateDinosaur;
