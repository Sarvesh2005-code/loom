"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setViewport } from "@/lib/slices/shapesSlice";

export default function ZoomControls() {
    const dispatch = useAppDispatch();
    const viewport = useAppSelector((state) => state.shapes.viewport);

    const handleZoom = (delta: number) => {
        const newZoom = Math.min(Math.max(viewport.zoom + delta, 0.1), 5);
        dispatch(setViewport({ ...viewport, zoom: newZoom }));
    };

    const resetZoom = () => {
        dispatch(setViewport({ ...viewport, zoom: 1 }));
    };

    return (
        <div className="fixed bottom-4 right-32 bg-black/80 backdrop-blur-md text-white rounded-full border border-white/10 flex items-center p-1 shadow-2xl z-50">
            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white"
                onClick={() => handleZoom(-0.1)}
            >
                <Minus className="w-4 h-4" />
            </Button>

            <span className="w-12 text-center text-xs font-mono select-none">
                {Math.round(viewport.zoom * 100)}%
            </span>

            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white"
                onClick={() => handleZoom(0.1)}
            >
                <Plus className="w-4 h-4" />
            </Button>

            <div className="w-px h-4 bg-white/20 mx-1" />

            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white"
                onClick={resetZoom}
            >
                <RotateCcw className="w-3 h-3" />
            </Button>
        </div>
    );
}
