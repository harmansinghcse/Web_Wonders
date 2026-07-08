import { Ruler, Weight, Leaf, CalendarDays, Globe, Gauge } from "lucide-react";

export default function QuickFacts({ stats }) {
  const quickFacts = [
    {
      icon: <Ruler size={32} strokeWidth={1.5} />,
      title: "LENGTH",
      value: stats.length,
    },
    {
      icon: <Weight size={32} strokeWidth={1.5} />,
      title: "WEIGHT",
      value: stats.weight,
    },
    {
      icon: <Leaf size={32} strokeWidth={1.5} />,
      title: "DIET",
      value: stats.diet,
    },
    {
      icon: <CalendarDays size={32} strokeWidth={1.5} />,
      title: "PERIOD",
      value: stats.period,
    },
    {
      icon: <Globe size={32} strokeWidth={1.5} />,
      title: "LOCATION",
      value: stats.location,
    },
    {
      icon: <Gauge size={32} strokeWidth={1.5} />,
      title: "SPEED",
      value: stats.speed,
    },
  ];

  return (
    <div className="relative z-10 mt-12 w-full border-t border-[#36342e] bg-[#201f19]/95">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:flex-row">
        {/* Quick Facts Header */}
        <div className="flex shrink-0 items-center justify-center border-b border-[#36342e] p-8 lg:w-56 lg:border-r lg:border-b-0">
          <h3 className="text-center text-xl leading-tight font-bold tracking-wide text-white lg:text-left">
            QUICK <br className="hidden lg:block" />
            FACTS
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grow grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {quickFacts.map((fact, index) => (
            <div
              key={fact.title}
              className={`flex flex-col items-center justify-center border-[#36342e] p-8 ${
                index !== quickFacts.length - 1 ? "lg:border-r" : ""
              } border-b md:border-r md:border-b-0`}
            >
              <div className="mb-4 text-[#c6a87c]">{fact.icon}</div>

              <span className="mb-1 text-sm font-bold tracking-wider text-white">
                {fact.title}
              </span>

              <span className="text-center text-sm text-gray-400">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
