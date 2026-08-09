import TimelineHero from "./TimelineHero";
import TimelineClimate from "./TimelineClimate";
import TimelineDinosaurs from "./TimelineDinosaurs";
import TimelineMilestone from "./TimelineMilestone";
import TimelineComparison from "./TimelineComparison";

export default function TimelineSections({
    compareMode,
    currentEra,
    compEra,
    comparisonEra,
    setComparisonEra,
    availableCompareEras,
    setSelectedSpecimen,
    navigate,
}) {
    return (
        <>
            {compareMode ? (
                <TimelineComparison
                    currentEra={currentEra}
                    compEra={compEra}
                    comparisonEra={comparisonEra}
                    setComparisonEra={setComparisonEra}
                    availableCompareEras={availableCompareEras}
                />
            ) : (
                <>
                    <TimelineHero
                        currentEra={currentEra}
                    />

                    <TimelineClimate
                        currentEra={currentEra}
                    />

                    <TimelineDinosaurs
                        currentEra={currentEra}
                        setSelectedSpecimen={setSelectedSpecimen}
                        navigate={navigate}
                    />

                    <TimelineMilestone
                        currentEra={currentEra}
                    />
                </>
            )}
        </>
    );
}