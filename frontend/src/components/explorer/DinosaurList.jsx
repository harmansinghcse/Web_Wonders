import DinosaurCard from "./DinosaurCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

/**
 * --------------------------------------------
 * Component: DinosaurList
 * Purpose:
 * Displays a list of dinosaur cards based on
 * the current search and filter results.
 * It also handles loading and empty states.
 * --------------------------------------------
 */

export default function DinosaurList({ loading, dinosaurs }) {
      // Display loading animation while dinosaur data is being fetched
    if (loading) {
        return <LoadingState />;
    }
    // Display a message when no dinosaurs match the search criteria
    if (dinosaurs.length === 0) {
        return <EmptyState />;
    }

    return (
        // Container with layout animation for smooth UI transitions
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
