"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUploadFiles } from "@/hooks/useUploadFiles";
import { toast } from "sonner";

interface MoodBoardProps {
    projectId: Id<"projects">;
}

export default function MoodBoard({ projectId }: MoodBoardProps) {
    const project = useQuery(api.projects.getProject, { projectId });
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const saveImage = useMutation(api.files.saveImage);
    const { startUpload } = useUploadFiles(generateUploadUrl);

    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        const fileArray = Array.from(files);
        if (fileArray.length === 0) return;

        toast.loading("Uploading images...");

        try {
            const uploaded = await startUpload(fileArray);

            await Promise.all(uploaded.map(async (file) => {
                const storageId = file.response as Id<"_storage">;
                const url = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;

                await saveImage({
                    projectId,
                    storageId: storageId,
                    url: url
                });
            }));

            toast.dismiss();
            toast.success("Images uploaded to Mood Board!");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to upload images");
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">Mood Board</h2>
                <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleChange}
                    accept="image/*"
                />
            </div>

            <div
                className={`flex-1 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center p-8
                    ${dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-800 bg-neutral-900/50"}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full content-start overflow-y-auto">
                    {project?.moodBoardImages?.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Mood Board" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                    ))}

                    {(!project?.moodBoardImages || project.moodBoardImages.length === 0) && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-neutral-500">
                            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                            <p>Drag and drop images here for AI inspiration</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
