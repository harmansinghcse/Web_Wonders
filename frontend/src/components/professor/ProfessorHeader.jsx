const ProfessorHeader = () => {
  return (
    <section className="relative mx-auto mt-6 w-[95%] max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#23412F] via-[#2E543B] to-[#3A6445] shadow-xl">

      {/* Dinosaur Background */}
      <div className="absolute right-10 top-0 h-full flex items-center opacity-10 text-[170px]">🦖</div>

      <div className="relative flex items-center gap-6 px-10 py-8">
        {/* Avatar */}
        <img src="/ross-avatar.png" alt="Professor Rex" className="h-24 w-24 rounded-full border-4 border-[#B8D768] object-cover shadow-lg transition duration-300 hover:scale-105"/>

        {/* Content */}
        <div>
          <h1 className="text-5xl font-bold text-white">
            Professor Ross
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#DCE7D5]">
            Explore the prehistoric world with your AI paleontologist.
            Ask questions about dinosaurs, fossils, extinction events,
            evolution and ancient ecosystems.
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <span className="text-white">
              Online
            </span>
            <span className="text-gray-300">
              •
            </span>
            <span className="text-gray-200">Always ready to talk dinos!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessorHeader;