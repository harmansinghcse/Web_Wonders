/**
 * --------------------------------------------
 * Component: ProfessorHeader
 * Purpose:
 * Displays the header section of the
 * Professor Ross chat page, including
 * the avatar, introduction, and online
 * status of the AI assistant.
 * --------------------------------------------
 */
const ProfessorHeader = () => {
  return (
    <section className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#23412F] via-[#2E543B] to-[#3A6445] shadow-lg transition-all duration-300">

      {/* Dinosaur Background */}
      <div className="absolute right-4 md:right-10 top-0 h-full flex items-center opacity-10 text-[120px] md:text-[170px] pointer-events-none select-none">🦖</div>

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 px-6 py-6 md:px-10 md:py-8 text-center sm:text-left">
        {/* Avatar */}
        <img 
          src="/ross-avatar.png" 
          alt="Professor Rex" 
          className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-4 border-[#B8D768] object-cover shadow-lg transition duration-300 hover:scale-105 shrink-0"
        />

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Professor Ross
          </h1>

          <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm leading-relaxed sm:leading-6 text-[#DCE7D5]">
            Explore the prehistoric world with your AI paleontologist.
            Ask questions about dinosaurs, fossils, extinction events,
            evolution and ancient ecosystems.
          </p>

          <div className="mt-3 flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 bg-black/25 rounded-full px-3 py-1 text-white">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="font-medium">Online</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="text-[#DCE7D5] opacity-90 text-[11px] sm:text-xs">Always ready to talk dinos!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessorHeader;