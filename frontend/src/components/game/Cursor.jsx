import { useEffect, useRef } from "react";

export default function JurassicCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        document.body.style.cursor = "none";

        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            document.body.style.cursor = "auto";
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed pointer-events-none z-99999 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
        >
        <img
            src="/gamecursor.png"
            alt="cursor"
            className="w-10 h-10 object-contain"
        />
        </div>
    );
}