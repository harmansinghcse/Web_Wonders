import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Search, Eye } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminSubmissions() {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`${API_URL}/api/dinosaur/submissions`, {
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setSubmissions(data.data);
                } else {
                    toast.error(data.message || "Failed to fetch submissions");
                }
            } catch (err) {
                console.error(err);
                toast.error("Network error while fetching submissions");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const filteredSubmissions = submissions.filter((sub) => {
        const matchesSearch = sub.dinosaurData?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === "all" || sub.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="relative flex min-h-screen items-center justify-center bg-[#0B1A13] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E3326_0%,transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#C9AA5B]" />
                    <p className="text-sm font-medium text-gray-400">Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#0b0c0a] py-12 text-white selection:bg-[#C9AA5B]/30 selection:text-white">
            {/* Ambient visual glows */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#1E3326_0%,transparent_50%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,#16261D_0%,transparent_45%)]" />

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8">
                    <div>
                        <Link
                            to="/"
                            className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold text-gray-300 backdrop-blur-xl transition hover:border-[#C9AA5B]/40 hover:text-white"
                        >
                            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
                            Back to Expedition
                        </Link>
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Submission Moderation</h1>
                        <p className="mt-2 text-sm text-gray-400">Review and approve user-contributed dinosaur submissions for the encyclopedia.</p>
                    </div>
                </header>

                {/* Filters Row */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by dinosaur name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none backdrop-blur-md transition focus:border-[#C9AA5B]/40"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5 backdrop-blur-md">
                        {["all", "pending", "approved", "rejected"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                                    statusFilter === filter
                                        ? "bg-[#C9AA5B] text-neutral-950 font-bold"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submissions Grid */}
                {filteredSubmissions.length === 0 ? (
                    <div className="mt-12 rounded-[28px] border border-white/5 bg-black/20 py-16 text-center backdrop-blur-md">
                        <Clock size={48} className="mx-auto text-gray-600 animate-pulse" />
                        <h2 className="mt-4 text-xl font-bold text-gray-300">No submissions found</h2>
                        <p className="mt-1 text-sm text-gray-500">Submissions matching your criteria will show up here.</p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredSubmissions.map((sub) => {
                            const isPending = sub.status === "pending";
                            const isApproved = sub.status === "approved";
                            const isRejected = sub.status === "rejected";

                            return (
                                <div
                                    key={sub._id}
                                    className="flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
                                >
                                    <div>
                                        {/* Status Tag */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500">
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </span>
                                            
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                isApproved ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                isRejected ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                                "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                            }`}>
                                                {isPending && <Clock size={10} />}
                                                {isApproved && <CheckCircle2 size={10} />}
                                                {isRejected && <XCircle size={10} />}
                                                {sub.status}
                                            </span>
                                        </div>

                                        {/* Thumbnail & Title */}
                                        <div className="mt-6 flex items-center gap-4">
                                            {sub.dinosaurData?.images?.heroBackground ? (
                                                <img
                                                    src={sub.dinosaurData.images.heroBackground}
                                                    alt={sub.dinosaurData.name}
                                                    className="h-14 w-14 rounded-full object-cover border border-white/10"
                                                />
                                            ) : (
                                                <div className="h-14 w-14 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-xs text-gray-600">
                                                    🦖
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-bold font-serif leading-tight">
                                                    {sub.dinosaurData?.name || "Unnamed Dino"}
                                                </h3>
                                                <p className="text-xs text-gray-400 italic">
                                                    {sub.dinosaurData?.scientificName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Contributor Details */}
                                        <div className="mt-6 border-t border-white/5 pt-4 text-xs text-gray-400 leading-relaxed">
                                            <div><strong>Contributor:</strong> {sub.submittedBy?.name || "Anonymous"}</div>
                                            <div className="text-[10px] font-mono text-gray-500">{sub.submittedBy?.email}</div>
                                        </div>

                                        {/* Admin Rejection Feedback */}
                                        {isRejected && sub.feedback && (
                                            <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-400/90 leading-normal">
                                                <strong>Feedback:</strong> "{sub.feedback}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    <div className="mt-6">
                                        <button
                                            onClick={() => navigate(`/create?review=${sub._id}`)}
                                            className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <Eye size={14} />
                                            {isPending ? "Review & Moderate" : "View Details"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
