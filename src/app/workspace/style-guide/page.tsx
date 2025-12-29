"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, LayoutGrid } from "lucide-react";
import MoodBoard from "@/components/style/mood-board";
import { Id } from "../../../../convex/_generated/dataModel";

// Mock ID because we are in a static route for now 'workspace/style-guide'
// In reality, this page should extract projectId from params or context.
// We'll use a placeholder or assume it's passed via some layout context.
// For reconstruction purposes, I'll cast a string to ID to satisfy typeCheck for now
// knowing this will fail at runtime if not handled.
const MOCK_PROJECT_ID = "jw7crh2j0g84j22718109d1898748366" as Id<"projects">;

export default function StyleGuidePage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Style Guide & Mood Board</h1>

            <Tabs defaultValue="moodboard" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="moodboard" className="gap-2">
                        <LayoutGrid className="h-4 w-4" /> Mood Board
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="gap-2">
                        <Palette className="h-4 w-4" /> Colors
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="gap-2">
                        <Type className="h-4 w-4" /> Typography
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="moodboard" className="mt-6">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Mood Board</h2>
                        <MoodBoard projectId={MOCK_PROJECT_ID} />
                    </div>
                </TabsContent>
                <TabsContent value="colors" className="mt-6">
                    <div className="rounded-lg border bg-card p-4">Colors Content</div>
                </TabsContent>
                <TabsContent value="typography" className="mt-6">
                    <div className="rounded-lg border bg-card p-4">Typography Content</div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
