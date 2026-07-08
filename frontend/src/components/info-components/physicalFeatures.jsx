export default function PhysicalFeatures({ physicalFeatures }) {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-14 text-5xl font-bold tracking-wide text-[#222] uppercase">
          Physical Features
        </h2>

        <div className="grid gap-10 border-y border-[#d8d3c4] py-12 md:grid-cols-2 lg:grid-cols-4">
          {physicalFeatures.features.map((feature) => (
            <div key={feature.title} className="text-center">
              <img
                src={feature.image}
                alt={feature.title}
                className="mx-auto h-36 object-contain"
              />

              <h3 className="mt-6 text-2xl font-bold uppercase">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
