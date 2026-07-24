import { useEffect, useRef } from "react";

export default function JurassicCursor() {
    const cursorRef = useRef(null);

useEffect(() => {
    const map = document.querySelector(".leaflet-container");

    if (!map) return;

    const moveCursor = (e) => {
        if (cursorRef.current) {
            cursorRef.current.style.left = `${e.clientX}px`;
            cursorRef.current.style.top = `${e.clientY}px`;
        }
    };

    const show = () => {
        cursorRef.current.style.display = "block";
    };

    const hide = () => {
        cursorRef.current.style.display = "none";
    };

    map.addEventListener("mousemove", moveCursor);
    map.addEventListener("mouseenter", show);
    map.addEventListener("mouseleave", hide);

    return () => {
        map.removeEventListener("mousemove", moveCursor);
        map.removeEventListener("mouseenter", show);
        map.removeEventListener("mouseleave", hide);
    };
}, []);
    return (
        <div
            ref={cursorRef}
            className="fixed pointer-events-none z-99999 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
        >
        <img
            src="/mapcursor.png"
            alt="cursor"
            className="w-10 h-10 object-contain"
        />
        </div>
    );
}