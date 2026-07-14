import { useState } from "react";
import { updateProfile } from "../../api/profileService";

export default function EditProfileModal({ profile, setProfile, onClose }) {
    const [formData, setFormData] = useState({
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await updateProfile(formData);

            setProfile(response.profile);

            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-3xl bg-[#12251C] p-8 shadow-2xl">
                <h2 className="mb-6 text-3xl font-bold text-white">
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-[#1A3025] px-4 py-3 text-white outline-none focus:border-[#E4C08D]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            rows="4"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-[#1A3025] px-4 py-3 text-white outline-none focus:border-[#E4C08D]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Avatar URL
                        </label>

                        <input
                            type="text"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-[#1A3025] px-4 py-3 text-white outline-none focus:border-[#E4C08D]"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/10 px-6 py-3 text-white transition hover:bg-white/10"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#E4C08D] px-6 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
