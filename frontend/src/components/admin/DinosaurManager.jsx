import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Edit, Trash2, Calendar, MapPin, Beef, Plus, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { getExplorerDinosaurs } from "../../services/explorerService";
import { deleteDinosaur } from "../../services/adminService";
import { useDebounce } from "use-debounce";

export default function DinosaurManager() {
    const navigate = useNavigate();
    const [dinosaurs, setDinosaurs] = useState([]);
    const [loading, setLoading] = useState(false);
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

    // Deletion Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [dinoToDelete, setDinoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

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

            setDinosaurs(response.data || []);
            setPagination({
                totalPages: response.totalPages || 1,
                totalDocuments: response.totalDocuments || 0,
                hasNextPage: response.hasNextPage || false,
                hasPreviousPage: response.hasPreviousPage || false,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dinosaurs list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDinosaurs();
    }, [page, debouncedSearch, filters]);

    const handleOpenDelete = (dino) => {
        setDinoToDelete(dino);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!dinoToDelete) return;
        try {
            setDeleting(true);
            const res = await deleteDinosaur(dinoToDelete._id);
            if (res.success) {
                toast.success(`${dinoToDelete.name} was successfully deleted.`);
                setDeleteModalOpen(false);
                setDinoToDelete(null);
                fetchDinosaurs();
            } else {
                toast.error(res.message || "Failed to delete dinosaur.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "An error occurred while deleting.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Dinosaur Inventory</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        View, search, edit, or delete registered dinosaurs in the encyclopedia.
                    </p>
                </div>
                <Link
                    to="/admin/dinosaurs/create"
                    className="flex w-fit items-center gap-2 rounded-xl bg-[#C9AA5B] px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-[#d8bb70]"
                >
                    <Plus size={16} />
                    Create Dinosaur
                </Link>
            </div>

            {/* Filters Row */}
            <div className="grid gap-4 md:grid-cols-5 bg-neutral-900/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md">
                {/* Search Bar */}
                <div className="relative md:col-span-2">
                    <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by name, era, diet..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none backdrop-blur-md transition focus:border-[#C9AA5B]/40"
                    />
                </div>

                {/* Period Filter */}
                <select
                    value={filters.era}
                    onChange={(e) => {
                        setFilters({ ...filters, era: e.target.value });
                        setPage(1);
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-[#C9AA5B]/40"
                >
                    <option value="">All Eras</option>
                    <option value="Triassic">Triassic</option>
                    <option value="Jurassic">Jurassic</option>
                    <option value="Cretaceous">Cretaceous</option>
                </select>

                {/* Diet Filter */}
                <select
                    value={filters.diet}
                    onChange={(e) => {
                        setFilters({ ...filters, diet: e.target.value });
                        setPage(1);
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-[#C9AA5B]/40"
                >
                    <option value="">All Diets</option>
                    <option value="Herbivore">Herbivore</option>
                    <option value="Carnivore">Carnivore</option>
                    <option value="Omnivore">Omnivore</option>
                </select>

                {/* Sort Option */}
                <select
                    value={filters.sort}
                    onChange={(e) => {
                        setFilters({ ...filters, sort: e.target.value });
                        setPage(1);
                    }}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-[#C9AA5B]/40"
                >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="createdAt-desc">Newest Added</option>
                </select>
            </div>

            {/* Dinosaurs Grid */}
            {loading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#C9AA5B]" />
                    <p className="text-sm font-medium text-gray-400">Fetching dinosaurs inventory...</p>
                </div>
            ) : dinosaurs.length === 0 ? (
                <div className="text-center py-16 bg-neutral-900/20 border border-white/5 rounded-3xl backdrop-blur-md">
                    <span className="text-4xl">🔎</span>
                    <h3 className="mt-4 text-lg font-bold text-white">No Dinosaurs Found</h3>
                    <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
                        No dinosaurs match your search criteria. Try modifying your filter options.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {dinosaurs.map((dino) => (
                        <div 
                            key={dino._id}
                            className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C9AA5B]/30 hover:shadow-xl"
                        >
                            {/* Dinosaur Image Container */}
                            <div className="relative aspect-16/10 overflow-hidden shrink-0">
                                <img
                                    src={dino.images?.heroBackground}
                                    alt={dino.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                <div className="absolute bottom-4 left-5 right-5">
                                    <h2 className="text-2xl font-bold text-white truncate" title={dino.name}>
                                        {dino.name}
                                    </h2>
                                    <p className="italic text-[#C9AA5B] text-xs truncate" title={dino.scientificName}>
                                        {dino.scientificName}
                                    </p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div className="grid grid-cols-1 gap-y-2 text-xs text-gray-300">
                                    <div className="flex items-center gap-2" title={dino.stats?.period}>
                                        <Calendar size={14} className="shrink-0 text-[#C9AA5B]" />
                                        <span className="truncate">Era: {dino.stats?.period || "Unknown Era"}</span>
                                    </div>
                                    <div className="flex items-center gap-2" title={dino.stats?.location}>
                                        <MapPin size={14} className="shrink-0 text-[#C9AA5B]" />
                                        <span className="truncate">Location: {dino.stats?.location || "Global"}</span>
                                    </div>
                                    <div className="flex items-center gap-2" title={dino.stats?.diet}>
                                        <Beef size={14} className="shrink-0 text-[#C9AA5B]" />
                                        <span className="truncate">Diet: {dino.stats?.diet || "Specimen"}</span>
                                    </div>
                                </div>

                                {/* Actions footer */}
                                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => navigate(`/admin/dinosaurs/${dino._id}/edit`)}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-white transition hover:bg-[#C9AA5B] hover:text-neutral-950 hover:border-transparent"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleOpenDelete(dino)}
                                        className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-2 text-red-400 transition hover:bg-red-600 hover:text-white hover:border-transparent"
                                        title="Delete Dinosaur"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && dinosaurs.length > 0 && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={!pagination.hasPreviousPage}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-gray-400 transition hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-gray-400">
                        Page {page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                        disabled={!pagination.hasNextPage}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-gray-400 transition hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Deletion Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 text-white shadow-2xl"
                        >
                            <div className="flex items-center gap-3 text-red-500">
                                <AlertTriangle size={28} />
                                <h2 className="text-2xl font-bold tracking-tight">Delete Dinosaur?</h2>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-gray-400">
                                Are you absolutely sure you want to remove <strong>{dinoToDelete?.name}</strong>? This action will permanently delete the dinosaur record and cannot be undone.
                            </p>
                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setDinoToDelete(null);
                                    }}
                                    disabled={deleting}
                                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={deleting}
                                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Confirm Delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
