"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

export default function GeneratePage() {
    const [prompt, setPrompt] = useState("");
    const [generatedUI, setGeneratedUI] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateUI = useAction(api.ai.generateUI);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const result = await generateUI({ prompt });
            setGeneratedUI(result);
        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    AI Generator
                </h1>
            </div>

            <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Input Region */}
                <div className="flex flex-col gap-4">
                    <Card className="flex-1 p-4">
                        <h2 className="mb-4 text-lg font-medium">Describe your UI</h2>
                        <Textarea
                            placeholder="e.g., A clean signup card with email, password fields, and a gradient submit button..."
                            className="min-h-[200px] resize-none text-base"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Design"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Preview Region */}
                <Card className="flex flex-col overflow-hidden bg-muted/30 p-4">
                    <h2 className="mb-4 text-lg font-medium">Preview</h2>
                    <div className="flex flex-1 items-center justify-center rounded-lg border bg-background/50 p-8 shadow-inner">
                        {generatedUI ? (
                            <PreviewRenderer data={generatedUI} />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <Sparkles className="mx-auto mb-2 h-8 w-8 opacity-20" />
                                <p>Generated UI will appear here</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Simple recursive renderer for our mock JSON structure
function PreviewRenderer({ data }: { data: any }) {
    if (!data) return null;

    if (data.elements) {
        return (
            <div className="w-full">
                {data.elements.map((el: any, i: number) => (
                    <RenderElement key={i} element={el} />
                ))}
            </div>
        );
    }
    return null;
}

function RenderElement({ element }: { element: any }) {
    if (!element) return null;

    // Basic mapping of types to HTML tags
    const Tag = element.type as keyof JSX.IntrinsicElements;

    // Safety check - only allow safe tags if needed, or just let it pass for now
    if (!Tag) return null;

    // Handle children: either string content or nested arrays
    let children = element.content;
    if (element.children && Array.isArray(element.children)) {
        children = element.children.map((child: any, i: number) => (
            <RenderElement key={i} element={child} />
        ));
    }

    // Special handling for img self-closing
    if (Tag === 'img') {
        return <Tag className={element.className} src={element.src} alt={element.alt} />;
    }

    return (
        <Tag className={element.className}>
            {children}
        </Tag>
    );
}
