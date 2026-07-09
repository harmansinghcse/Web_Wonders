function searchBar({ search, setSearch }) {
    return (
        <div className="mt-8 w-full max-w-3xl">
            <input 
            type="text"  
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dinosaurs..."
            className="w-full rounded-2xl bg-white p-5 shadow-xl outline-none"
            />
        </div>
    );
}

export default searchBar;