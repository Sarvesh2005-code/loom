"use client";

import { useMoodBoard } from "@/hooks/use-moodboard";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { X, Loader2 } from "lucide-react";

interface MoodBoardProps {
    projectId: Id<"projects">;
}

export default function MoodBoard({ projectId }: MoodBoardProps) {
    const { isDragging, uploading, images, handleDragOver, handleDragLeave, handleDrop, removeImage } = useMoodBoard(projectId);

    return (
        <div
            className={cn(
                "relative min-h-[400px] w-full rounded-lg border-2 border-dashed p-4 transition-colors",
                isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {images?.map((img) => (
                    <div key={img?.storageId} className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={img?.url || ""}
                            alt="Mood board"
                            className="h-full w-full object-cover"
                        />
                        <button
                            onClick={() => removeImage({ projectId, storageId: img!.storageId })}
                            className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {images?.length === 0 && !uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <p>Drag and drop images here</p>
                </div>
            )}

            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
}
