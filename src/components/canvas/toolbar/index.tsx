"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTool } from "@/lib/slices/shapesSlice";
import { MousePointer2, Hand, Square, Circle, Type, Image as ImageIcon, Pencil, Wand2 } from "lucide-react";
import { useState } from "react";
import AiRefinementDialog from "../AiRefinementDialog";

export default function Toolbar() {
    const dispatch = useAppDispatch();
    const tool = useAppSelector((state) => state.shapes.tool);
    const [isAiDialogOpen, setAiDialogOpen] = useState(false);

    const tools = [
        { name: "select", icon: MousePointer2 },
        { name: "hand", icon: Hand },
        { name: "rectangle", icon: Square },
        { name: "ellipse", icon: Circle },
        { name: "text", icon: Type },
        { name: "image", icon: ImageIcon },
        { name: "pencil", icon: Pencil },
    ] as const;

    return (
        <>
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-neutral-900/90 border border-white/10 shadow-2xl backdrop-blur-xl z-50 animate-in slide-in-from-bottom-5 duration-500">
                {tools.map((t) => (
                    <Button
                        key={t.name}
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "w-10 h-10 rounded-full transition-all duration-200",
                            tool === t.name
                                ? "bg-white text-black shadow-lg hover:bg-neutral-200"
                                : "text-neutral-400 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => dispatch(setTool(t.name))}
                    >
                        <t.icon className="h-5 w-5" />
                    </Button>
                ))}

                <div className="w-px h-6 bg-white/10 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                    onClick={() => setAiDialogOpen(true)}
                >
                    <Wand2 className="h-5 w-5" />
                </Button>
            </div>

            <AiRefinementDialog isOpen={isAiDialogOpen} onClose={() => setAiDialogOpen(false)} />
        </>
    );
}
