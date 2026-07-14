import { Scissors, Share2, Activity, Sparkles } from "lucide-react";

const features = [
    { icon: Scissors, label: "Customize" },
    { icon: Share2, label: "Save & Share" },
    { icon: Activity, label: "Track Stats" },
    { icon: Sparkles, label: "Be Creative" },
];

export default function CreateFeatures() {
    return (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:gap-6">
            {features.map(({ icon: Icon, label }) => (
                <div
                    key={label}
                    className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1.5 transition-all duration-300 hover:border-[#36593D]/15 hover:bg-white/60 sm:flex-col sm:items-start sm:gap-2 sm:px-3 sm:py-2"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#36593D]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#36593D]">
                        {/* create icon */}
                        <Icon
                            size={18}
                            className="text-[#36593D] transition-colors duration-300 group-hover:text-white"
                        />
                    </div>
                    <p className="text-xs font-medium text-[#4F5E50] sm:text-sm">
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
}
