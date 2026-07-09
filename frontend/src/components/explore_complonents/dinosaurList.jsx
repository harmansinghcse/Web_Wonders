import { useEffect, useState } from "react";
import dinosaurCard from "./dinosaurCard";

function dinosaurList({
    search,
    diet,
    period,
}) {
    const [dinosaurs, setDinosaurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDinosaurs();
    },[search, diet, period]);

    const fetchDinosaurs = async () => {
        try {
            setLoading(true);

            const query = new URLSearchParams();
            if (search) query.append("name", search);
            if (diet) query.append("diet", diet);
            if (period) query.append("period", period);

            const response = await fetch(`http://localhost:5000/api/dinosaur?${query}`);
            const result = await response.json();
            setDinosaurs(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-xl">
                Loading dinosaurs...
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8 flex justify-between">
                <h2 className="text-3xl font-bold text-green-900">
                    DINOSAURS
                </h2>

                <p className="text-green-700">
                    {dinosaurs.length} dinosaurs found
                </p>
            </div>

            <div className="space-y-5">
                {dinosaurs.map((dino) => (
                    <dinosaurCard key={dino.id} dinosaur={dino} />
                ))}
            </div>
        </section>
    );
}

export default dinosaurList;