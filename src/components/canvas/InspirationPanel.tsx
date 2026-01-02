"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InspirationPanelProps {
    projectId: Id<"projects">;
}

export default function InspirationPanel({ projectId }: InspirationPanelProps) {
    const project = useQuery(api.projects.getProject, { projectId });
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!project) return null;

    const images = project.moodBoardImages || [];

    if (isCollapsed) {
        return (
            <div className="fixed top-20 left-4 z-40">
                <Button
                    variant="outline"
                    className="bg-black/80 backdrop-blur-md border-white/10 text-white hover:bg-white/10 rounded-lg shadow-xl gap-2"
                    onClick={() => setIsCollapsed(false)}
                >
                    <ImageIcon className="w-4 h-4" /> Inspiration ({images.length})
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed top-20 left-4 z-40 w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left-5 duration-300">
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    Inspiration Board
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-white" onClick={() => setIsCollapsed(true)}>
                    <Minimize2 className="w-3 h-3" />
                </Button>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {images.length === 0 ? (
                    <div className="col-span-2 py-8 text-center text-xs text-neutral-500 border border-dashed border-white/10 rounded-lg">
                        Add images in Style Guide
                    </div>
                ) : (
                    images.map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-md overflow-hidden bg-neutral-900 border border-white/10 relative group cursor-grab active:cursor-grabbing" draggable onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", url);
                            e.dataTransfer.setData("type", "image");
                        }}>
                            <img src={url} alt="Inspiration" className="w-full h-full object-cover transition-opacity group-hover:opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                <span className="text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded backdrop-blur-md">Drag</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
