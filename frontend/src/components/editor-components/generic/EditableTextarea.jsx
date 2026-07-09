export default function EditableTextarea({
    value,
    onChange,
    placeholder,
    rows = 4,
    className = "",
}) {
    return (
        <textarea
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`resize-none bg-transparent outline-none ${className}`}
        />
    );
}
