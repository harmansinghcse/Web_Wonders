import searchBar from "./searchbar";
import filter from "./filter";


function hero({
    search,
    setSearch,
    diet,
    setDiet,
    period,
    setPeriod
}) {
    return (
        <section 
            className="relative h-[85vh] bg-cover bg-center" 
            style={{ backgroundImage: "url('frontend\public\explore bg 1.jpeg')" }}>
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                    <h1 className="text-center text-6xl font-bold text-white">
                        EXPLORE THE 
                        <br />
                        PREHISTORIC WORLD
                    </h1>

                    <p className="mt-4 text-xl text-white">
                        Search, discover and learn about dinosaurs
                    </p>
                    
                    <searchBar
                        search={search}
                        setSearch={setSearch}
                    />
                    <filter
                        diet={diet}
                        setDiet={setDiet}
                        period={period}
                        setPeriod={setPeriod}
                    />
                </div>
        </section>
    );
}

export default hero;