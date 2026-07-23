import React, { useState } from "react";
import { X, FileText, Dna, Image as ImageIcon, Target, Sparkles, Sliders } from "lucide-react";

export default function CreatePostModal({ currentUser, initialType = "text", initialTitle = "", initialTag = "", onSubmit, onClose }) {
    const [postType, setPostType] = useState(initialType);
    const [title, setTitle] = useState(initialTitle);
    const [text, setText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [attack, setAttack] = useState(85);
    const [defense, setDefense] = useState(90);
    const [speed, setSpeed] = useState(70);
    const [size, setSize] = useState("Huge");

    // Preset high-res artwork options for quick picking
    const presetImages = [
        { label: "Tyrastego", url: "/tyrastego_hybrid.jpg" },
        { label: "Spinosaurus Skull", url: "/spinosaurus_skull.jpg" },
        { label: "Raptor Enclosure", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600" },
        { label: "Prehistoric Lagoon", url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600" },
    ];

    const handleSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const contentText = text.trim();
        const contentTitle = title.trim();

        if (!contentText && !contentTitle) {
            alert("Please enter a title or description for your post!");
            return;
        }

        const defaultTitle =
            postType === "hybrid"
                ? "New Hybrid Specimen"
                : postType === "fossil"
                ? "Fossil Discovery"
                : postType === "photo"
                ? "Expedition Snapshot"
                : "Explorer Log";

        const tags = initialTag ? [initialTag, "#JurassicJourney"] : postType === "hybrid" ? ["#Hybrids", "#SpecimenLab"] : postType === "fossil" ? ["#Fossils", "#FossilFind"] : ["#Expeditions"];

        const newPostObj = {
            id: `post-${Date.now()}`,
            author: currentUser,
            timeAgo: "Just now",
            category:
                postType === "hybrid"
                    ? "Shared a hybrid"
                    : postType === "fossil"
                    ? "Fossil Find"
                    : postType === "photo"
                    ? "Photo Upload"
                    : "Explorer Journal",
            type: postType,
            title: contentTitle || defaultTitle,
            badge: postType === "hybrid" ? "Hybrid" : postType === "fossil" ? "Fossil" : "Post",
            description: contentText || contentTitle,
            image: imageUrl.trim() || (presetImages.find((p) => p.label.toLowerCase().includes(postType))?.url || presetImages[0].url),
            stats: postType === "hybrid" ? { attack, defense, speed, size } : null,
            likes: 1,
            commentsCount: 0,
            isLiked: true,
            isSaved: false,
            comments: [],
            tags,
        };

        onSubmit(newPostObj);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E6E4D9] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EFE8] bg-[#FAF9F5] px-5 py-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-[#2F7D4D]" size={20} />
                        <h3 className="font-serif text-base font-bold text-[#1E3A23]">
                            Create Prehistoric Discovery Post
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-[#6D7A6F] hover:bg-[#EFEFE6] cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
                    {/* User Profile Info Badge */}
                    <div className="flex items-center gap-3 rounded-2xl bg-[#FAF9F5] p-3 border border-[#EBE8DB]">
                        <img
                            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                            alt={currentUser?.name}
                            className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/30"
                        />
                        <div>
                            <p className="text-xs font-bold text-[#1E3A23]">{currentUser?.name}</p>
                            <p className="text-[10px] text-[#6D7A6F] font-semibold">{currentUser?.handle} • <span className="text-[#2F7D4D]">{currentUser?.role || "Explorer"}</span></p>
                        </div>
                    </div>

                    {/* Category Selector Buttons */}
                    <div>
                        <label className="block text-xs font-bold text-[#4A554B] mb-1.5 uppercase tracking-wider">
                            Select Category
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { id: "text", label: "Text Log", icon: FileText },
                                { id: "hybrid", label: "Hybrid", icon: Dna },
                                { id: "photo", label: "Photo", icon: ImageIcon },
                                { id: "fossil", label: "Fossil", icon: Target },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    type="button"
                                    key={id}
                                    onClick={() => setPostType(id)}
                                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                                        postType === id
                                            ? "border-[#1E3A23] bg-[#1E3A23] text-white shadow-xs"
                                            : "border-[#E1DEC9] bg-[#FAF9F5] text-[#687A6C] hover:bg-[#EFEFE6]"
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-[#4A554B] mb-1">
                            Discovery Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Tyrastego Apex Specimen..."
                            className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-xs text-[#2C352E] font-semibold focus:border-[#1E3A23] focus:bg-white focus:outline-none"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-bold text-[#4A554B] mb-1">
                            Description & Notes
                        </label>
                        <textarea
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Share your research findings, genetic traits, or excavation notes..."
                            className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-xs text-[#2C352E] focus:border-[#1E3A23] focus:bg-white focus:outline-none resize-none"
                        />
                    </div>

                    {/* Preset Image Selection Chips */}
                    <div>
                        <label className="block text-xs font-bold text-[#4A554B] mb-1.5">
                            Specimen Image Presets
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {presetImages.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setImageUrl(preset.url)}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition cursor-pointer ${
                                        imageUrl === preset.url
                                            ? "border-[#1E3A23] bg-[#1E3A23] text-white"
                                            : "border-[#E1DEC9] bg-[#FAF9F5] text-[#556358] hover:bg-[#EFEFE6]"
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Or enter custom image URL (https://...)"
                            className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-2.5 text-xs text-[#2C352E] focus:border-[#1E3A23] focus:bg-white focus:outline-none"
                        />
                    </div>

                    {/* Hybrid Sliders */}
                    {postType === "hybrid" && (
                        <div className="space-y-3 rounded-2xl bg-[#FAF9F5] p-4 border border-[#E1DEC9]">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A23] uppercase tracking-wider">
                                <Sliders size={14} className="text-[#2F7D4D]" />
                                <span>Hybrid Attributes</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="flex justify-between text-[11px] font-bold text-[#C53030]">
                                        <span>Attack Power</span>
                                        <span>{attack}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="100"
                                        value={attack}
                                        onChange={(e) => setAttack(Number(e.target.value))}
                                        className="w-full accent-[#C53030]"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[11px] font-bold text-[#2B6CB0]">
                                        <span>Defense Rating</span>
                                        <span>{defense}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="100"
                                        value={defense}
                                        onChange={(e) => setDefense(Number(e.target.value))}
                                        className="w-full accent-[#2B6CB0]"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-[11px] font-bold text-[#B7791F]">
                                        <span>Speed / Agility</span>
                                        <span>{speed}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="100"
                                        value={speed}
                                        onChange={(e) => setSpeed(Number(e.target.value))}
                                        className="w-full accent-[#B7791F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#4A554B] mb-1">
                                        Specimen Size
                                    </label>
                                    <select
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        className="w-full rounded-xl border border-[#E1DEC9] bg-white p-1.5 text-xs text-[#2C352E] font-bold focus:outline-none"
                                    >
                                        <option value="Medium">Medium (6-8m)</option>
                                        <option value="Large">Large (9-14m)</option>
                                        <option value="Huge">Huge (15m+)</option>
                                        <option value="Colossal">Colossal Titan</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-2 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[#E1DEC9] px-4 py-2.5 text-xs font-bold text-[#556358] hover:bg-[#F7F6F0] cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-[#184D30] via-[#1F5C38] to-[#2F7D4D] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                        >
                            Publish Discovery
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
