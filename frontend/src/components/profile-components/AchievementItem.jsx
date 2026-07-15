import { Lock, Unlock } from "lucide-react";

/**
 * --------------------------------------------
 * Component: AchievementItem
 * Purpose:
 * Displays an individual achievement badge.
 * Shows its icon, title, description, and
 * whether it is unlocked or locked.
 * --------------------------------------------
 */
export default function AchievementItem({ icon = "🏆", title, description, isUnlocked }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300 ${
            isUnlocked
                ? "bg-white border-[#D8D2C5] hover:shadow-md hover:-translate-y-0.5"
                : "bg-gray-50/70 border-gray-200/80 opacity-65"
        }`}>
            {/* Status indicator pill */}
            <div className="absolute top-4 right-4">
                {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                        <Unlock size={10} /> Unlocked
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-200">
                        <Lock size={10} /> Locked
                    </span>
                )}
            </div>

            {/* Icon / Badge Container */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-xs ${
                isUnlocked 
                    ? "bg-[#005611]/10 text-[#005611]" 
                    : "bg-gray-200/50 text-gray-400"
            }`}>
                {icon}
            </div>

            {/* Info details */}
            <h3 className={`mt-4 font-bold text-base ${isUnlocked ? "text-slate-800" : "text-gray-500"}`}>
                {title}
            </h3>
            
            <p className="mt-1 text-xs text-gray-500 leading-normal">
                {description}
            </p>
        </div>
    );
}
