"use client";

import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { undo, redo } from "@/lib/slices/shapesSlice";
// For now, these are visual placeholders to match the design request until logic is prioritized.

export default function HistoryControls() {
    // const dispatch = useAppDispatch();

    return (
        <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-md text-white rounded-full border border-white/10 flex items-center p-1 shadow-2xl z-50">
            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white opacity-50 cursor-not-allowed" // Disabled state
            // onClick={() => dispatch(undo())}
            >
                <Undo2 className="w-4 h-4" />
            </Button>

            <div className="w-px h-4 bg-white/20 mx-1" />

            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white opacity-50 cursor-not-allowed" // Disabled state
            // onClick={() => dispatch(redo())}
            >
                <Redo2 className="w-4 h-4" />
            </Button>
        </div>
    );
}
