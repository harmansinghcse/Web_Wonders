import { Search, X, Calendar, Beef, Globe, Dices, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ControlPanel = ({
    searchQuery,
    setSearchQuery,
    selectedEra,
    setSelectedEra,
    selectedDiet,
    setSelectedDiet,
    selectedCountry,
    setSelectedCountry,
    eras,
    diets,
    countries,
    visibleCount,
    totalCount,
    onClearFilters,
    onLocateRandom,
    onFitBounds
}) => {
    const hasActiveFilters = searchQuery || selectedEra || selectedDiet || selectedCountry;

    return (
        <div className="relative z-10 w-full rounded-[20px] border border-[#C9A14A]/20 bg-[#211D18] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.15)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9A9489]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search species by name..."
                        className="w-full rounded-2xl border border-[#C9A14A]/15 bg-[#171613] py-3.5 pl-12 pr-10 text-sm outline-none transition-all placeholder:text-[#9A9489] text-[#F5F2EA] focus:border-[#2E4A37] focus:ring-4 focus:ring-[#2E4A37]/15 font-sans"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#9A9489] hover:bg-[#2B2621] hover:text-[#F5F2EA] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:w-[50%]">
                    {/* Era Dropdown */}
                    <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A14A]" />
                        <select
                            value={selectedEra}
                            onChange={(e) => setSelectedEra(e.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#C9A14A]/15 bg-[#171613] py-3.5 pl-10 pr-8 text-xs font-bold text-[#D0C9BB] outline-none transition-all focus:border-[#2E4A37] focus:text-[#F5F2EA]"
                        >
                            <option value="">All Eras</option>
                            {eras.map((era) => (
                                <option key={era} value={era}>
                                    {era} Era
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Diet Dropdown */}
                    <div className="relative">
                        <Beef className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A14A]" />
                        <select
                            value={selectedDiet}
                            onChange={(e) => setSelectedDiet(e.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#C9A14A]/15 bg-[#171613] py-3.5 pl-10 pr-8 text-xs font-bold text-[#D0C9BB] outline-none transition-all focus:border-[#2E4A37] focus:text-[#F5F2EA]"
                        >
                            <option value="">All Diets</option>
                            {diets.map((diet) => (
                                <option key={diet} value={diet}>
                                    {diet}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Country Dropdown */}
                    <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A14A]" />
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full appearance-none rounded-2xl border border-[#C9A14A]/15 bg-[#171613] py-3.5 pl-10 pr-8 text-xs font-bold text-[#D0C9BB] outline-none transition-all focus:border-[#2E4A37] focus:text-[#F5F2EA]"
                        >
                            <option value="">All Countries</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Museum Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                    {/* Locate Random */}
                    <button
                        onClick={onLocateRandom}
                        title="Locate a Random Dinosaur"
                        disabled={visibleCount === 0}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-full border border-[#C9A14A]/30 bg-transparent hover:bg-[#C9A14A]/10 disabled:opacity-30 py-3 px-5 text-xs font-bold text-[#D0C9BB] transition-all duration-300 active:scale-95"
                    >
                        <Dices size={15} className="text-[#C9A14A]" />
                        <span>Random</span>
                    </button>

                    {/* Fit Bounds */}
                    <button
                        onClick={onFitBounds}
                        title="Fit Map to Show All Visible Dinosaurs"
                        disabled={visibleCount === 0}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#2E4A37] to-[#516858] disabled:opacity-30 py-3.5 px-6 text-xs font-bold text-[#F5F2EA] shadow-lg shadow-[#2E4A37]/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#2E4A37]/25 transition-all duration-300 active:translate-y-0 active:scale-95 border-none cursor-pointer"
                    >
                        <Maximize2 size={15} />
                        <span>Fit View</span>
                    </button>
                </div>
            </div>

            {/* Filter Badges Row */}
            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#C9A14A]/10 pt-3 text-xs"
                    >
                        <span className="font-bold text-[#9A9489] uppercase tracking-widest text-[9px] mr-1">
                            Active Filters:
                        </span>
                        
                        {selectedEra && (
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 rounded-xl bg-[#2B2621] border border-[#C9A14A]/20 px-3 py-1 font-medium text-[#D0C9BB]"
                            >
                                {selectedEra} Era
                                <button onClick={() => setSelectedEra("")} className="hover:text-red-400 transition-colors ml-1">
                                    <X size={12} />
                                </button>
                            </motion.span>
                        )}
                        {selectedDiet && (
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 rounded-xl bg-[#2B2621] border border-[#C9A14A]/20 px-3 py-1 font-medium text-[#D0C9BB]"
                            >
                                {selectedDiet}
                                <button onClick={() => setSelectedDiet("")} className="hover:text-red-400 transition-colors ml-1">
                                    <X size={12} />
                                </button>
                            </motion.span>
                        )}
                        {selectedCountry && (
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 rounded-xl bg-[#2B2621] border border-[#C9A14A]/20 px-3 py-1 font-medium text-[#D0C9BB]"
                            >
                                {selectedCountry}
                                <button onClick={() => setSelectedCountry("")} className="hover:text-red-400 transition-colors ml-1">
                                    <X size={12} />
                                </button>
                            </motion.span>
                        )}
                        {searchQuery && (
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 rounded-xl bg-[#2B2621] border border-[#C9A14A]/20 px-3 py-1 font-medium text-[#D0C9BB]"
                            >
                                Search: "{searchQuery}"
                                <button onClick={() => setSearchQuery("")} className="hover:text-red-400 transition-colors ml-1">
                                    <X size={12} />
                                </button>
                            </motion.span>
                        )}
                        
                        <motion.button
                            onClick={onClearFilters}
                            className="rounded-xl px-3 py-1 font-black text-[#C9A14A] hover:bg-[#C9A14A]/10 transition-colors"
                        >
                            Reset Filters
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ControlPanel;
