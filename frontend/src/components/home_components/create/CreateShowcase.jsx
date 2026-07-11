const dinoImage = "/create-dino-preview1.png";

export default function CreateShowcase({
    dino = {
        length: "9.2 m",
        weight: "4,500 kg",
        diet: "Herbivore",
        period: "Late Jurassic",
        habitat: "Floodplains",
    },
}) {
    return (
        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6 sm:max-w-md lg:max-w-lg">
            {/* Dino image (transparent circular cutout PNG) */}
            <img
                src={dinoImage}
                alt="Custom dinosaur preview"
                className="relative z-10 w-full max-w-65 object-contain drop-shadow-xl sm:max-w-sm lg:max-w-md"
            />

            {/* Length card */}
            <div className="absolute -left-2 top-2 z-20 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg sm:left-0 sm:top-6 sm:gap-3 sm:px-4 sm:py-2.5">
                <span className="text-base sm:text-lg">📏</span>
                <div className="leading-tight">
                    <p className="text-[10px] text-[#6A675E] sm:text-[11px]">
                        Length
                    </p>
                    <p className="text-xs font-bold text-[#1F1F1F] sm:text-sm">
                        {dino.length}
                    </p>
                </div>
            </div>

            {/* Weight card */}
            <div className="absolute -left-2 bottom-6 z-20 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg sm:left-0 sm:bottom-10 sm:gap-3 sm:px-4 sm:py-2.5">
                <span className="text-base sm:text-lg">⚖️</span>
                <div className="leading-tight">
                    <p className="text-[10px] text-[#6A675E] sm:text-[11px]">
                        Weight
                    </p>
                    <p className="text-xs font-bold text-[#1F1F1F] sm:text-sm">
                        {dino.weight}
                    </p>
                </div>
            </div>

            {/* Info panel: Diet / Period / Habitat */}
            <div className="absolute -right-2 top-4 z-20 flex w-32 flex-col gap-2 sm:right-0 sm:top-8 sm:w-40 sm:gap-2.5">
                <InfoRow icon="🌿" label="Diet" value={dino.diet} />
                <InfoRow icon="📅" label="Period" value={dino.period} />
                <InfoRow icon="🌲" label="Habitat" value={dino.habitat} />
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-lg">
            <span className="text-base">{icon}</span>
            <div className="leading-tight">
                <p className="text-[10px] text-[#6A675E]">{label}</p>
                <p className="text-xs font-bold text-[#1F1F1F]">{value}</p>
            </div>
        </div>
    );
}
