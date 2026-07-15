import { useState } from "react";
import { updateProfile } from "../../api/profileService";
/**
 * --------------------------------------------
 * Component: EditProfileModal
 * Purpose:
 * Displays a modal that allows users to edit
 * their profile information, including name,
 * bio, and avatar. It updates the profile
 * through the backend API.
 * --------------------------------------------
 */
export default function EditProfileModal({ profile, setProfile, onClose }) {
    // Stores the editable profile information
    const [formData, setFormData] = useState({
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
    });
    // Tracks the loading state while saving changes
    const [loading, setLoading] = useState(false);
    // Updates the corresponding form field when the user types
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    // Handles profile update when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Show loading state while updating profile
            setLoading(true);
            // Send updated profile data to the backend
            const response = await updateProfile(formData);
            // Update the profile data in the parent component
            setProfile(response.profile);
            // Close the modal after successful update
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            // Hide loading indicator
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white border border-[#D8D2C5] p-8 shadow-2xl">
                {/* Modal heading */}
                <h2 className="mb-6 text-3xl font-black text-slate-800">
                    Edit Profile
                </h2>
                {/* Profile edit form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name input */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D8D2C5] bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#005611] focus:ring-1 focus:ring-[#005611] focus:bg-white transition duration-150"
                        />
                    </div>
                    {/* Bio input */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            rows="4"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D8D2C5] bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#005611] focus:ring-1 focus:ring-[#005611] focus:bg-white transition duration-150"
                        />
                    </div>
                    {/* Avatar URL input */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Avatar URL
                        </label>

                        <input
                            type="text"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D8D2C5] bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#005611] focus:ring-1 focus:ring-[#005611] focus:bg-white transition duration-150"
                        />
                    </div>
                    {/* Action buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        {/* Close modal without saving */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 text-slate-700 font-semibold transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        {/* Save profile changes */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#005611] px-6 py-3 font-bold text-white transition duration-150 hover:bg-[#00400C] disabled:opacity-50 shadow-md shadow-[#005611]/15"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
