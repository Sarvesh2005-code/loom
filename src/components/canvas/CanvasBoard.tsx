"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addShape, updateShape, Shape, ToolType, setTool, selectShape } from "@/lib/slices/shapesSlice";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CanvasBoard() {
    const dispatch = useAppDispatch();
    const { shapes, ids, viewport, tool } = useAppSelector((state) => state.shapes);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
    const startPos = useRef<{ x: number, y: number } | null>(null);

    // Text Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Dragging State
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragOffset = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (editingId && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [editingId]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // If editing, clicking outside should stop editing
        if (editingId && e.target !== textareaRef.current) {
            setEditingId(null);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const canvasX = (screenX - viewport.x) / viewport.zoom;
        const canvasY = (screenY - viewport.y) / viewport.zoom;

        // If clicking on canvas (not shape) and tool is select, deselect all if needed
        if (tool === "select") {
            // In a real app we might deselect here
            // dispatch(selectShape(null)); 
            return;
        }

        if (tool === "hand") return;

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

    const handleShapeMouseDown = (e: React.MouseEvent, id: string) => {
        if (tool === "select") {
            e.stopPropagation();
            dispatch(selectShape(id));
            setDraggingId(id);

            const shape = shapes[id];

            // We need to calculate the offset from the shape's top-left to the mouse pointer
            // But we need the mouse pointer in Canvas Coordinates.
            // Simplest way: re-calculate canvasX/Y just like in handleMouseDown
            const svgElement = e.currentTarget.closest('svg');
            if (!svgElement) return;

            const rect = svgElement.getBoundingClientRect();
            const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
            const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

            dragOffset.current = { x: canvasX - shape.x, y: canvasY - shape.y };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
        const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

        // Handle Dragging
        if (draggingId && tool === "select" && dragOffset.current) {
            dispatch(updateShape({
                id: draggingId,
                x: canvasX - dragOffset.current.x,
                y: canvasY - dragOffset.current.y
            }));
            return;
        }

        // Handle Drawing
        if (!isDrawing || !currentShapeId || !startPos.current) return;
        if (tool === "text") return;

        const width = canvasX - startPos.current.x;
        const height = canvasY - startPos.current.y;

        const x = width < 0 ? canvasX : startPos.current.x;
        const y = height < 0 ? canvasY : startPos.current.y;

        dispatch(updateShape({
            id: currentShapeId,
            x,
            y,
            width: Math.abs(width),
            height: Math.abs(height)
        }));
    };

    const handleMouseUp = () => {
        if (isDrawing && tool === "text" && currentShapeId) {
            dispatch(setTool("select"));
        }

        setIsDrawing(false);
        setCurrentShapeId(null);
        startPos.current = null;
        setDraggingId(null);
        dragOffset.current = null;
    };

    const handleDoubleClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const shape = shapes[id];
        if (shape && shape.type === "text") {
            setEditingId(id);
            dispatch(selectShape(id));
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (editingId) {
            dispatch(updateShape({
                id: editingId,
                content: e.target.value
            }));
        }
    };

    return (
        <div
            className="absolute inset-0 overflow-hidden bg-dot-pattern cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
                        onMouseDown={(e) => handleShapeMouseDown(e, id)}
                        onDoubleClick={(e) => handleDoubleClick(e, id)}
                        className={`hover:opacity-80 ${tool === 'select' ? 'cursor-move' : ''}`}>
                        <RenderShape shape={shapes[id]} />
                    </g>
                ))}
            </svg>

            {/* Editing Overlay */}
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
                        value={shapes[editingId].content || ""}
                        onChange={handleTextChange}
                        onBlur={() => setEditingId(null)}
                        className="bg-transparent text-black border border-blue-500 outline-none resize-none overflow-hidden p-0 m-0"
                        style={{
                            fontSize: 16,
                            fontFamily: "sans-serif",
                            width: Math.max(100, shapes[editingId].width * viewport.zoom),
                            height: Math.max(30, shapes[editingId].height * viewport.zoom),
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function RenderShape({ shape }: { shape: Shape }) {
    const commonProps = {
        transform: `translate(${shape.x}, ${shape.y}) rotate(${shape.rotation})`,
        fill: shape.fill,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
    };

    switch (shape.type) {
        case "rectangle":
            return (
                <rect
                    width={Math.max(0, shape.width)}
                    height={Math.max(0, shape.height)}
                    {...commonProps}
                />
            );
        case "ellipse":
            return (
                <ellipse
                    cx={shape.width / 2}
                    cy={shape.height / 2}
                    rx={Math.max(0, shape.width) / 2}
                    ry={Math.max(0, shape.height) / 2}
                    {...commonProps}
                />
            );
        case "text":
            return (
                <text
                    x={shape.x}
                    y={shape.y}
                    transform={`rotate(${shape.rotation}, ${shape.x}, ${shape.y})`}
                    dy="1em"
                    fontSize={16}
                    fontFamily="sans-serif"
                    fill={shape.fill || "black"}
                    stroke="none"
                    className="select-none pointer-events-none"
                >
                    {shape.content || "Double click to edit"}
                </text>
            );
        default:
            return null;
    }
}
