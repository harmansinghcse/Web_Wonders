export default function Fossil({ about, fossil }) {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Description */}
          <div>
            <h2 className="mb-8 text-2xl font-extrabold text-[#1B1B1B] uppercase lg:text-4xl">
              {about.heading}
            </h2>

            {about.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-lg leading-9 text-gray-700 ${
                  index !== about.paragraphs.length - 1 ? "mb-8" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Fossil Record */}
          <div>
            <div className="relative overflow-hidden rounded-[30px] shadow-2xl">
              <img
                src={fossil.image}
                alt={`${about.heading} Fossil`}
                className="h-[520px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-8 left-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C79A4A] bg-black/50 text-3xl text-[#C79A4A]">
                  🦴
                </div>

                <div>
                  <h3 className="text-3xl font-bold tracking-wide text-white uppercase">
                    Fossil Record
                  </h3>

                  <p className="text-sm text-gray-300">
                    Discoveries across {fossil.locations.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
