function searchBar() {
    return (
        <div className="mt-8 w-full max-w-3xl">
            <input 
            type="text" 
            placeholder="Search dinosaurs..." 
            className="w-full rounded-2xl bg-white p-5 text-lgshadow-xl outline-none"
            />
        </div>
    );
}

export default searchBar;