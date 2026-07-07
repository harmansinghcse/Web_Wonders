export default function WelcomeHome() {
  return (
    <>
      {/* home-content */}
      <div className="mt-16 max-w-xl px-6 lg:mt-30 lg:px-20">
        <h1 className="text-2xl font-bold text-[#d68c37] lg:text-3xl">
          Journey Back In Time
        </h1>
        <h1 className="text-4xl font-bold text-white lg:text-5xl">
          EXPLORE THE
        </h1>
        <h1 className="text-4xl font-bold text-[#cc9401] lg:text-5xl">
          AGE OF DINOSAURS.
        </h1>
        <div className="py-5 text-base text-white lg:text-xl">
          <p>
            Discover incredible dinosaurs, ancient fossils, and the fascinating
            stories of a world that lived millions of years ago.
          </p>
        </div>

        <div className="pt-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <button className="w-full rounded-full bg-[#2f5031]/60 px-10 py-3 font-bold text-white lg:w-auto">
              EXPLORE DINOSUAR
            </button>
            <button className="rounded-full bg-[#a18e4c]/80 px-10 py-2 font-bold text-[#264328]">
              PLAY QUIZ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
