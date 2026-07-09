function filter({
    diet,
    setDiet,
    period,
    setPeriod,
}) {
    return (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
            <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl bg-white px-6 py-4 shadow">
                <option value="">Era</option>
                <option value="Jurassic">Jurassic</option>
                <option value="Cretaceous">Cretaceous</option>
            </select>
            
            <select 
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="rounded-xl bg-white px-6 py-4 shadow">
                <option value="">Diet</option>
                <option value="Herbivore">Herbivore</option>
                <option value="Carnivore">Carnivore</option>
                <option value="Omnivore">Omnivore</option>
            </select>

        </div>
    );
}

export default filter;