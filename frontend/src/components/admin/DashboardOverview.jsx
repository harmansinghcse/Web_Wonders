import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExplorerDinosaurs } from "../../services/explorerService";
import { Layers, FileText, CheckCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalDinosaurs: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch dinosaurs total count
                const dinoData = await getExplorerDinosaurs({ limit: 1 });
                const totalDinos = dinoData.totalDocuments || 0;

                // Fetch submissions count
                const subResponse = await fetch(`${API_URL}/api/dinosaur/submissions`, {
                    credentials: "include",
                });
                const subData = await subResponse.json();

                let pending = 0;
                let approved = 0;
                if (subResponse.ok && subData.success && Array.isArray(subData.data)) {
                    pending = subData.data.filter(s => s.status === "pending").length;
                    approved = subData.data.filter(s => s.status === "approved").length;
                }

                setStats({
                    totalDinosaurs: totalDinos,
                    pendingSubmissions: pending,
                    approvedSubmissions: approved,
                });
            } catch (err) {
                console.error("Failed to fetch dashboard metrics", err);
                toast.error("Failed to load dashboard metrics");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Published Dinosaurs",
            value: stats.totalDinosaurs,
            icon: Layers,
            color: "text-[#C9AA5B] border-[#C9AA5B]/20 bg-[#C9AA5B]/5",
            description: "Active dinosaurs catalogued in the Jurassic Explorer encyclopedia.",
            linkText: "Manage Dinosaurs",
            linkHref: "/admin/dinosaurs",
        },
        {
            title: "Pending Moderation Submissions",
            value: stats.pendingSubmissions,
            icon: FileText,
            color: "text-amber-500 border-amber-500/20 bg-amber-500/5",
            description: "Dinosaur submissions from contributors awaiting admin approval.",
            linkText: "Moderate Submissions",
            linkHref: "/admin/submissions",
        },
        {
            title: "Approved User Submissions",
            value: stats.approvedSubmissions,
            icon: CheckCircle,
            color: "text-green-500 border-green-500/20 bg-green-500/5",
            description: "Total submissions reviewed and successfully published to the encyclopedia.",
            linkText: "View Submissions Log",
            linkHref: "/admin/submissions",
        },
    ];

    if (loading) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#C9AA5B]" />
                <p className="text-sm font-medium text-gray-400">Loading metrics overview...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Welcome to the Jurassic Explorer CMS console. Monitor active content and pending submissions.
                </p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div 
                            key={card.title}
                            className={`rounded-3xl border p-6 flex flex-col justify-between shadow-lg backdrop-blur-xl ${card.color}`}
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{card.title}</h3>
                                    <Icon size={20} className="opacity-80" />
                                </div>
                                <p className="mt-4 text-4xl font-extrabold text-white tracking-tight">{card.value}</p>
                                <p className="mt-3 text-xs text-gray-400 leading-relaxed">{card.description}</p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5">
                                <Link 
                                    to={card.linkHref}
                                    className="flex items-center gap-1.5 text-xs font-bold text-white transition hover:text-[#C9AA5B]"
                                >
                                    <span>{card.linkText}</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-6 backdrop-blur-md">
                <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/admin/dinosaurs/create"
                        className="rounded-xl bg-[#C9AA5B] px-5 py-3 text-xs font-bold text-neutral-950 transition hover:bg-[#d8bb70]"
                    >
                        + Create Dinosaur
                    </Link>
                    <Link
                        to="/admin/submissions"
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/10"
                    >
                        Review Submissions
                    </Link>
                </div>
            </div>
        </div>
    );
}
