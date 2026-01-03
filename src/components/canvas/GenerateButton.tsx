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

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function GenerateButton({ projectId, onCodeGenerated }: GenerateButtonProps) {
    const { shapes } = useAppSelector((state) => state.shapes);
    const generateUI = useAction(api.ai.generateUI);
    // Fetch project to get mood board images
    const project = useQuery(api.projects.getProject, { projectId: projectId as Id<"projects"> });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("Modern minimalist design");

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
                prompt: prompt
            });

            if (result.code) {
                console.log("Generated Code:", result.code);
                toast.success("Design Generated!");
                onCodeGenerated(result.code);
                setIsOpen(false);
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="fixed bottom-8 right-8 z-50">
                    <Button
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xl rounded-full px-6 py-6"
                    >
                        <Sparkles className="h-5 w-5" />
                        Generate Design
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle>Generate UI</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Describe the design you want AI to generate from your wireframes.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. A modern landing page for a SaaS startup..."
                        className="bg-neutral-950 border-neutral-800 text-white min-h-[100px] resize-none focus:ring-indigo-500"
                    />
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 w-full sm:w-auto"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {isLoading ? "Generating..." : "Generate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
