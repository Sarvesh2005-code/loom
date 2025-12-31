"use client";

import { use, useEffect, useState } from "react";
import CanvasBoard from "@/components/canvas/CanvasBoard";
import Toolbar from "@/components/canvas/toolbar";
import GenerateButton from "@/components/canvas/GenerateButton";
import CodePreview from "@/components/canvas/CodePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodBoard from "@/components/style/mood-board";
import StyleGuide from "@/components/style/style-guide";
import { Id } from "../../../../../../convex/_generated/dataModel";

type Props = {
    params: Promise<{ projectId: string }>;
};

export default function SessionPage({ params }: Props) {
    // Unwrap params using React.use() for Next.js 15
    const { projectId } = use(params);
    const [generatedCode, setGeneratedCode] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleCodeGenerated = (code: string) => {
        setGeneratedCode(code);
        setIsPreviewOpen(true);
    };

    return (
        <main className="relative h-screen w-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
            <Tabs defaultValue="canvas" className="w-full h-full flex flex-col">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                    <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 bg-white/50 dark:bg-black/50 p-2 rounded backdrop-blur-sm">
                        Project: {projectId}
                    </h1>
                </div>

                <div className="absolute top-4 right-20 z-10">
                    <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-sm border">
                        <TabsTrigger value="canvas">Canvas</TabsTrigger>
                        <TabsTrigger value="moodboard">Mood Board</TabsTrigger>
                        <TabsTrigger value="styleguide">Style Guide</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="canvas" className="flex-1 relative w-full h-full m-0 p-0">
                    <CanvasBoard />
                    <Toolbar />
                    <GenerateButton projectId={projectId} onCodeGenerated={handleCodeGenerated} />
                </TabsContent>

                <TabsContent value="moodboard" className="flex-1 w-full h-full m-0 p-4 pt-20">
                    <div className="h-full bg-white dark:bg-neutral-900 rounded-lg shadow-sm border p-4 overflow-hidden">
                        <MoodBoard projectId={projectId as Id<"projects">} />
                    </div>
                </TabsContent>

                <TabsContent value="styleguide" className="flex-1 w-full h-full m-0 p-4 pt-20">
                    <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-sm border overflow-hidden mt-10">
                        <StyleGuide projectId={projectId as Id<"projects">} />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Code Preview Modal */}
            <CodePreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                code={generatedCode}
            />
        </main>
    );
}
