import { useEditor } from "../../context/EditorContext";
import EditableSection from "./generic/EditableSection";
import EditableText from "./generic/EditableText";

export default function TimelineStrat() {
    const { dinosaur, updateDinosaur } = useEditor();
    const timeline = dinosaur.timeline;
    const hunting = dinosaur.hunting;

    const handleTimelineChange = (field, value) => {
        updateDinosaur(`timeline.${field}`, value);
    };

    const handleHuntingChange = (field, value) => {
        updateDinosaur(`hunting.${field}`, value);
    };

    const handleTraitChange = (index, field, value) => {
        const updatedTraits = [...hunting.traits];
        updatedTraits[index] = {
            ...updatedTraits[index],
            [field]: value,
        };
        updateDinosaur("hunting.traits", updatedTraits);
    };

    return (
        <EditableSection title="Timeline & Hunting">
            <section className="grid grid-cols-1 border-t border-[#D8D2C5] bg-white px-14 py-12 md:grid-cols-2">
                {/* Timeline */}
                <div className="border-b border-[#D8D2C5] p-8 md:border-r md:border-b-0 md:p-12">
                    <select
                        value={timeline.period}
                        onChange={(e) =>
                            handleTimelineChange("period", e.target.value)
                        }
                        className="rounded-lg border border-[#D8D2C5] px-4 py-2 text-2xl font-bold uppercase text-[#2B241C] outline-none"
                    >
                        <option>Late Triassic</option>
                        <option>Early Jurassic</option>
                        <option>Middle Jurassic</option>
                        <option>Late Jurassic</option>
                        <option>Early Cretaceous</option>
                        <option>Late Cretaceous</option>
                    </select>

                    <div className="mt-10 space-y-6">
                        <div>
                            <span className="font-semibold">Lived From</span>

                            <EditableText
                                value={timeline.livedFrom}
                                placeholder="155 Million Years Ago"
                                onChange={(value) =>
                                    handleTimelineChange("livedFrom", value)
                                }
                                className="mt-2 w-full text-gray-700"
                            />
                        </div>

                        <div>
                            <span className="font-semibold">Lived To</span>

                            <EditableText
                                value={timeline.livedTo}
                                placeholder="150 Million Years Ago"
                                onChange={(value) =>
                                    handleTimelineChange("livedTo", value)
                                }
                                className="mt-2 w-full text-gray-700"
                            />
                        </div>

                        <div>
                            <span className="font-semibold">Extinction</span>

                            <EditableText
                                value={timeline.extinction}
                                placeholder="End of the Cretaceous"
                                onChange={(value) =>
                                    handleTimelineChange("extinction", value)
                                }
                                className="mt-2 w-full text-gray-700"
                            />
                        </div>
                    </div>

                    <p className="mt-10 text-sm italic text-gray-500">
                        All information is based on fossil discoveries and
                        scientific research.
                    </p>
                </div>

                {/* Hunting */}
                <div className="p-8 md:p-12">
                    <EditableText
                        value={hunting.huntingStyle}
                        placeholder="Hunting Style"
                        onChange={(value) =>
                            handleHuntingChange("huntingStyle", value)
                        }
                        className="w-full text-4xl font-bold uppercase text-[#2B241C]"
                    />

                    <EditableText
                        value={hunting.strategy}
                        placeholder="Describe hunting strategy..."
                        onChange={(value) =>
                            handleHuntingChange("strategy", value)
                        }
                        className="mt-5 w-full leading-8 text-gray-700"
                    />

                    <div className="mt-10 grid grid-cols-2 gap-6">
                        {hunting.traits.map((trait, index) => (
                            <div key={index} className="flex gap-4">
                                <EditableText
                                    value={trait.icon}
                                    placeholder="🦷"
                                    onChange={(value) =>
                                        handleTraitChange(index, "icon", value)
                                    }
                                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EED6A2] text-center text-2xl"
                                />

                                <div className="grow">
                                    <EditableText
                                        value={trait.title}
                                        placeholder="Trait"
                                        onChange={(value) =>
                                            handleTraitChange(
                                                index,
                                                "title",
                                                value,
                                            )
                                        }
                                        className="w-full font-semibold uppercase text-[#2B241C]"
                                    />

                                    <EditableText
                                        value={trait.description}
                                        placeholder="Description"
                                        onChange={(value) =>
                                            handleTraitChange(
                                                index,
                                                "description",
                                                value,
                                            )
                                        }
                                        className="mt-1 w-full text-sm text-gray-600"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </EditableSection>
    );
}
