"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateShape } from "@/lib/slices/shapesSlice";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Trash2, Type } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function PropertiesPanel() {
    const dispatch = useAppDispatch();
    const { shapes, selectedIds } = useAppSelector((state) => state.shapes);
    const selectedId = selectedIds[0];
    const shape = selectedId ? shapes[selectedId] : null;

    if (!shape) return null;

    // Helper to update specific property
    const update = (changes: any) => {
        dispatch(updateShape({ id: shape.id, ...changes }));
    };

    return (
        <div className="absolute right-4 top-20 w-64 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-right-10 duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{shape.type} Properties</span>
                <button
                    onClick={() => dispatch({ type: "shapes/deleteShape", payload: shape.id })} // Assuming deleteShape is exported action, need to map correctly if logic differs
                    className="text-red-400 hover:text-red-300 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Common Properties: Position & Size */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-500">X</label>
                    <input
                        type="number"
                        value={Math.round(shape.x)}
                        onChange={(e) => update({ x: Number(e.target.value) })}
                        className="bg-neutral-800 border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-500">Y</label>
                    <input
                        type="number"
                        value={Math.round(shape.y)}
                        onChange={(e) => update({ y: Number(e.target.value) })}
                        className="bg-neutral-800 border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-500">W</label>
                    <input
                        type="number"
                        value={Math.round(shape.width)}
                        onChange={(e) => update({ width: Number(e.target.value) })}
                        className="bg-neutral-800 border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-500">H</label>
                    <input
                        type="number"
                        value={Math.round(shape.height)}
                        onChange={(e) => update({ height: Number(e.target.value) })}
                        className="bg-neutral-800 border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Appearance */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-neutral-400">Appearance</span>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Fill</span>
                    <ColorPickerButton color={shape.fill} onChange={(c) => update({ fill: c })} />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Stroke</span>
                    <ColorPickerButton color={shape.stroke} onChange={(c) => update({ stroke: c })} />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Stroke Width</span>
                    <input
                        type="number"
                        value={shape.strokeWidth}
                        onChange={(e) => update({ strokeWidth: Number(e.target.value) })}
                        className="w-12 bg-neutral-800 border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>

            {/* Text Specific */}
            {shape.type === "text" && (
                <>
                    <div className="h-px bg-white/5" />
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-neutral-400">Typography</span>
                        <textarea
                            value={shape.content || ""}
                            onChange={(e) => update({ content: e.target.value })}
                            className="bg-neutral-800 border border-white/5 rounded p-2 text-xs text-white min-h-[60px] resize-y focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function ColorPickerButton({ color, onChange }: { color: string, onChange: (c: string) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="w-6 h-6 rounded border border-white/20 shadow-sm"
                    style={{ backgroundColor: color }}
                />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-neutral-900 border-white/10 rounded-xl">
                <HexColorPicker color={color} onChange={onChange} />
            </PopoverContent>
        </Popover>
    );
}
