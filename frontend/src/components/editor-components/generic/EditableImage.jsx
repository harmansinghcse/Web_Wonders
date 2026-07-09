// EditableImage.jsx

export default function EditableImage({
    image,
    onUpload,
    className = "",
    placeholder = "Upload Image",
}) {
    return (
        <label className="group relative block cursor-pointer">
            {image ? (
                <img src={image} alt="" className={className} />
            ) : (
                <div
                    className={`flex items-center justify-center border-2 border-dashed border-gray-400 text-gray-400 ${className}`}
                >
                    {placeholder}
                </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="rounded-lg bg-black/70 px-4 py-2 text-white">
                    Change Image
                </span>
            </div>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
            />
        </label>
    );
}
