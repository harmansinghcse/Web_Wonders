import { Clock3, Beef, MapPinned, ArrowUpDown } from "lucide-react";

import FilterDropdown from "./FilterDropDown";
/**
 * --------------------------------------------
 * Component: FilterBar
 * Purpose:
 * Displays filtering and sorting options
 * for the Explorer page. It allows users
 * to filter dinosaurs by era, diet,
 * location, and sort the results.
 * --------------------------------------------
 */

// Available geological era filter options
const ERA_OPTIONS = [
    { label: "All Eras", value: "" },
    { label: "Triassic", value: "Triassic" },
    { label: "Jurassic", value: "Jurassic" },
    { label: "Cretaceous", value: "Cretaceous" },
];
// Available diet filter options
const DIET_OPTIONS = [
    { label: "All Diets", value: "" },
    { label: "Carnivore", value: "Carnivore" },
    { label: "Herbivore", value: "Herbivore" },
    { label: "Omnivore", value: "Omnivore" },
];
// Available location filter options
const LOCATION_OPTIONS = [
    { label: "All Locations", value: "" },
    { label: "North America", value: "North America" },
    { label: "South America", value: "South America" },
    { label: "Europe", value: "Europe" },
    { label: "Asia", value: "Asia" },
    { label: "Africa", value: "Africa" },
    { label: "Australia", value: "Australia" },
    { label: "Antarctica", value: "Antarctica" },
];
// Available sorting options
const SORT_OPTIONS = [
    { label: "Name (A-Z)", value: "name" },
    { label: "Name (Z-A)", value: "-name" },
];

export default function FilterBar({ filters, setFilters, setPage }) {
              // Updates the selected filter and resets pagination
    const handleChange = (field) => (e) => {
        setPage(1);

        setFilters((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    return (
         // Container for all explorer filters
        <div className="mt-6 flex flex-wrap justify-center gap-5">
            <FilterDropdown
                label="Era"
                icon={Clock3}
                value={filters.era}
                onChange={handleChange("era")}
                options={ERA_OPTIONS}
            />

            <FilterDropdown
                label="Diet"
                icon={Beef}
                value={filters.diet}
                onChange={handleChange("diet")}
                options={DIET_OPTIONS}
            />

            <FilterDropdown
                label="Location"
                icon={MapPinned}
                value={filters.location}
                onChange={handleChange("location")}
                options={LOCATION_OPTIONS}
            />

            <FilterDropdown
                label="Sort"
                icon={ArrowUpDown}
                value={filters.sort}
                onChange={handleChange("sort")}
                options={SORT_OPTIONS}
            />
        </div>
    );
}
