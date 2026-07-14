export default function PhysicalFeatures({
    physicalFeatures,
    setDinosaur,
    setFiles,
}) {
    const handleChange = (index, field, value) => {
        const updatedFeatures = [...physicalFeatures.features];

        updatedFeatures[index] = {
            ...updatedFeatures[index],
            [field]: value,
        };

        setDinosaur((prev) => ({
            ...prev,
            physicalFeatures: {
                ...prev.physicalFeatures,
                features: updatedFeatures,
            },
        }));
    };

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Store the real file
        setFiles((prev) => {
            const updatedImages = [...prev.featureImages];
            updatedImages[index] = file;

            return {
                ...prev,
                featureImages: updatedImages,
            };
        });

        // Create preview
        const preview = URL.createObjectURL(file);

        // Update preview in dinosaur state
        const updatedFeatures = [...physicalFeatures.features];

        updatedFeatures[index] = {
            ...updatedFeatures[index],
            image: preview,
        };

        setDinosaur((prev) => ({
            ...prev,
            physicalFeatures: {
                ...prev.physicalFeatures,
                features: updatedFeatures,
            },
        }));
    };

    return (
        //physical features 
        <div className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="mb-14 text-5xl font-bold tracking-wide text-[#222] uppercase">
                    Physical Features
                </h2>

                <div className="grid gap-10 border-y border-[#d8d3c4] py-12 md:grid-cols-2 lg:grid-cols-4">
                    {physicalFeatures.features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <label className="group relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                                {feature.image ? (
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-500">
                                        📷 Upload Image
                                    </span>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                                    <span className="text-white font-semibold">
                                        Change Image
                                    </span>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleImageUpload(index, e)
                                    }
                                />
                            </label>

                            <input
                                type="text"
                                value={feature.title}
                                placeholder="Feature Title"
                                onChange={(e) =>
                                    handleChange(index, "title", e.target.value)
                                }
                                className="mt-6 w-full bg-transparent text-center text-2xl font-bold uppercase outline-none placeholder:text-gray-400"
                            />

                            <textarea
                                rows={4}
                                value={feature.description}
                                placeholder="Describe this feature..."
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        "description",
                                        e.target.value,
                                    )
                                }
                                className="mt-3 w-full resize-none bg-transparent text-center leading-7 text-gray-600 outline-none placeholder:text-gray-400"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
