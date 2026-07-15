/**
 * --------------------------------------------
 * Component: ProfileHeader
 * Purpose:
 * Displays the user's profile information,
 * including cover image, avatar, name,
 * email, bio, and an option to edit
 * the profile.
 * --------------------------------------------
 */

export default function ProfileHeader({ profile, onEdit }) {
    return (
        // Profile header section
        <section className="overflow-hidden rounded-3xl border border-[#D8D2C5] bg-white shadow-md">
             {/* Cover background image */}
            <div className="h-64 w-full bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
             {/* Profile information container */}
            <div className="relative px-8 pb-8">
                {/* User avatar */}
                <div className="-mt-16 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E2EFE0] text-4xl font-extrabold text-[#005611] shadow-lg">
                      {/* Display uploaded avatar or user's first initial */}
                    {profile.avatar ? (
                        <img
                            src={profile?.avatar}
                            alt={profile.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        profile?.name?.charAt(0).toUpperCase()
                    )}
                </div>
                {/* User details and action button */}
                <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">{profile.name}</h1>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            {profile.email}
                        </p>

                        <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed font-medium">
                            {profile.bio || "No bio yet."}
                        </p>
                    </div>
                     {/* Opens the edit profile modal */}
                    <button
                        onClick={onEdit}
                        className="rounded-xl bg-[#005611] px-6 py-3 font-bold text-white transition duration-200 hover:bg-[#00400C] hover:scale-[1.02] shadow-md shadow-[#005611]/15"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </section>
    );
}
