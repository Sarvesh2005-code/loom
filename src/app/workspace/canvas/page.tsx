"use client";

import { useCanvas } from "@/hooks/use-canvas";
import Toolbar from "@/components/canvas/toolbar";

export default function CanvasPage() {
    const { canvasRef, viewport } = useCanvas();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-dot-pattern">
            {/* Infinite Canvas Container */}
            <div
                ref={canvasRef}
                className="absolute inset-0 origin-top-left"
                style={{
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                    cursor: "grab" // Dynamic cursor based on tool
                }}
            >
                {/* Render Shapes Here */}
                <div className="absolute left-[100px] top-[100px] h-32 w-32 border border-foreground bg-card p-4 shadow-sm">
                    Example Shape
                </div>
            </div>

            {/* UI Overlays */}
            <Toolbar />

            {/* Zoom Controls (can be separate component) */}
            <div className="fixed bottom-4 left-4 rounded-md border bg-background p-2 text-sm shadow-md">
                {Math.round(viewport.zoom * 100)}%
            </div>
        </div>
    );
}
