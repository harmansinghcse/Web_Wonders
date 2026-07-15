import { useEffect, useState } from "react";

import { getProfile } from "../api/profileService";

import Sidebar from "../components/profile-components/Sidebar";
import ProfileHeader from "../components/profile-components/ProfileHeader";
import OverviewCards from "../components/profile-components/OverviewCards";
import AchievementSection from "../components/profile-components/AchievementSection";
import ContributionSection from "../components/profile-components/ContributionSection";
import ContributionTable from "../components/profile-components/ContributionTable";
import EditProfileModal from "../components/profile-components/EditProfileModal";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profileRes, subRes] = await Promise.all([
                    getProfile(),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dinosaur/my-submissions`, {
                        credentials: "include",
                    }),
                ]);

                setProfile(profileRes.profile);

                const subData = await subRes.json();
                if (subRes.ok && subData.success) {
                    setSubmissions(subData.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F5EF]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#E2EFE0_0%,transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#005611]/10 border-t-[#005611]" />
                    <p className="text-sm font-semibold tracking-wide text-[#2E4A37]">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F5EF] px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#E2EFE0_0%,transparent_60%)]" />
                <div className="relative z-10 max-w-sm rounded-3xl border border-[#D8D2C5] bg-white p-8 text-center shadow-lg">
                    <p className="text-lg font-bold text-slate-800">
                        Session expired
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        Please login again to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen bg-[#F7F5EF] text-slate-800">
            {/* Cinematic ambient background - soft green gradients */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#E2EFE0_0%,transparent_55%)] opacity-70" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,#EBF5EA_0%,transparent_50%)] opacity-70" />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="relative z-10 flex-1 overflow-y-auto">
                {/* Mobile top bar to open sidebar */}
                <div className="flex items-center justify-between border-b border-[#D8D2C5]/50 bg-white/80 backdrop-blur-md px-4 py-4 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100"
                        aria-label="Open menu"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </button>
                    <span className="text-sm font-bold text-slate-800">
                        My Profile
                    </span>
                    <div className="w-9" />
                </div>

                <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-10">
                    {isEditOpen && (
                        <EditProfileModal
                            profile={profile}
                            setProfile={setProfile}
                            onClose={() => setIsEditOpen(false)}
                        />
                    )}

                    <ProfileHeader
                        profile={profile}
                        onEdit={() => setIsEditOpen(true)}
                    />

                    <OverviewCards profile={profile} />

                    <AchievementSection
                        profile={profile}
                        submissionsCount={submissions.length}
                    />

                    <ContributionSection
                        contributions={{
                            submitted: submissions.length,
                            approved: submissions.filter((s) => s.status === "approved").length,
                            pending: submissions.filter((s) => s.status === "pending").length,
                        }}
                    />

                    <ContributionTable contributions={submissions} />
                </div>
            </main>
        </div>
    );
}
