import { Shape } from "@/lib/slices/shapesSlice";
import { memo } from "react";

interface SelectionOverlayProps {
    shape: Shape;
    zoom: number;
    viewportX: number;
    viewportY: number;
    onResizeStart: (e: React.PointerEvent, handle: string) => void;
}

function SelectionOverlay({ shape, zoom, viewportX, viewportY, onResizeStart }: SelectionOverlayProps) {
    const padding = 0; // Padding around the selection box

    // Calculate screen coordinates for the selection box
    const x = shape.x * zoom + viewportX;
    const y = shape.y * zoom + viewportY;
    const width = shape.width * zoom;
    const height = shape.height * zoom;

    const handleStyle = "absolute w-3 h-3 bg-white border border-indigo-500 rounded-full z-50 pointer-events-auto hover:scale-125 transition-transform";

    return (
        <div
            className="absolute pointer-events-none border-2 border-indigo-500"
            style={{
                left: x - padding,
                top: y - padding,
                width: width + padding * 2,
                height: height + padding * 2,
                transform: `rotate(${shape.rotation}deg)`,
                transformOrigin: "center center"
            }}
        >
            {/* Resize Handles */}
            <div className={handleStyle} style={{ top: -6, left: -6, cursor: "nwse-resize" }} onPointerDown={(e) => onResizeStart(e, "nw")} />
            <div className={handleStyle} style={{ top: -6, right: -6, cursor: "nesw-resize" }} onPointerDown={(e) => onResizeStart(e, "ne")} />
            <div className={handleStyle} style={{ bottom: -6, right: -6, cursor: "nwse-resize" }} onPointerDown={(e) => onResizeStart(e, "se")} />
            <div className={handleStyle} style={{ bottom: -6, left: -6, cursor: "nesw-resize" }} onPointerDown={(e) => onResizeStart(e, "sw")} />

            {/* Rotation Handle (Top Center) */}
            <div
                className={handleStyle}
                style={{ top: -20, left: "50%", transform: "translateX(-50%)", cursor: "grab", backgroundColor: "#6366f1" }}
                onPointerDown={(e) => onResizeStart(e, "rotate")}
            />
        </div>
    );
}

export default memo(SelectionOverlay);
