import { useEffect, useState } from "react";

import ExplorerHero from "../components/explorer/ExplorerHero";
import ResultsHeader from "../components/explorer/ResultHeader";
import DinosaurList from "../components/explorer/DinosaurList";
import Pagination from "../components/explorer/Pagination";
import { motion } from "framer-motion";

import { useDebounce } from "use-debounce";

import { getExplorerDinosaurs } from "../services/explorerService";

export default function Explorer() {
    const [loading, setLoading] = useState(false);

    const [dinosaurs, setDinosaurs] = useState([]);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [debouncedSearch] = useDebounce(search, 400);

    const [filters, setFilters] = useState({
        era: "",
        diet: "",
        location: "",
        sort: "name-asc",
    });

    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalDocuments: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const fetchDinosaurs = async () => {
        try {
            setLoading(true);

            const response = await getExplorerDinosaurs({
                page,
                limit: 9,
                search: debouncedSearch,
                period: filters.era,
                diet: filters.diet,
                location: filters.location,
                sort: filters.sort,
            });

            setDinosaurs(response.data);

            setPagination({
                totalPages: response.totalPages,
                totalDocuments: response.totalDocuments,
                hasNextPage: response.hasNextPage,
                hasPreviousPage: response.hasPreviousPage,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDinosaurs();
    }, [page, debouncedSearch, filters]);

    return (
        <>
            <ExplorerHero
                search={search}
                setSearch={setSearch}
                filters={filters}
                setFilters={setFilters}
                setPage={setPage}
            />

            <section className="bg-[#F7F5EF] py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <ResultsHeader totalDocuments={pagination.totalDocuments} />

                    <div className="relative">
                        <motion.div layout>
                            <DinosaurList
                                loading={loading}
                                dinosaurs={dinosaurs}
                            />
                        </motion.div>

                        {loading && (
                            <div className="absolute inset-0 rounded-3xl bg-white/40 backdrop-blur-[2px]" />
                        )}
                    </div>

                    {!loading && dinosaurs.length > 0 && (
                        <Pagination
                            page={page}
                            pagination={pagination}
                            setPage={setPage}
                        />
                    )}
                </div>
            </section>
        </>
    );
}
