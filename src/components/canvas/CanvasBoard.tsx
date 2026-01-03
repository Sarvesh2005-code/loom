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
    const { isLoading } = useCanvasHydration(projectId);
    useCanvasSync(projectId, !isLoading); // Only sync when loaded

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
    const startPos = useRef<{ x: number, y: number } | null>(null);

    // Interaction State
    const [interactionMode, setInteractionMode] = useState<"idle" | "panning" | "drawing" | "dragging" | "resizing" | "rotating">("idle");
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);

    // Refs for Drag/Resize
    const containerRef = useRef<HTMLDivElement>(null); // Optimized: Direct ref instead of getElementById
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
        // Use containerRef if available, fallback to currentTarget (which should be container)
        const rect = containerRef.current?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
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
            newShape.stroke = "none"; // Text shouldn't have stroke by default
        }

        dispatch(addShape(newShape));
    };

    const handleShapePointerDown = (e: React.PointerEvent, id: string) => {
        if (tool === "select") {
            // Signal to parent that we handled this as a shape interaction
            e.preventDefault();
            dispatch(selectShape(id));
            setInteractionMode("dragging");

            const shape = shapes[id];

            // Robust offset calculation using cached container ref
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
                const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
                dragOffset.current = { x: canvasX - shape.x, y: canvasY - shape.y };
            }
        }
    };

    const handleResizeStart = (e: React.PointerEvent, handle: string) => {
        e.preventDefault();
        setInteractionMode(handle === "rotate" ? "rotating" : "resizing");
        setResizeHandle(handle);

        if (selectedId) {
            initialShapeState.current = { ...shapes[selectedId] };

            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
                const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
                startPos.current = { x: canvasX, y: canvasY };
            }
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
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
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const ZOOM_SPEED = 0.001;
            const oldZoom = viewport.zoom;
            const newZoom = Math.max(0.1, Math.min(5, oldZoom - e.deltaY * ZOOM_SPEED));

            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldX = (mouseX - viewport.x) / oldZoom;
            const worldY = (mouseY - viewport.y) / oldZoom;

            const newViewportX = mouseX - worldX * newZoom;
            const newViewportY = mouseY - worldY * newZoom;

            dispatch(setViewport({
                x: newViewportX,
                y: newViewportY,
                zoom: newZoom
            }));
        } else {
            dispatch(setViewport({
                ...viewport,
                x: viewport.x - e.deltaX,
                y: viewport.y - e.deltaY
            }));
        }
    };

    return (
        <div
            id="canvas-container" // Kept for global CSS if needed, but we use ref now
            ref={containerRef}
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

            {selectedId && shapes[selectedId] && tool === "select" && !editingId && (
                <SelectionOverlay
                    shape={shapes[selectedId]}
                    zoom={viewport.zoom}
                    viewportX={viewport.x}
                    viewportY={viewport.y}
                    onResizeStart={handleResizeStart}
                />
            )}

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
