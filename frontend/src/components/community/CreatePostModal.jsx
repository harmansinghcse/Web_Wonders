import React, { useState } from "react";
import { X, FileText, Dna, Image as ImageIcon, Target, Sparkles, Sliders, Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CreatePostModal({ currentUser, initialType = "text", initialTitle = "", initialTag = "", onSubmit, onClose, postToEdit = null }) {
    const [hasPhotoAttachment, setHasPhotoAttachment] = useState(!!postToEdit?.image || initialType === "photo");
    const [hasHybridAttachment, setHasHybridAttachment] = useState(!!postToEdit?.stats || initialType === "hybrid");
    const [hasFossilAttachment, setHasFossilAttachment] = useState(initialType === "fossil");

    const [title, setTitle] = useState(postToEdit?.title || initialTitle);
    const [text, setText] = useState(postToEdit?.description || "");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(postToEdit?.image || "");
    const [attack, setAttack] = useState(postToEdit?.stats?.attack || 85);
    const [defense, setDefense] = useState(postToEdit?.stats?.defense || 90);
    const [speed, setSpeed] = useState(postToEdit?.stats?.speed || 70);
    const [size, setSize] = useState(postToEdit?.stats?.size || "Huge");
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const contentText = text.trim();
        const contentTitle = title.trim();

        const hasPhoto = hasPhotoAttachment && (imageFile || imagePreview);
        if (!contentText && !hasPhoto && !hasHybridAttachment) {
            toast.error("Post cannot be empty. Please provide description text or attach media/attributes!");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            
            // Backend will resolve the type dynamically, but we can set defaults here just in case:
            let resolvedType = "text";
            if (hasHybridAttachment) {
                resolvedType = "hybrid";
            } else if (hasPhoto) {
                resolvedType = "photo";
            }

            formData.append("type", resolvedType);
            formData.append("title", contentTitle || (resolvedType === "hybrid" ? "New Hybrid Specimen" : resolvedType === "photo" ? "Expedition Snapshot" : "Explorer Note"));
            formData.append("description", contentText);
            formData.append("category", postToEdit?.category || (resolvedType === "hybrid" ? "Shared a hybrid" : resolvedType === "photo" ? "Photo Upload" : "Explorer Journal"));
            
            if (hasPhoto) {
                if (imageFile) {
                    formData.append("image", imageFile);
                } else {
                    formData.append("image", imagePreview);
                }
            }

            if (hasHybridAttachment) {
                formData.append("stats", JSON.stringify({ attack, defense, speed, size }));
            }

            const tags = postToEdit?.tags || (hasFossilAttachment ? ["#Fossils", "#FossilFind"] : hasHybridAttachment ? ["#Hybrids", "#SpecimenLab"] : ["#Expeditions"]);
            formData.append("tags", JSON.stringify(tags));

            await onSubmit(formData);
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#E6E4D9] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0EFE8] bg-[#FAF9F5] px-5 py-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-[#2F7D4D]" size={20} />
                        <h3 className="font-serif text-base font-bold text-[#1E3A23]">
                            {postToEdit ? "Edit Prehistoric Post" : "Create Prehistoric Discovery Post"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-[#6D7A6F] hover:bg-[#EFEFE6] cursor-pointer"
                        disabled={submitting}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
                    {/* User Profile Info Badge */}
                    <div className="flex items-center gap-3 rounded-2xl bg-[#FAF9F5] p-3 border border-[#EBE8DB]">
                        {currentUser?.avatar ? (
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="h-10 w-10 rounded-full object-cover border border-[#1E3A23]/30 shrink-0"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                        ) : null}
                        {(!currentUser?.avatar) ? (
                            <div className="h-10 w-10 rounded-full bg-[#E4ECE3] flex items-center justify-center border border-[#1E3A23]/30 text-[#2A5231] font-bold text-xs shrink-0">
                                {currentUser?.name ? currentUser.name[0].toUpperCase() : "E"}
                            </div>
                        ) : (
                            <div style={{ display: "none" }} className="h-10 w-10 rounded-full bg-[#E4ECE3] flex items-center justify-center border border-[#1E3A23]/30 text-[#2A5231] font-bold text-xs shrink-0">
                                {currentUser?.name ? currentUser.name[0].toUpperCase() : "E"}
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-bold text-[#1E3A23]">{currentUser?.name || "Explorer"}</p>
                            <p className="text-[10px] text-[#6D7A6F] font-semibold">{currentUser?.handle || "@explorer"} • <span className="text-[#2F7D4D]">{currentUser?.role || "Explorer"}</span></p>
                        </div>
                    </div>

                    {/* Content Textarea */}
                    <div>
                        <label className="block text-xs font-bold text-[#4A554B] mb-1">
                            Description & Notes
                        </label>
                        <textarea
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What's on your mind, Explorer? Share research logs, hybrid blueprints, or fossil finds..."
                            className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-xs text-[#2C352E] focus:border-[#1E3A23] focus:bg-white focus:outline-none resize-none font-semibold"
                            disabled={submitting}
                        />
                    </div>

                    {/* Attachment Toggles */}
                    <div className="border-t border-[#F0EFE8] pt-3">
                        <span className="block text-[10px] font-bold text-[#6D7A6F] mb-2 uppercase tracking-wider">
                            Optional Attachments
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setHasPhotoAttachment(!hasPhotoAttachment)}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                    hasPhotoAttachment
                                        ? "border-[#3B82F6] bg-[#EFF6FF] text-[#1D4ED8]"
                                        : "border-[#E1DEC9] bg-[#FAF9F5] text-[#687A6C] hover:bg-[#EFEFE6]"
                                }`}
                                disabled={submitting}
                            >
                                <ImageIcon size={14} className={hasPhotoAttachment ? "text-[#3B82F6]" : ""} />
                                <span>Photo</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setHasHybridAttachment(!hasHybridAttachment)}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                    hasHybridAttachment
                                        ? "border-[#2F7D4D] bg-[#E4ECE3] text-[#2A5231]"
                                        : "border-[#E1DEC9] bg-[#FAF9F5] text-[#687A6C] hover:bg-[#EFEFE6]"
                                }`}
                                disabled={submitting}
                            >
                                <Dna size={14} className={hasHybridAttachment ? "text-[#2F7D4D]" : ""} />
                                <span>Hybrid Attributes</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setHasFossilAttachment(!hasFossilAttachment)}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                    hasFossilAttachment
                                        ? "border-[#D97706] bg-[#FEF3C7] text-[#92400E]"
                                        : "border-[#E1DEC9] bg-[#FAF9F5] text-[#687A6C] hover:bg-[#EFEFE6]"
                                }`}
                                disabled={submitting}
                            >
                                <Target size={14} className={hasFossilAttachment ? "text-[#D97706]" : ""} />
                                <span>Fossil Title</span>
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Optional Panels */}
                    {hasFossilAttachment && (
                        <div>
                            <label className="block text-xs font-bold text-[#4A554B] mb-1">
                                Fossil Discovery Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Rare Triceratops Brow Horn excavation..."
                                className="w-full rounded-xl border border-[#E1DEC9] bg-[#FAF9F5] p-3 text-xs text-[#2C352E] font-semibold focus:border-[#1E3A23] focus:bg-white focus:outline-none"
                                disabled={submitting}
                            />
                        </div>
                    )}

                    {hasPhotoAttachment && (
                        <div>
                            <label className="block text-xs font-bold text-[#4A554B] mb-1.5">
                                Attach Photo
                            </label>
                            {imagePreview ? (
                                <div className="relative rounded-2xl overflow-hidden border border-[#E1DEC9] bg-black h-40 flex items-center justify-center">
                                    <img src={imagePreview} alt="Preview" className="h-full max-w-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 rounded-xl bg-red-600 p-2 text-white shadow-md hover:bg-red-700 transition"
                                        disabled={submitting}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E1DEC9] hover:border-[#1E3A23] rounded-2xl p-6 bg-[#FAF9F5] cursor-pointer transition">
                                    <Upload size={24} className="text-[#6D7A6F] mb-2" />
                                    <span className="text-xs font-bold text-[#1E3A23]">Upload Specimen Photo</span>
                                    <span className="text-[10px] text-[#6D7A6F] mt-1">PNG, JPG or JPEG (Max 10MB)</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={submitting}
                                    />
                                </label>
                            )}
                        </div>
                    )}

                    {hasHybridAttachment && (
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
                                        disabled={submitting}
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
                                        disabled={submitting}
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
                                        disabled={submitting}
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
                                        disabled={submitting}
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
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-[#184D30] via-[#1F5C38] to-[#2F7D4D] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : postToEdit ? "Save Changes" : "Publish Discovery"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
