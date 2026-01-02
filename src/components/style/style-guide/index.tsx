"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Palette, Sparkles, Plus, Type } from "lucide-react";

interface StyleGuideProps {
    projectId: Id<"projects">;
}

export default function StyleGuide({ projectId }: StyleGuideProps) {
    const project = useQuery(api.projects.getProject, { projectId });
    const updateProject = useMutation(api.projects.updateProject);

    // Navigation State
    const [activeTab, setActiveTab] = useState<"colors" | "typography">("colors");

    // Data State
    const [primaryColor, setPrimaryColor] = useState("#4f46e5");
    const [fontFamily, setFontFamily] = useState("Inter");
    const [isSaving, setIsSaving] = useState(false);

    // Sync from project DB
    useEffect(() => {
        if (project?.styleGuide) {
            if (project.styleGuide.primaryColor) setPrimaryColor(project.styleGuide.primaryColor);
            if (project.styleGuide.fontFamily) setFontFamily(project.styleGuide.fontFamily);
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Internal Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full border border-neutral-200 dark:border-white/10 flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("colors")}
                        className={`rounded-full px-6 transition-all ${activeTab === "colors" ? "bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                    >
                        <Palette className="w-4 h-4 mr-2" /> Colors
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("typography")}
                        className={`rounded-full px-6 transition-all ${activeTab === "typography" ? "bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
                    >
                        <Type className="w-4 h-4 mr-2" /> Typography
                    </Button>
                </div>
            </div>

            {/* Typography Section */}
            {activeTab === "typography" && (
                <div className="space-y-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Typography Scale</h2>
                            <p className="text-sm text-neutral-500">Global font settings and hierarchy.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Font Family Selection */}
                        <div className="p-8 rounded-[2rem] bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Primary Font</span>
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">Google Font</span>
                            </div>
                            <h1 className="text-5xl font-bold mb-2">{fontFamily}</h1>
                            <p className="text-neutral-500 mb-8">Sans Serif</p>

                            <div className="text-2xl tracking-widest leading-loose text-neutral-400 font-mono break-all opacity-50 select-none">
                                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                abcdefghijklmnopqrstuvwxyz
                                1234567890
                            </div>

                            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/10">
                                <Label className="text-xs text-neutral-500 mb-2 block">Change Font</Label>
                                <Input
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                    placeholder="e.g. Inter, Roboto, Outfit"
                                    className="bg-white dark:bg-black border-neutral-200 dark:border-white/10"
                                />
                            </div>
                        </div>

                        {/* Scale Preview */}
                        <div className="space-y-8 py-4">
                            {["Headline 1", "Headline 2", "Headline 3"].map((hl, i) => (
                                <div key={hl} className="flex gap-4 items-baseline border-b border-neutral-100 dark:border-white/5 pb-6">
                                    <span className="text-xs font-mono text-neutral-500 w-8">H{i + 1}</span>
                                    <div>
                                        <div style={{ fontFamily }} className={`font-bold ${i === 0 ? "text-5xl" : i === 1 ? "text-4xl" : "text-3xl"}`}>
                                            {hl}
                                        </div>
                                        <div className="text-xs text-neutral-500 mt-1">{fontFamily} Bold • {i === 0 ? "48px" : i === 1 ? "36px" : "30px"}</div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-4 items-baseline">
                                <span className="text-xs font-mono text-neutral-500 w-8">Body</span>
                                <div>
                                    <div style={{ fontFamily }} className="text-base leading-relaxed text-neutral-300">
                                        The quick brown fox jumps over the lazy dog. A sophisticated visual language enables clear communication.
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1">{fontFamily} Regular • 16px</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Colors Section */}
            {activeTab === "colors" && (
                <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-6">
                        <Palette className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Color Palette</h2>
                    <p className="text-neutral-500 max-w-md mb-8">
                        Generate a palette from your mood board or define custom colors.
                    </p>

                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <div className="relative flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden group">
                            <div className="flex items-center gap-3 relative z-10 pointer-events-none">
                                <div
                                    className="w-12 h-12 rounded-full shadow-inner border border-black/5"
                                    style={{ backgroundColor: primaryColor }}
                                />
                                <div className="text-left">
                                    <div className="text-sm font-medium">Primary Color</div>
                                    <div className="text-xs text-neutral-500 font-mono uppercase">{primaryColor}</div>
                                </div>
                            </div>

                            {/* Color Input covering the card for easy interaction */}
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />

                            <Button variant="ghost" size="sm" className="pointer-events-none z-10 text-neutral-400 group-hover:text-black dark:group-hover:text-white">
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-8 right-8 z-50">
                <Button onClick={handleSave} disabled={isSaving} className="rounded-full h-12 px-6 bg-white text-black hover:bg-neutral-200 font-medium shadow-xl gap-2 transition-all hover:scale-105 active:scale-95">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
