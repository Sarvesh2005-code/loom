import { useAppSelector } from "@/lib/hooks";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { Shape } from "@/lib/slices/shapesSlice"; // Ensure this is exported

export function useCanvasSync(projectId: Id<"projects">, isLoaded: boolean) {
    const { shapes, ids, viewport } = useAppSelector((state) => state.shapes);
    const updateProject = useMutation(api.projects.updateProject);

    const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const debouncedSaveRef = useRef<NodeJS.Timeout>(null);
    const lastSavedState = useRef<string>("");

    useEffect(() => {
        if (!isLoaded) return; // Critical: Don't sync until loaded

        // Prepare data payload
        const shapesArray = ids.map(id => shapes[id]);
        const payload = {
            shapes: shapesArray,
            viewport
        };
        const payloadString = JSON.stringify(payload);

        // Skip if identical to last save (avoid loops)
        if (payloadString === lastSavedState.current) return;

        setStatus("unsaved");

        // Debounce
        if (debouncedSaveRef.current) {
            clearTimeout(debouncedSaveRef.current);
        }

        debouncedSaveRef.current = setTimeout(async () => {
            setStatus("saving");
            try {
                // Optimization: Convert Record<string, Shape> to Array for Convex
                await updateProject({
                    projectId,
                    canvasData: payload
                });
                lastSavedState.current = payloadString;
                setStatus("saved");
            } catch (error) {
                console.error("Auto-save failed:", error);
                setStatus("unsaved"); // Retry logic could go here
            }
        }, 2000); // 2 second auto-save delay (aggressive but safe)

        return () => {
            if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);
        };
    }, [shapes, ids, viewport, projectId, updateProject, isLoaded]); // Added isLoaded dependency

    return status;
}
