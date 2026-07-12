import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

export default function ExplorerHero({
    search,
    setSearch,
    filters,
    setFilters,
    setPage,
}) {
    return (
        <section className="relative bg-[url('/explorer-bg.jpg')] bg-cover bg-center bg-fixed">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-40 pb-24">
                {/* Heading */}
                <h1 className="text-center text-5xl font-black uppercase tracking-wider text-white md:text-7xl">
                    Explore the
                    <br />
                    Prehistoric World
                </h1>

                {/* Description */}
                <p className="mt-5 max-w-2xl text-center text-lg text-white/90">
                    Search, discover and learn about the incredible dinosaurs
                    that once ruled the Earth.
                </p>

                {/* Search */}
                <div className="mt-10 w-full">
                    <SearchBar
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                {/* Filters */}
                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    setPage={setPage}
                />
            </div>
        </section>
    );
}
