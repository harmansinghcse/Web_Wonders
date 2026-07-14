import { Ruler, Weight, Leaf, CalendarDays, Globe, Gauge } from "lucide-react";

import EditableSection from "./generic/EditableSection";
import EditableText from "./generic/EditableText";

export default function QuickFacts({ stats, setDinosaur }) {
    const handleChange = (field, value) => {
        setDinosaur((prev) => ({
            ...prev,
            stats: {
                ...prev.stats,
                [field]: value,
            },
        }));
    };

    const quickFacts = [
        //length
        {   
            key: "length",
            icon: <Ruler size={32} strokeWidth={1.5} />,
            title: "LENGTH",
            value: stats.length,
        },
        //weight
        {
            key: "weight",
            icon: <Weight size={32} strokeWidth={1.5} />,
            title: "WEIGHT",
            value: stats.weight,
        },
        //diet
        {
            key: "diet",
            icon: <Leaf size={32} strokeWidth={1.5} />,
            title: "DIET",
            value: stats.diet,
        },
        //period
        {
            key: "period",
            icon: <CalendarDays size={32} strokeWidth={1.5} />,
            title: "PERIOD",
            value: stats.period,
        },
        //location
        {
            key: "location",
            icon: <Globe size={32} strokeWidth={1.5} />,
            title: "LOCATION",
            value: stats.location,
        },
        //speed
        {
            key: "speed",
            icon: <Gauge size={32} strokeWidth={1.5} />,
            title: "SPEED",
            value: stats.speed,
        },
    ];

    return (
        <EditableSection title="Quick Facts">
            <div className="relative z-10 mt-12 w-full border-t border-[#36342e] bg-[#201f19]/95">
                <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:flex-row">
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-center border-b border-[#36342e] p-8 lg:w-56 lg:border-r lg:border-b-0">
                        <h3 className="text-center text-xl font-bold leading-tight tracking-wide text-white lg:text-left">
                            QUICK <br className="hidden lg:block" />
                            FACTS
                        </h3>
                    </div>

                    {/* Stat */}
                    <div className="grid grow grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        {quickFacts.map((fact, index) => (
                            <div
                                key={fact.key}
                                className={`flex flex-col items-center justify-center border-[#36342e] p-8 ${
                                    index !== quickFacts.length - 1
                                        ? "lg:border-r"
                                        : ""
                                } border-b md:border-r md:border-b-0`}
                            >
                                <div className="mb-4 text-[#c6a87c]">
                                    {fact.icon}
                                </div>

                                <span className="mb-1 text-sm font-bold tracking-wider text-white">
                                    {fact.title}
                                </span>

                                <EditableText
                                    value={fact.value}
                                    placeholder="Enter value"
                                    onChange={(value) =>
                                        handleChange(fact.key, value)
                                    }
                                    className="w-full text-center text-sm text-gray-400"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </EditableSection>
    );
}
