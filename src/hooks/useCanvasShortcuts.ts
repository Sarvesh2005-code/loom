import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { undo, redo, deleteShape, pasteShapes, reorderShape, deselectAll, Shape } from "@/lib/slices/shapesSlice";

export function useCanvasShortcuts() {
    const dispatch = useAppDispatch();
    const { selectedIds, shapes } = useAppSelector((state) => state.shapes);
    const [clipboard, setClipboard] = useState<Shape[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore shortcuts if typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const isCtrlOrMeta = e.ctrlKey || e.metaKey;

            // Delete
            if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.length > 0) {
                e.preventDefault();
                selectedIds.forEach(id => dispatch(deleteShape(id)));
            }

            // Undo / Redo
            if (isCtrlOrMeta && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    dispatch(redo());
                } else {
                    dispatch(undo());
                }
            }
            if (isCtrlOrMeta && e.key === "y") { // Windows Redo
                e.preventDefault();
                dispatch(redo());
            }

            // Copy
            if (isCtrlOrMeta && e.key === "c") {
                e.preventDefault();
                if (selectedIds.length > 0) {
                    const shapesToCopy = selectedIds.map(id => shapes[id]).filter(Boolean);
                    setClipboard(shapesToCopy);
                    // Optional: Save to localStorage for persistence across reloads
                }
            }

            // Paste
            if (isCtrlOrMeta && e.key === "v") {
                e.preventDefault();
                if (clipboard.length > 0) {
                    dispatch(pasteShapes(clipboard));
                }
            }

            // Select All
            if (isCtrlOrMeta && e.key === "a") {
                e.preventDefault();
                // We'd need a selectAll reducer or just iterate roughly.
                // For now, let's skip complete select-all or implement strictly if needed.
                // Assuming deselectAll exists, we might need a selectAll implementation.
            }

            // Reordering
            if (e.key === "[" && selectedIds.length > 0) {
                dispatch(reorderShape({ id: selectedIds[0], direction: "backward" }));
            }
            if (e.key === "]" && selectedIds.length > 0) {
                dispatch(reorderShape({ id: selectedIds[0], direction: "forward" }));
            }
            if (e.shiftKey && e.key === "[" && selectedIds.length > 0) {
                dispatch(reorderShape({ id: selectedIds[0], direction: "back" }));
            }
            if (e.shiftKey && e.key === "]" && selectedIds.length > 0) {
                dispatch(reorderShape({ id: selectedIds[0], direction: "front" }));
            }

            // Esc to Deselect
            if (e.key === "Escape") {
                dispatch(deselectAll());
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [dispatch, selectedIds, shapes, clipboard]);
}
