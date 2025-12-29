"use client";

import { useCanvas } from "@/hooks/use-canvas";
import Toolbar from "@/components/canvas/toolbar";
import { startTransition } from "react";

export default function CanvasPage() {
    const { canvasRef, viewport, handleMouseDown, shapes } = useCanvas();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-dot-pattern">
            {/* Infinite Canvas Container */}
            <div
                ref={canvasRef}
                className="absolute inset-0 origin-top-left"
                style={{
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                }}
                onMouseDown={handleMouseDown}
            >
                {/* Render Grid/Background - Optional */}

                {/* Render Shapes */}
                {Object.values(shapes).map((shape) => (
                    <div
                        key={shape.id}
                        style={{
                            position: "absolute",
                            left: shape.x,
                            top: shape.y,
                            width: shape.width,
                            height: shape.height,
                            backgroundColor: shape.fill,
                            border: `${shape.strokeWidth}px solid ${shape.stroke}`,
                            transform: `rotate(${shape.rotation}deg)`,
                            pointerEvents: "auto" // Allow selection (later)
                        }}
                    >
                        {/* Optional: Add resize handles here if selected */}
                        {shape.type === 'image' && <img src="" alt="" className="w-full h-full object-cover" />}
                        {shape.type === 'text' && <div className="w-full h-full">{/* Text content */}</div>}
                    </div>
                ))}
            </div>

            {/* UI Overlays */}
            <Toolbar />

            {/* Zoom Controls */}
            <div className="fixed bottom-4 left-4 rounded-md border bg-background/90 p-2 text-sm shadow-md backdrop-blur-sm">
                {Math.round(viewport.zoom * 100)}%
            </div>
            <div className="fixed top-4 right-4 text-xs text-muted-foreground">
                Pan: Space+Drag or Wheel | Zoom: Ctrl+Wheel
            </div>
        </div>
    );
}
