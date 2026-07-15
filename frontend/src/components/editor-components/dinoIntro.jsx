import { useEditor } from "../../context/EditorContext";
import EditableSection from "./generic/EditableSection";
import EditableText from "./generic/EditableText";
import EditableTextarea from "./generic/EditableTextarea";

export default function DinoIntro() {
    const { dinosaur, updateDinosaur } = useEditor();
    const hero = dinosaur.hero;

    const handleChange = (field, value) => {
        updateDinosaur(`hero.${field}`, value);
    };

    return (
        <EditableSection title="Hero">
            {/*Her osection of dino info*/}
            <div className="relative z-10 mx-auto mt-24 flex w-full max-w-7xl grow flex-col justify-center px-8 md:px-16">
                <div className="max-w-2xl">
                    <EditableText
                        value={hero.tagLine}
                        placeholder="Tagline"
                        onChange={(value) => handleChange("tagLine", value)}
                        className="mb-4 w-full text-sm font-semibold uppercase tracking-[0.25em] text-[#c6a87c]"
                    />

                    <EditableText
                        value={hero.title}
                        placeholder="Dinosaur Name"
                        onChange={(value) => handleChange("title", value)}
                        className="mb-2 block w-full text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-[5.5rem]"
                    />

                    <EditableText
                        value={hero.highlightedTitle}
                        placeholder="Species"
                        onChange={(value) =>
                            handleChange("highlightedTitle", value)
                        }
                        className="block w-full text-5xl font-bold leading-[1.1] tracking-tight text-[#c6a87c] md:text-[5.5rem]"
                    />

                    <EditableTextarea
                        value={hero.description}
                        placeholder="Write a short description about this dinosaur..."
                        rows={4}
                        onChange={(value) => handleChange("description", value)}
                        className="mt-8 w-full pr-4 text-base leading-relaxed text-gray-200 md:text-lg"
                    />
                </div>
            </div>
        </EditableSection>
    );
}
