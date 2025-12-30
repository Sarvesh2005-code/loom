"use client";

import { use, useEffect, useState } from "react";
import CanvasBoard from "@/components/canvas/CanvasBoard";
import Toolbar from "@/components/canvas/toolbar";
import GenerateButton from "@/components/canvas/GenerateButton";
import CodePreview from "@/components/canvas/CodePreview";

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
            {/* The Infinite Canvas */}
            <CanvasBoard />

            {/* The Floating Toolbar */}
            <Toolbar />

            {/* Overlay UI (Project Title) */}
            <div className="absolute top-4 left-4 z-10">
                <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Project: {projectId}
                </h1>
            </div>

            {/* AI Generation Trigger */}
            <GenerateButton projectId={projectId} onCodeGenerated={handleCodeGenerated} />

            {/* Code Preview Modal */}
            <CodePreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                code={generatedCode}
            />
        </main>
    );
}
