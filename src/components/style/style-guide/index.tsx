"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface StyleGuideProps {
    projectId: Id<"projects">;
}

export default function StyleGuide({ projectId }: StyleGuideProps) {
    const project = useQuery(api.projects.getProject, { projectId });
    const updateProject = useMutation(api.projects.updateProject);

    // Local state
    const [primaryColor, setPrimaryColor] = useState("#4f46e5");
    const [fontFamily, setFontFamily] = useState("Inter");
    const [borderRadius, setBorderRadius] = useState("0.5rem");
    const [isSaving, setIsSaving] = useState(false);

    // Sync from project DB
    useEffect(() => {
        if (project?.styleGuide) {
            if (project.styleGuide.primaryColor) setPrimaryColor(project.styleGuide.primaryColor);
            if (project.styleGuide.fontFamily) setFontFamily(project.styleGuide.fontFamily);
            if (project.styleGuide.borderRadius) setBorderRadius(project.styleGuide.borderRadius);
        }
    }, [project]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProject({
                projectId,
                styleGuide: {
                    primaryColor,
                    fontFamily,
                    borderRadius
                }
            });
            toast.success("Style Guide saved!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save Style Guide");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold dark:text-white">Style Guide</h2>
            <p className="text-sm text-muted-foreground">Define your brand's core styles for the AI to follow.</p>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-12 p-1 cursor-pointer"
                        />
                        <Input
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Font Family</Label>
                    <Input
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        placeholder="e.g., Inter, Roboto, sans-serif"
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Border Radius</Label>
                    <Input
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(e.target.value)}
                        placeholder="e.g., 0.5rem, 8px"
                    />
                </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Styles"}
            </Button>
        </div>
    );
}
