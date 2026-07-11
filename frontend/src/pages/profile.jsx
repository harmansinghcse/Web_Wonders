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
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();

                setProfile(data.profile);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1A13]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E3326_0%,transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#4E7C56]" />
                    <p className="text-sm font-medium tracking-wide text-white/60">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1A13] px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E3326_0%,transparent_60%)]" />
                <div className="relative z-10 max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
                    <p className="text-lg font-semibold text-white">
                        Session expired
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                        Please login again to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen bg-[#0B1A13] text-white">
            {/* Cinematic ambient background */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,#1E3326_0%,transparent_55%)]" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,#16261D_0%,transparent_50%)]" />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="relative z-10 flex-1 overflow-y-auto">
                {/* Mobile top bar to open sidebar */}
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-4 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="rounded-full border border-white/10 p-2 transition hover:bg-white/5"
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
                    <span className="text-sm font-semibold text-white/80">
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

                    <AchievementSection profile={profile} />

                    <ContributionSection
                        contributions={{
                            submitted: 0,
                            approved: 0,
                            pending: 0,
                        }}
                    />

                    <ContributionTable contributions={[]} />
                </div>
            </main>
        </div>
    );
}
