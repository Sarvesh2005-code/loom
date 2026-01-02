import { useAppDispatch } from "@/lib/hooks";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { setShapes, setViewport, Shape } from "@/lib/slices/shapesSlice";

export function useCanvasHydration(projectId: Id<"projects">) {
    const dispatch = useAppDispatch();
    const project = useQuery(api.projects.getProject, { projectId });
    const isHydrated = useRef(false);

    useEffect(() => {
        if (!project || isHydrated.current) return;

        if (project.canvasData) {
            // Convert Array back to Record<string, Shape>
            const shapesRecord: Record<string, Shape> = {};
            // Safety check: ensure project.canvasData.shapes is an array before reducing
            // The types from Convex might be 'any' due to previous looser schema, so we cast/check carefully.
            const shapesArray = Array.isArray(project.canvasData.shapes) ? project.canvasData.shapes : [];

            shapesArray.forEach((s: any) => {
                shapesRecord[s.id] = s;
            });

            dispatch(setShapes(shapesRecord));

            if (project.canvasData.viewport) {
                dispatch(setViewport(project.canvasData.viewport));
            }
        }

        isHydrated.current = true;
    }, [project, dispatch]);

    return { isLoading: !project, project };
}
