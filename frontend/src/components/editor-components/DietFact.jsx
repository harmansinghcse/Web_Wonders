import { useEditor } from "../../context/EditorContext";
import EditableSection from "./generic/EditableSection";
import EditableText from "./generic/EditableText";
import EditableTextarea from "./generic/EditableTextarea";

export default function DietFact() {
    const { dinosaur, updateDinosaur } = useEditor();
    const diet = dinosaur.diet;

    const handleDescriptionChange = (value) => {
        updateDinosaur("diet.description", value);
    };

    const handleFoodChange = (index, value) => {
        const updatedFood = [...diet.favoriteFood];
        updatedFood[index] = value;
        updateDinosaur("diet.favoriteFood", updatedFood);
    };

    const handleFactChange = (index, field, value) => {
        const updatedFacts = [...diet.facts];
        updatedFacts[index] = {
            ...updatedFacts[index],
            [field]: value,
        };
        updateDinosaur("diet.facts", updatedFacts);
    };

    return (
        <EditableSection title="Diet">
            <section className="grid grid-cols-1 border-t border-[#D8D2C5] bg-white px-14 py-12 md:grid-cols-2">
                <div className="border-b border-[#D8D2C5] p-8 md:border-r md:border-b-0 md:p-12">
                    <h2 className="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                        Diet
                    </h2>

                    <EditableTextarea
                        value={diet.description}
                        placeholder="Describe the dinosaur's diet..."
                        rows={4}
                        onChange={handleDescriptionChange}
                        className="mt-6 w-full text-lg leading-8 text-[#4B4B4B]"
                    />

                    <div className="mt-8">
                        <h3 className="mb-4 text-xl font-semibold text-[#2B241C]">
                            Favorite Food
                        </h3>

                        <ul className="space-y-3 text-gray-700">
                            {diet.favoriteFood.map((food, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <span className="h-2 w-2 rounded-full bg-[#B88A3B]" />

                                    <EditableText
                                        value={food}
                                        placeholder={`Food ${index + 1}`}
                                        onChange={(value) =>
                                            handleFoodChange(index, value)
                                        }
                                        className="w-full"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-2 gap-6">
                        {diet.facts.map((fact, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6"
                            >
                                <EditableText
                                    value={fact.title}
                                    placeholder="Fact Title"
                                    onChange={(value) =>
                                        handleFactChange(index, "title", value)
                                    }
                                    className="w-full text-sm uppercase tracking-widest text-[#B88A3B]"
                                />

                                <EditableTextarea
                                    value={fact.value}
                                    rows={3}
                                    placeholder="Fact Description"
                                    onChange={(value) =>
                                        handleFactChange(index, "value", value)
                                    }
                                    className="mt-3 w-full text-gray-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </EditableSection>
    );
}
