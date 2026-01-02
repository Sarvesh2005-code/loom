"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addShape, updateShape, Shape, setTool, selectShape, setViewport, deleteShape, deselectAll } from "@/lib/slices/shapesSlice";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ShapeRenderer from "./ShapeRenderer";
import SelectionOverlay from "./SelectionOverlay";
import { useCanvasSync } from "@/hooks/useCanvasSync";
import { useCanvasHydration } from "@/hooks/useCanvasHydration";

import { Id } from "../../../convex/_generated/dataModel";

interface CanvasBoardProps {
    projectId: Id<"projects">;
}

export default function CanvasBoard({ projectId }: CanvasBoardProps) {
    const dispatch = useAppDispatch();
    const { shapes, ids, viewport, selectedIds, tool } = useAppSelector((state) => state.shapes);
    const selectedId = selectedIds[0] || null;

    // Hooks for Persistence
    useCanvasHydration(projectId);
    useCanvasSync(projectId);

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
    const startPos = useRef<{ x: number, y: number } | null>(null);

    // Interaction State
    const [interactionMode, setInteractionMode] = useState<"idle" | "panning" | "drawing" | "dragging" | "resizing" | "rotating">("idle");
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);

    // Refs for Drag/Resize
    const dragOffset = useRef<{ x: number, y: number } | null>(null);
    const initialShapeState = useRef<Shape | null>(null);
    const rafRef = useRef<number | null>(null); // For RAF throttling

    // Text Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !editingId) {
                dispatch(deleteShape(selectedId));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, editingId, dispatch]);

    // Focus text area when editing
    useEffect(() => {
        if (editingId && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [editingId]);

    const getCanvasCoords = (e: React.PointerEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const canvasX = (screenX - viewport.x) / viewport.zoom;
        const canvasY = (screenY - viewport.y) / viewport.zoom;
        return { screenX, screenY, canvasX, canvasY };
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        // Critical: Capture pointer so we get events even if mouse leaves the div (fixes header bug)
        (e.target as Element).setPointerCapture(e.pointerId);

        if (editingId && e.target !== textareaRef.current) {
            setEditingId(null);
        }

        const { screenX, screenY, canvasX, canvasY } = getCanvasCoords(e);

        // Check if a child handled this event (shape click or resize handle)
        if (e.defaultPrevented) {
            // Child handled it (drag or resize), we just ensure capture is set (done above)
            return;
        }

        // Pan Logic (Hand Tool or Middle Click)
        if (tool === "hand" || e.button === 1) {
            setInteractionMode("panning");
            startPos.current = { x: screenX, y: screenY };
            return;
        }

        // If clicking on canvas background (not intercepted by shape/handle)
        if (tool === "select") {
            dispatch(deselectAll());
            return;
        }

        // Drawing Logic
        setInteractionMode("drawing");
        setIsDrawing(true);
        const id = uuidv4();
        setCurrentShapeId(id);
        startPos.current = { x: canvasX, y: canvasY };

        const newShape: Shape = {
            id,
            type: tool as "rectangle" | "ellipse",
            x: canvasX,
            y: canvasY,
            width: 0,
            height: 0,
            fill: "#e5e7eb",
            stroke: "#000000",
            strokeWidth: 2,
            rotation: 0
        };

        if (tool === "text") {
            newShape.type = "text";
            newShape.width = 120;
            newShape.height = 30;
            newShape.fill = "black";
            newShape.content = "Double click to edit";
        }

        dispatch(addShape(newShape));
    };

    const handleShapePointerDown = (e: React.PointerEvent, id: string) => {
        if (tool === "select") {
            // Signal to parent that we handled this as a shape interaction
            e.preventDefault();
            // Do NOT stopPropagation, let parent setPointerCapture

            dispatch(selectShape(id));
            setInteractionMode("dragging");

            // We need coords relative to the canvas, so we can't use e.nativeEvent easily
            // But getCanvasCoords needs the container rect. 
            // e.currentTarget is the GROUP <g>. We need the DIV's rect.
            // We can calculate offset from the shape's data which is simpler.
            const shape = shapes[id];

            // However, to drag accurately relative to mouse, we need mouse world coords.
            // getCanvasCoords uses e.currentTarget.getBoundingClientRect().
            // If we use it here, e.currentTarget is SVG <g>, which changes bounds!
            // WE NEED THE CONTAINER DIV.

            // Fix: Calculate simplified mouse pos from ClientX/Y and PRE-CALCULATED container bounds?
            // Or just traverse up?
            // Easiest: Use the fact that e.clientX is stable.
            // We'll calculate offset in handlePointerMove if startPos isn't set perfectly?
            // No, we need start offset now.

            // Workaround: Access the parent container (div) via closest? 
            // Or just assume the canvas is full screen? 
            // Safer: Use the viewport info + clientX.

            // Let's assume the parent 'div' is the offset parent or close enough.
            // Actually, we can just use the Page coordinates if we knew the canvas offset.

            // BETTER FIX: Don't calculate dragging offset here.
            // Just set the interaction mode.
            // In handlePointerDown (parent), since we preventDefault, it returns early.
            // BUT we can actually let handlePointerDown calculate the startPos/Offset!

            // Strategy change:
            // 1. handleShapePointerDown: dispatch select. e.preventDefault().
            // 2. handlePointerDown: ALWAYS calculate coords.
            // 3. If e.defaultPrevented -> we know it's a shape drag/resize.
            //    We initialize dragOffset using the calculated coords and the NOW selected ID.

            // But Redux dispatch is async? No, it's synchronous for state update usually, but component re-render is async.
            // So shapes[selectedId] might not be current in the PARENT handler immediately if we just dispatched?
            // Actually, Redux state from useAppSelector updates on next render.
            // So relying on `shapes` in parent handler is risky if we just changed selection.
            // BUT `handleShapePointerDown` has access to `id`.
            // We can pass `id` up? or set a ref?

            // Simplest Robust Way:
            // Calculate local offset here using event.
            // We need to construct the canvas coords manully without getCanvasCoords dependent on CurrentTarget.
            const container = document.getElementById("canvas-container");
            if (container) {
                const rect = container.getBoundingClientRect();
                const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
                const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
                dragOffset.current = { x: canvasX - shape.x, y: canvasY - shape.y };
            }
        }
    };

    const handleResizeStart = (e: React.PointerEvent, handle: string) => {
        // Signal child handled
        e.preventDefault();

        setInteractionMode(handle === "rotate" ? "rotating" : "resizing");
        setResizeHandle(handle);

        if (selectedId) {
            initialShapeState.current = { ...shapes[selectedId] };

            const container = document.getElementById("canvas-container");
            if (container) {
                const rect = container.getBoundingClientRect();
                const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
                const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
                startPos.current = { x: canvasX, y: canvasY };
            }
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        // e.preventDefault(); // Prevent scrolling on touch devices (commented out if it blocks other stuff, but usually good)

        if (interactionMode === "idle") return;

        // Use RAF to throttle updates
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            const { screenX, screenY, canvasX, canvasY } = getCanvasCoords(e);

            if (interactionMode === "panning" && startPos.current) {
                const dx = screenX - startPos.current.x;
                const dy = screenY - startPos.current.y;
                dispatch(setViewport({ ...viewport, x: viewport.x + dx, y: viewport.y + dy }));
                startPos.current = { x: screenX, y: screenY };
                return;
            }

            if (interactionMode === "dragging" && selectedId && dragOffset.current) {
                dispatch(updateShape({
                    id: selectedId,
                    x: canvasX - dragOffset.current.x,
                    y: canvasY - dragOffset.current.y
                }));
                return;
            }

            if (interactionMode === "drawing" && isDrawing && currentShapeId && startPos.current && tool !== "text") {
                const width = canvasX - startPos.current.x;
                const height = canvasY - startPos.current.y;
                const x = width < 0 ? canvasX : startPos.current.x;
                const y = height < 0 ? canvasY : startPos.current.y;

                dispatch(updateShape({
                    id: currentShapeId,
                    x, y,
                    width: Math.abs(width),
                    height: Math.abs(height)
                }));
                return;
            }

            if (interactionMode === "resizing" && selectedId && initialShapeState.current && startPos.current) {
                const dx = canvasX - startPos.current.x;
                const dy = canvasY - startPos.current.y;
                const initial = initialShapeState.current;

                let newX = initial.x;
                let newY = initial.y;
                let newWidth = initial.width;
                let newHeight = initial.height;

                if (resizeHandle?.includes("e")) newWidth = initial.width + dx;
                if (resizeHandle?.includes("s")) newHeight = initial.height + dy;
                if (resizeHandle?.includes("w")) { newWidth = initial.width - dx; newX = initial.x + dx; }
                if (resizeHandle?.includes("n")) { newHeight = initial.height - dy; newY = initial.y + dy; }

                dispatch(updateShape({
                    id: selectedId,
                    x: newX, y: newY,
                    width: newWidth, height: newHeight
                }));
            }

            if (interactionMode === "rotating" && selectedId && initialShapeState.current) {
                const shape = shapes[selectedId];
                const center = { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
                const angle = Math.atan2(canvasY - center.y, canvasX - center.x) * (180 / Math.PI);
                dispatch(updateShape({ id: selectedId, rotation: angle + 90 }));
            }
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        (e.target as Element).releasePointerCapture(e.pointerId);

        if (isDrawing && tool === "text" && currentShapeId) {
            dispatch(setTool("select"));
            // Auto-select the text box
            dispatch(selectShape(currentShapeId));
            setEditingId(currentShapeId);
        }

        setInteractionMode("idle");
        setIsDrawing(false);
        setCurrentShapeId(null);
        startPos.current = null;
        dragOffset.current = null;
        initialShapeState.current = null;
        setResizeHandle(null);

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        // Zoom Logic
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const ZOOM_SPEED = 0.001;
            const oldZoom = viewport.zoom;
            // Limit zoom range
            const newZoom = Math.max(0.1, Math.min(5, oldZoom - e.deltaY * ZOOM_SPEED));

            // Calculate mouse position relative to canvas container (screen coords)
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate world coordinates of the mouse before zoom
            const worldX = (mouseX - viewport.x) / oldZoom;
            const worldY = (mouseY - viewport.y) / oldZoom;

            // Calculate new viewport position to keep mouse over same world point
            // mouseX = newViewportX + worldX * newZoom
            const newViewportX = mouseX - worldX * newZoom;
            const newViewportY = mouseY - worldY * newZoom;

            dispatch(setViewport({
                x: newViewportX,
                y: newViewportY,
                zoom: newZoom
            }));
        } else {
            // Pan on scroll
            dispatch(setViewport({
                ...viewport,
                x: viewport.x - e.deltaX,
                y: viewport.y - e.deltaY
            }));
        }
    };

    return (
        <div
            id="canvas-container"
            className="absolute inset-0 overflow-hidden bg-dot-pattern cursor-crosshair select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
        >
            <svg
                className="h-full w-full touch-none"
                style={{
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
                    transformOrigin: "0 0",
                }}
            >
                {ids.map((id) => (
                    <g key={id}
                        onPointerDown={(e) => handleShapePointerDown(e, id)}
                        onDoubleClick={(e) => { e.stopPropagation(); if (shapes[id].type === "text") setEditingId(id); }}
                        className={`hover:opacity-80 transition-opacity ${tool === 'select' ? 'cursor-move' : ''}`}
                    >
                        <ShapeRenderer shape={shapes[id]} isSelected={selectedId === id} />
                    </g>
                ))}
            </svg>

            {/* Selection Overlay (Outside SVG so it doesn't get scaled poorly, but we match position manually) */}
            {selectedId && shapes[selectedId] && tool === "select" && !editingId && (
                <SelectionOverlay
                    shape={shapes[selectedId]}
                    zoom={viewport.zoom}
                    viewportX={viewport.x}
                    viewportY={viewport.y}
                    onResizeStart={handleResizeStart}
                />
            )}

            {/* Text Editing Overlay */}
            {editingId && shapes[editingId] && (
                <div
                    style={{
                        position: "absolute",
                        left: shapes[editingId].x * viewport.zoom + viewport.x,
                        top: shapes[editingId].y * viewport.zoom + viewport.y,
                        transform: `rotate(${shapes[editingId].rotation}deg)`,
                        transformOrigin: "top left"
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        defaultValue={shapes[editingId].content || ""}
                        onChange={(e) => dispatch(updateShape({ id: editingId, content: e.target.value }))}
                        onBlur={() => setEditingId(null)}
                        className="bg-transparent text-black border border-blue-500 outline-none resize-none overflow-hidden p-0 m-0"
                        style={{
                            fontSize: 16,
                            fontFamily: "Inter, sans-serif",
                            width: Math.max(100, shapes[editingId].width * viewport.zoom),
                            height: Math.max(30, shapes[editingId].height * viewport.zoom),
                        }}
                    />
                </div>
            )}
        </div>
    );
}
