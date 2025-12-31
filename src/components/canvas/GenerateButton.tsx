"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

interface GenerateButtonProps {
    projectId: string;
    onCodeGenerated: (code: string) => void;
}

export default function GenerateButton({ projectId, onCodeGenerated }: GenerateButtonProps) {
    const { shapes } = useAppSelector((state) => state.shapes);
    const generateUI = useAction(api.ai.generateUI);
    // Fetch project to get mood board images
    const project = useQuery(api.projects.getProject, { projectId: projectId as Id<"projects"> });
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (Object.keys(shapes).length === 0) {
            toast.error("Draw something first!");
            return;
        }

        setIsLoading(true);
        try {
            // Get mood board images if available
            const moodBoardImages = project?.moodBoardImages || [];

            const result = await generateUI({
                projectId: projectId as Id<"projects">,
                shapes: shapes,
                imageUrls: moodBoardImages, // Pass images
                prompt: "Modern minimalist design"
            });

            if (result.code) {
                console.log("Generated Code:", result.code);
                toast.success("Design Generated!");
                onCodeGenerated(result.code);
            } else {
                toast.error("No code generated. Please try again.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate design");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Button
                onClick={handleGenerate}
                disabled={isLoading}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xl rounded-full px-6 py-6"
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {isLoading ? "Generating..." : "Generate Design"}
            </Button>
        </div>
    );
}
