"use client";

import { use, useEffect, useState } from "react";
import CanvasBoard from "@/components/canvas/CanvasBoard";
import Toolbar from "@/components/canvas/toolbar";
import GenerateButton from "@/components/canvas/GenerateButton";
import CodePreview from "@/components/canvas/CodePreview";
import StyleGuideView from "@/components/style/StyleGuideView";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, User, Zap, LayoutGrid, Palette as PaletteIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ZoomControls from "@/components/canvas/ZoomControls";
import InspirationPanel from "@/components/canvas/InspirationPanel";
import HistoryControls from "@/components/canvas/HistoryControls";
import { useCanvasSync } from "@/hooks/useCanvasSync";
import { useCanvasHydration } from "@/hooks/useCanvasHydration";
import PropertiesPanel from "@/components/canvas/PropertiesPanel";

type Props = {
    params: Promise<{ projectId: string }>;
};

export default function SessionPage({ params }: Props) {
    const { projectId } = use(params);
    const router = useRouter();

    const { isLoading, project } = useCanvasHydration(projectId as Id<"projects">);
    const saveStatus = useCanvasSync(projectId as Id<"projects">, !isLoading);

    const [activeView, setActiveView] = useState<"canvas" | "style-guide">("canvas");
    const [generatedCode, setGeneratedCode] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    if (isLoading) {
        return <div className="h-screen w-full bg-black flex items-center justify-center text-neutral-500">Loading project...</div>;
    }

    const handleCodeGenerated = (code: string) => {
        setGeneratedCode(code);
        setIsPreviewOpen(true);
    };

    return (
        <main className="relative h-screen w-full bg-black overflow-hidden flex flex-col font-sans text-foreground">
            {/* Shared Header with Pill Toggle */}
            <header className="h-14 px-4 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white rounded-full w-8 h-8" onClick={() => router.push("/protected/dashboard")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span>Project</span>
                        <span>/</span>
                        <span className="text-white font-medium">{project?.name || "Untitled Project"}</span>
                        <span className="text-neutral-600 mx-2">|</span>
                        <span className="text-xs text-neutral-500">
                            {saveStatus === "saving" && "Saving..."}
                            {saveStatus === "saved" && "Saved"}
                            {saveStatus === "unsaved" && "Unsaved changes"}
                        </span>
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-neutral-900/80 p-1 rounded-full border border-white/5">
                        <ToggleGroup type="single" value={activeView} onValueChange={(v) => v && setActiveView(v as any)}>
                            <ToggleGroupItem value="canvas" className="rounded-full px-4 py-1.5 h-8 text-xs font-medium data-[state=on]:bg-neutral-800 data-[state=on]:text-white text-neutral-400 hover:text-neutral-200 transition-all">
                                <LayoutGrid className="w-3 h-3 mr-2" /> Canvas
                            </ToggleGroupItem>
                            <ToggleGroupItem value="style-guide" className="rounded-full px-4 py-1.5 h-8 text-xs font-medium data-[state=on]:bg-neutral-800 data-[state=on]:text-white text-neutral-400 hover:text-neutral-200 transition-all">
                                <PaletteIcon className="w-3 h-3 mr-2" /> Style Guide
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-neutral-300">0 credits</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-neutral-400 hover:text-white">
                        <HelpCircle className="w-4 h-4" />
                    </Button>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-black">
                        S
                    </div>
                </div>
            </header>


            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden">
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeView === "canvas" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                    <CanvasBoard projectId={projectId as Id<"projects">} />
                    <Toolbar />
                    <ZoomControls />
                    <HistoryControls />
                    <InspirationPanel projectId={projectId as Id<"projects">} />
                    <GenerateButton projectId={projectId} onCodeGenerated={handleCodeGenerated} />
                    <PropertiesPanel />
                </div>

                <div className={`absolute inset-0 transition-opacity duration-300 bg-black ${activeView === "style-guide" ? "opacity-100 z-20 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}>
                    {activeView === "style-guide" && <StyleGuideView projectId={projectId as Id<"projects">} />}
                </div>
            </div>

            {/* Code Preview Modal */}
            <CodePreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                code={generatedCode}
                projectId={projectId}
            />
        </main>
    );
}
