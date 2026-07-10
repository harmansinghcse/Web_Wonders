import DinosaurCard from "./DinosaurCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export default function DinosaurList({ loading, dinosaurs }) {
    if (loading) {
        return <LoadingState />;
    }

    if (dinosaurs.length === 0) {
        return <EmptyState />;
    }

    return (
        <motion.div layout className="space-y-6">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="wait">
                    {dinosaurs.map((dinosaur) => (
                        <DinosaurCard key={dinosaur._id} dinosaur={dinosaur} />
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
