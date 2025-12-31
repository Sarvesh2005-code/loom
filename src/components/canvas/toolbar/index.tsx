"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTool } from "@/lib/slices/shapesSlice";
import { MousePointer2, Hand, Square, Circle, Type, Image as ImageIcon, Pencil } from "lucide-react";

import { useState } from "react";
import AiRefinementDialog from "../AiRefinementDialog";
import { Wand2 } from "lucide-react";

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
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur-sm z-50">
                <div className="flex gap-2">
                    {tools.map((t) => (
                        <Button
                            key={t.name}
                            variant={tool === t.name ? "default" : "ghost"}
                            size="icon"
                            onClick={() => dispatch(setTool(t.name))}
                        >
                            <t.icon className="h-4 w-4" />
                        </Button>
                    ))}

                    <div className="w-px bg-border mx-1" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10"
                        onClick={() => setAiDialogOpen(true)}
                    >
                        <Wand2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <AiRefinementDialog isOpen={isAiDialogOpen} onClose={() => setAiDialogOpen(false)} />
        </>
    );
}
