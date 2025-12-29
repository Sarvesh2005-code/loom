"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTool } from "@/lib/slices/shapesSlice";
import { MousePointer2, Hand, Square, Circle, Type, Image as ImageIcon, Pencil } from "lucide-react";

export default function Toolbar() {
    const dispatch = useAppDispatch();
    const tool = useAppSelector((state) => state.shapes.tool);

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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur-sm">
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
            </div>
        </div>
    );
}
