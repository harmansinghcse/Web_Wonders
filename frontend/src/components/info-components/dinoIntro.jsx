export default function DinoIntro({ hero }) {
  return (
    <div className="relative z-10 mx-auto mt-24 flex w-full max-w-7xl grow flex-col justify-center px-8 md:px-16">
      <div className="max-w-2xl">
        <h2 className="mb-4 text-sm font-semibold tracking-[0.25em] text-[#c6a87c] uppercase md:text-sm">
          {hero.tagLine}
        </h2>

        <h1 className="mb-2 text-5xl leading-[1.1] font-bold tracking-tight text-white md:text-[5.5rem]">
          {hero.title}
          <br />
          <span className="text-[#c6a87c]">{hero.highlightedTitle}</span>
        </h1>

        <p className="mt-8 max-w-xl pr-4 text-base leading-relaxed text-gray-200 md:text-lg">
          {hero.description}
        </p>
      </div>
    </div>
  );
}
