import { useEditor } from "../../context/EditorContext";
import EditableSection from "./generic/EditableSection";
import EditableText from "./generic/EditableText";

export default function BasicInfo() {
    const { dinosaur, updateDinosaur } = useEditor();

    const handleChange = (field, value) => {
        updateDinosaur(field, value);
        if (field === "name") {
            const slug = value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
            updateDinosaur("slug", slug);
        }
    };

    return (
        <EditableSection title="Basic Information">
            <section className="border-b border-gray-200 bg-white py-12">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="mb-8 text-4xl font-bold text-[#2B241C]">
                        Basic Information
                    </h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-600">
                                Name
                            </label>

                            <EditableText
                                value={dinosaur.name}
                                placeholder="Tyrannosaurus Rex"
                                onChange={(value) =>
                                    handleChange("name", value)
                                }
                                className="w-full text-xl font-semibold"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-600">
                                Scientific Name
                            </label>

                            <EditableText
                                value={dinosaur.scientificName}
                                placeholder="Tyrannosaurus rex"
                                onChange={(value) =>
                                    handleChange("scientificName", value)
                                }
                                className="w-full text-xl italic"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-600">
                                Slug
                            </label>

                            <EditableText
                                value={dinosaur.slug}
                                placeholder="tyrannosaurus-rex"
                                onChange={(value) =>
                                    handleChange(
                                        "slug",
                                        value
                                            .toLowerCase()
                                            .replace(/\s+/g, "-"),
                                    )
                                }
                                className="w-full font-mono text-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </EditableSection>
    );
}
