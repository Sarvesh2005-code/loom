import { useRef, useEffect, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setViewport, addShape, updateShape, Shape, selectShape, deselectAll } from "@/lib/slices/shapesSlice";
import { v4 as uuidv4 } from "uuid"; // We need to install uuid or use simple random

// Helper: Simple ID generator if uuid not available
const generateId = () => Math.random().toString(36).substr(2, 9);

type Point = { x: number; y: number };

export const useCanvas = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const viewport = useAppSelector((state) => state.shapes.viewport);
    const tool = useAppSelector((state) => state.shapes.tool);
    const shapes = useAppSelector((state) => state.shapes.shapes);

    // Refs for performance
    const canvasRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const isDrawingRef = useRef(false);
    const currentShapeIdRef = useRef<string | null>(null);
    const startPointRef = useRef<Point>({ x: 0, y: 0 });

    // Convert screen coordinates to canvas coordinates
    const getCanvasPoint = useCallback((e: MouseEvent | React.MouseEvent): Point => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.parentElement?.getBoundingClientRect(); // Get container rect
        if (!rect) return { x: 0, y: 0 };

        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Apply viewport transform inverse
        return {
            x: (clientX - viewport.x) / viewport.zoom,
            y: (clientY - viewport.y) / viewport.zoom
        };
    }, [viewport]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const point = getCanvasPoint(e);
        startPointRef.current = point;

        if (tool === 'hand' || (tool === 'select' && e.button === 1)) {
            isDraggingRef.current = true;
            return;
        }

        if (['rectangle', 'ellipse'].includes(tool)) {
            isDrawingRef.current = true;
            const id = generateId();
            currentShapeIdRef.current = id;

            // Create initial 0-size shape
            dispatch(addShape({
                id,
                type: tool as 'rectangle' | 'ellipse',
                x: point.x,
                y: point.y,
                width: 0,
                height: 0,
                fill: '#d9d9d9', // Default grey fill
                stroke: '#000000',
                strokeWidth: 1,
                rotation: 0
            }));
        }

        if (tool === 'select') {
            // Logic for selection hit testing (simple version)
            // If clicked on empty space, deselect
            dispatch(deselectAll());
        }
    }, [tool, dispatch, getCanvasPoint]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDraggingRef.current) {
            dispatch(setViewport({
                ...viewport,
                x: viewport.x + e.movementX,
                y: viewport.y + e.movementY
            }));
            return;
        }

        if (isDrawingRef.current && currentShapeIdRef.current) {
            const point = getCanvasPoint(e);
            const start = startPointRef.current;

            // Calculate new dimensions
            const width = Math.abs(point.x - start.x);
            const height = Math.abs(point.y - start.y);
            const x = Math.min(point.x, start.x);
            const y = Math.min(point.y, start.y);

            dispatch(updateShape({
                id: currentShapeIdRef.current,
                x,
                y,
                width,
                height
            }));
        }
    }, [viewport, dispatch, getCanvasPoint]);

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;
        isDrawingRef.current = false;
        currentShapeIdRef.current = null;
    }, []);

    // Global event listeners for move/up to catch dragging/drawing outside canvas
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [handleMouseMove, handleMouseUp]);


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

        // Attach to parent/container usually, or the div itself
        const container = canvas.parentElement;
        container?.addEventListener("wheel", handleWheel, { passive: false });
        // canvas.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            container?.removeEventListener("wheel", handleWheel);
            // canvas.removeEventListener("wheel", handleWheel);
        }
    }, [viewport, dispatch]);

    return {
        canvasRef,
        viewport,
        handleMouseDown,
        shapes
    };
};
