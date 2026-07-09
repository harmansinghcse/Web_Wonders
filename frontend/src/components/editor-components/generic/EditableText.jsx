export default function EditableText({
    value,
    onChange,
    placeholder,
    className = "",
    ...props
}) {
    return (
        <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-transparent outline-none ${className}`}
            {...props}
        />
    );
}
