import { useState } from "react";

// mode="display" -- just shows stars based on rating prop
// mode="input"   -- clickable stars, calls onChange with selected rating
function StarRating({ rating = 0, mode = "display", onChange }) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={mode === "display"}
                    onClick={() => mode === "input" && onChange?.(star)}
                    onMouseEnter={() => mode === "input" && setHovered(star)}
                    onMouseLeave={() => mode === "input" && setHovered(0)}
                    className={`text-xl transition-colors ${mode === "input" ? "cursor-pointer" : "cursor-default"}`}
                >
                    <span className={
                        star <= (hovered || rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                    }>
                        ★
                    </span>
                </button>
            ))}
        </div>
    );
}

export default StarRating;