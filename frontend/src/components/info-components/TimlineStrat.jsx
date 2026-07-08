export default function TimelineStrat({ timeline, hunting }) {
  return (
    <section className="grid grid-cols-1 border-t border-[#D8D2C5] bg-white px-14 py-12 md:grid-cols-2">
      {/* Timeline */}
      <div className="border-b border-[#D8D2C5] p-8 md:border-r md:border-b-0 md:p-12">
        <h2 className="text-4xl font-bold tracking-wide text-[#2B241C] uppercase">
          {timeline.period} Timeline
        </h2>

        <div className="mt-10 space-y-4">
          <div>
            <span className="font-semibold">Lived:</span> {timeline.livedFrom} –{" "}
            {timeline.livedTo}
          </div>

          <div>
            <span className="font-semibold">Extinction:</span>{" "}
            {timeline.extinction}
          </div>
        </div>

        <p className="mt-10 text-sm text-gray-500 italic">
          All information is based on fossil discoveries and scientific
          research.
        </p>
      </div>

      {/* Hunting */}
      <div className="p-8 md:p-12">
        <h2 className="text-4xl font-bold tracking-wide text-[#2B241C] uppercase">
          {hunting.huntingStyle}
        </h2>

        <p className="mt-5 leading-8 text-gray-700">{hunting.strategy}</p>

        <div className="mt-10 grid grid-cols-2 gap-6">
          {hunting.traits.map((trait) => (
            <div key={trait.title} className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EED6A2] text-2xl">
                {trait.icon}
              </div>

              <div>
                <h3 className="font-semibold text-[#2B241C] uppercase">
                  {trait.title}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {trait.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
