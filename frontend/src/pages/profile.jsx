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
        return <div className="text-white">Loading...</div>;
    }

    if (!profile) {
        return <div className="text-white">Please login again.</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#0B1A13] text-white">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl space-y-8 p-6">
                    <div>
                        {isEditOpen && (
                            <EditProfileModal
                                profile={profile}
                                setProfile={setProfile}
                                onClose={() => setIsEditOpen(false)}
                            />
                        )}
                    </div>
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

import { useEffect, useState } from "react";

import { getProfile } from "../api/profileService";

import Sidebar from "../components/profile-components/SideBar";
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
        return <div className="text-white">Loading...</div>;
    }

    if (!profile) {
        return <div className="text-white">Please login again.</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#0B1A13] text-white">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl space-y-8 p-6">
                    <div>
                        {isEditOpen && (
                            <EditProfileModal
                                profile={profile}
                                setProfile={setProfile}
                                onClose={() => setIsEditOpen(false)}
                            />
                        )}
                    </div>
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
