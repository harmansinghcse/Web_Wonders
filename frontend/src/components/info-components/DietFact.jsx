export default function DietFact({ diet }) {
  return (
    <section className="grid grid-cols-1 border-t border-[#D8D2C5] bg-white px-14 py-12 md:grid-cols-2">
      <div className="border-b border-[#D8D2C5] p-8 md:border-r md:border-b-0 md:p-12">
        <h2 className="text-4xl font-bold tracking-wide text-[#2B241C] uppercase">
          Diet
        </h2>

        <p className="mt-6 text-lg leading-8 text-[#4B4B4B]">
          {" "}
          {diet.description}
        </p>

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold text-[#2B241C]">
            Favorite Food
          </h3>

          <ul className="space-y-3 text-gray-700">
            {diet.favoriteFood.map((food) => (
              <li key={food} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#B88A3B]" />
                {food}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-8 md:p-12">
        <div className="grid grid-cols-2 gap-6">
          {diet.facts.map((fact) => (
            <div
              key={fact.title}
              className="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6"
            >
              <h4 className="text-sm tracking-widest text-[#B88A3B] uppercase">
                {fact.title}
              </h4>

              <p className="mt-3 text-gray-700">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
