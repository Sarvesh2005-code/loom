"use client";

import { Id } from "../../../convex/_generated/dataModel";
import MoodBoard from "@/components/style/mood-board";
import StyleGuide from "@/components/style/style-guide";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers, Palette, Type } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StyleGuideViewProps {
    projectId: Id<"projects">;
}

export default function StyleGuideView({ projectId }: StyleGuideViewProps) {
    return (
        <div className="w-full h-full bg-black text-white p-6">
            <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Style Guide</h1>
                    <p className="text-neutral-400">Define the visual language for your project. The AI will use these settings during generation.</p>
                </div>

                <div className="flex-1 min-h-0 bg-neutral-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <Tabs defaultValue="moodboard" className="w-full h-full flex flex-col">
                        <div className="border-b border-white/5 px-6 py-4 bg-neutral-900/50">
                            <TabsList className="bg-neutral-800 text-neutral-400">
                                <TabsTrigger value="moodboard" className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white">
                                    <Layers className="w-4 h-4 mr-2" /> Mood Board
                                </TabsTrigger>
                                <TabsTrigger value="design-system" className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white">
                                    <Palette className="w-4 h-4 mr-2" /> Design System
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1">
                            <TabsContent value="moodboard" className="p-6 m-0 h-full">
                                <MoodBoard projectId={projectId} />
                            </TabsContent>
                            <TabsContent value="design-system" className="p-6 m-0">
                                <div className="max-w-3xl">
                                    <StyleGuide projectId={projectId} />
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
