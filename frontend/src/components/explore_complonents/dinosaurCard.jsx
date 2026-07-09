
import {Link} from "react-router-dom";

function dinosaurCard({dinosaur}) {
    return (
        <Link to={`/dinosaur-info/${dinosaur.slug}`} className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition">
        
            <div className="flex items-center gap-8">
                <img src={dinosaur.image} alt={dinosaur.name} className="h-32 w-32 object-contain" />

                <div>
                    <h2 className="text-3xl font-bold text-green-900">
                    {dinosaur.name}
                    </h2>

                    <p className="text-3xl font-bold text-green-900">
                        {dinosaur.scientificName}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-5 text-gray-600">
                        <span>{dinosaur.period}</span>
                        <span>{dinosaur.diet}</span>
                        <span>{dinosaur.length} m</span>
                    </div>
                </div>
                
            </div>

            <span className="text-4xl">
                ›
            </span>
    </Link>
);
}
export default dinosaurCard;