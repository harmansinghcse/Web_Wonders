import EditableImage from "./generic/EditableImage";
import EditableSection from "./generic/EditableSection";
import EditableText from "./generic/EditableText";
import EditableTextarea from "./generic/EditableTextarea";

export default function Fossil({ about, fossil, setDinosaur, setFiles }) {
    const handleAboutChange = (field, value) => {
        setDinosaur((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                [field]: value,
            },
        }));
    };

    const handleParagraphChange = (index, value) => {
        const updatedParagraphs = [...about.paragraphs];
        updatedParagraphs[index] = value;

        setDinosaur((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                paragraphs: updatedParagraphs,
            },
        }));
    };

    const handleLocationChange = (value) => {
        const locations = value
            .split(",")
            .map((location) => location.trim())
            .filter(Boolean);

        setDinosaur((prev) => ({
            ...prev,
            fossil: {
                ...prev.fossil,
                locations,
            },
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Store the real file
        setFiles((prev) => ({
            ...prev,
            fossilImage: file,
        }));

        // Create preview
        const preview = URL.createObjectURL(file);

        // Update preview in editor
        setDinosaur((prev) => ({
            ...prev,
            fossil: {
                ...prev.fossil,
                image: preview,
            },
        }));
    };

    return (
        //foccile record
        <EditableSection title="Fossil Record">
            <div className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                        {/* Left Side */}
                        <div>
                            <EditableText
                                value={about.heading}
                                placeholder="Section Heading"
                                onChange={(value) =>
                                    handleAboutChange("heading", value)
                                }
                                className="mb-8 w-full text-2xl font-extrabold uppercase text-[#1B1B1B] lg:text-4xl"
                            />

                            {about.paragraphs.map((paragraph, index) => (
                                <EditableTextarea
                                    key={index}
                                    rows={4}
                                    value={paragraph}
                                    placeholder={`Paragraph ${index + 1}`}
                                    onChange={(value) =>
                                        handleParagraphChange(index, value)
                                    }
                                    className={`w-full text-lg leading-9 text-gray-700 ${
                                        index !== about.paragraphs.length - 1
                                            ? "mb-8"
                                            : ""
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Right Side */}
                        <div>
                            <div className="relative overflow-hidden rounded-[30px] shadow-2xl">
                                <EditableImage
                                    image={fossil.image}
                                    onUpload={handleImageUpload}
                                    placeholder="Upload Fossil Image"
                                    className="h-130 w-full object-cover"
                                />

                                {/* Gradient (doesn't block clicks) */}
                                <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                                {/* Overlay */}
                                <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C79A4A] bg-black/50 text-3xl text-[#C79A4A]">
                                        🦴
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold uppercase tracking-wide text-white">
                                            Fossil Record
                                        </h3>

                                        <EditableText
                                            value={fossil.locations.join(", ")}
                                            placeholder="India, USA, China..."
                                            onChange={handleLocationChange}
                                            className="mt-2 w-full text-sm text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EditableSection>
    );
}
