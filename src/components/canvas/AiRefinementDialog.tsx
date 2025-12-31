"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setShapes } from "@/lib/slices/shapesSlice";

interface AiRefinementDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AiRefinementDialog({ isOpen, onClose }: AiRefinementDialogProps) {
    const dispatch = useAppDispatch();
    const shapes = useAppSelector((state) => state.shapes.shapes);
    const selectedShapeIds = useAppSelector((state) => state.shapes.selectedIds);
    const refineShapes = useAction(api.ai.refineShapes);

    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Get current project ID from URL (naive approach, but works for this structure)
    // Ideally we should pass it as prop, but let's grab it from window if possible or context
    // Actually, CanvasBoard is child of SessionPage which knows projectId.
    // Ideally Toolbar triggers this, but Toolbar doesn't know projectId.
    // Let's rely on window.location for now or assumes Toolbar is used in context where we can get it.
    // BETTER: Use useParams from next/navigation
    // But Toolbar is inside SessionPage, so it's fine.

    // waiting for next tool call to import useParams

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        // Extract projectId from URL: /protected/dashboard/session/[projectId]
        const pathParts = window.location.pathname.split("/");
        const sessionIndex = pathParts.indexOf("session");
        const projectId = sessionIndex !== -1 ? pathParts[sessionIndex + 1] : null;

        if (!projectId) {
            toast.error("Could not determine project ID");
            return;
        }

        setIsLoading(true);
        try {
            const result = await refineShapes({
                projectId: projectId as any, // ID type casting
                shapes: shapes,
                selectedShapeIds: selectedShapeIds,
                prompt: prompt
            });

            if (result.shapes) {
                dispatch(setShapes(result.shapes));
                toast.success(result.message || "Canvas updated!");
                onClose();
                setPrompt("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to refine canvas");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] top-[20%] translate-y-0 p-0 overflow-hidden bg-background/80 backdrop-blur-xl border-indigo-500/20 shadow-2xl">
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/10 flex items-center gap-2 text-indigo-500">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Magic Edit</span>
                </div>
                <form onSubmit={handleSubmit} className="p-4 flex gap-2">
                    <Input
                        autoFocus
                        placeholder={selectedShapeIds.length > 0 ? "Make selected shapes..." : "Make all shapes..."}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
                    />
                    <Button type="submit" disabled={isLoading || !prompt.trim()} size="icon" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-10 h-10 shrink-0">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
