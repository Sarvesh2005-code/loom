import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setViewport } from "@/lib/slices/shapesSlice";

// Helper types
type Point = { x: number; y: number };

export const useCanvas = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const viewport = useAppSelector((state) => state.shapes.viewport);
    const tool = useAppSelector((state) => state.shapes.tool);

    // Refs for performance (avoiding re-renders during drag/draw)
    const canvasRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef<Point>({ x: 0, y: 0 });

    // Helper: Convert screen coordinates to canvas coordinates
    const getCanvasPoint = (e: MouseEvent | React.MouseEvent): Point => {
        // Implementation logic for zoom/pan offset
        return { x: 0, y: 0 };
    };

    // Wheel Event for Zooming and Panning
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey) {
                // Zoom logic
                const zoomFactor = -e.deltaY * 0.001;
                const newZoom = Math.min(Math.max(viewport.zoom + zoomFactor, 0.1), 5);
                dispatch(setViewport({ ...viewport, zoom: newZoom }));
            } else {
                // Pan logic
                dispatch(setViewport({
                    ...viewport,
                    x: viewport.x - e.deltaX,
                    y: viewport.y - e.deltaY
                }));
            }
        };

        canvas.addEventListener("wheel", handleWheel, { passive: false });
        return () => canvas.removeEventListener("wheel", handleWheel);
    }, [viewport, dispatch]);

    return {
        canvasRef,
        viewport
    };
};
