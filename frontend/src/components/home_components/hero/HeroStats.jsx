import { PawPrint, Layers, Globe, Target } from "lucide-react";

const stats = [
    { icon: PawPrint, value: "100+", label: "Dinosaurs" },
    { icon: Layers, value: "Fossil", label: "Records" },
    { icon: Globe, value: "180M+", label: "Years" },
    { icon: Target, value: "Interactive", label: "Quizzes" },
];

export default function HeroStats() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
                <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#36593D]/10">
                        <Icon className="h-4 w-4 text-[#36593D]" />
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-bold text-[#1F1F1F] sm:text-base">
                            {value}
                        </p>
                        <p className="text-[11px] text-[#6A675E] sm:text-xs">
                            {label}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
