export default function TimelineComparison({
    currentEra,
    compEra,
    comparisonEra,
    setComparisonEra,
    availableCompareEras,
}) {
    return (
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {[currentEra, compEra]
                .filter(Boolean)
                .map((eraItem, idx) => (
                    <div
                        key={`compare-card-${eraItem.id}-${idx}`}
                        className="rounded-4xl border p-6 backdrop-blur-2xl space-y-5 shadow-2xl transition-all duration-300"
                        style={{
                            borderColor: eraItem.theme.border,
                            backgroundColor: eraItem.theme.cardBg,
                        }}
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                                className="rounded-full px-3 py-1 text-xs font-bold uppercase"
                                style={{
                                    backgroundColor:
                                        eraItem.theme.badgeBg,
                                    color: eraItem.theme.primary,
                                }}
                            >
                                Era {idx + 1}: {eraItem.name}
                            </span>

                            {idx === 1 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-gray-400 font-bold">
                                        Compare with:
                                    </span>

                                    <select
                                        value={
                                            comparisonEra !== null
                                                ? comparisonEra
                                                : 1
                                        }
                                        onChange={(e) =>
                                            setComparisonEra(
                                                Number(e.target.value),
                                            )
                                        }
                                        className="rounded-xl border border-white/30 bg-black/90 px-3 py-1 text-xs font-extrabold text-white focus:outline-none cursor-pointer"
                                    >
                                        {availableCompareEras.map(
                                            (er) => (
                                                <option
                                                    key={er.id}
                                                    value={er.index}
                                                    className="bg-black text-white"
                                                >
                                                    {er.name} (
                                                    {er.start} -{" "}
                                                    {er.end})
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl font-extrabold text-white">
                                {eraItem.name}
                            </h2>

                            <p
                                className="text-xs font-bold"
                                style={{
                                    color: eraItem.theme.primary,
                                }}
                            >
                                {eraItem.tagline}
                            </p>

                            <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                                {eraItem.description}
                            </p>
                        </div>

                        {/* Climate Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">
                                    Avg Temp
                                </span>

                                <span className="text-sm font-extrabold text-white">
                                    {eraItem.climate.temp}
                                </span>
                            </div>

                            <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                                <span className="text-[10px] uppercase text-gray-400 font-bold block">
                                    Oxygen O₂
                                </span>

                                <span className="text-sm font-extrabold text-emerald-300">
                                    {eraItem.climate.oxygen}
                                </span>
                            </div>
                        </div>

                        <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center">
                            <img
                                src={eraItem.dinosaur}
                                alt={eraItem.name}
                                onError={(e) => {
                                    if (eraItem.id === "triassic") {
                                        e.currentTarget.src =
                                            "/triassic-dino.webp";
                                    } else if (
                                        eraItem.id === "jurassic"
                                    ) {
                                        e.currentTarget.src =
                                            "/jurassic-dino.webp";
                                    } else {
                                        e.currentTarget.src =
                                            "/trex-dino.webp";
                                    }
                                }}
                                className="h-full w-full object-contain p-2 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
}