import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchDinosaurs } from "../../services/dinosaurService";

export default function SearchBar({
    placeholder = "Search dinosaurs...",
    className = "",
}) {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const trimmedQuery = query.trim();

            if (trimmedQuery.length < 2) {
                setResults([]);
                setShowResults(false);
                return;
            }

            try {
                setLoading(true);

                const dinosaurs = await searchDinosaurs(trimmedQuery);

                setResults(dinosaurs);
                setShowResults(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    const handleSelect = (slug) => {
        setQuery("");
        setShowResults(false);
        navigate(`/dinosaur/${slug}`);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="group flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl transition-all duration-300 hover:border-[#C9AA5B]/40 focus-within:border-[#C9AA5B] focus-within:shadow-[0_0_20px_rgba(201,170,91,.25)]">
                <Search
                    size={18}
                    className="text-gray-400 group-focus-within:text-[#C9AA5B]"
                />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                    placeholder={placeholder}
                    className="w-56 bg-transparent text-white outline-none placeholder:text-gray-400"
                />
            </div>

            {showResults && (
                <div className="absolute left-0 top-full z-50 mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#181B16]/95 shadow-2xl backdrop-blur-xl">
                    {loading && (
                        <div className="p-4 text-center text-gray-400">
                            Searching...
                        </div>
                    )}

                    {!loading &&
                        results.map((dinosaur) => (
                            <button
                                key={dinosaur._id}
                                onClick={() => handleSelect(dinosaur.slug)}
                                className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/5"
                            >
                                <img
                                    src={dinosaur.images.heroBackground}
                                    alt={dinosaur.name}
                                    className="h-14 w-14 rounded-lg object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="font-medium text-white">
                                        {dinosaur.name}
                                    </h3>

                                    <p className="text-sm italic text-gray-400">
                                        {dinosaur.scientificName}
                                    </p>
                                </div>
                            </button>
                        ))}

                    {!loading &&
                        query.trim().length >= 2 &&
                        results.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No dinosaurs found.
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
