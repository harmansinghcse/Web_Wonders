function filter() {
    return (
        <div className="mt-6 flex gap-4">
            <select className="rounded-xl bg-white px-6 py-4">
                <option>Era</option>
            </select>
            
            <select className="rounded-xl bg-white px-6 py-4">
                <option>Diet</option>
            </select>

            <select className="rounded-xl bg-white px-6 py-4">
                <option>Type</option>
            </select>

            <select className="rounded-xl bg-white px-6 py-4">
                <option>Habitat</option>
            </select>
        </div>
    );
}

export default filter;