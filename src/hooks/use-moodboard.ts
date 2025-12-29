"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useMoodBoard(projectId: Id<"projects">) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const generateUploadUrl = useMutation(api.moodboard.generateUploadUrl);
    const addImage = useMutation(api.moodboard.addMoodBoardImage);
    const removeImage = useMutation(api.moodboard.removeMoodBoardImage);
    const images = useQuery(api.moodboard.getMoodBoardImages, { projectId });

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            // Process each file
            for (const file of files) {
                if (!file.type.startsWith('image/')) continue;

                // 1. Get Upload URL
                const postUrl = await generateUploadUrl();

                // 2. Upload File
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                const { storageId } = await result.json();

                // 3. Save to Project
                await addImage({ projectId, storageId });
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    }, [generateUploadUrl, addImage, projectId]);

    return {
        isDragging,
        uploading,
        images,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeImage
    };
}
