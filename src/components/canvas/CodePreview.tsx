"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, Send, Sparkles, X, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface CodePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    projectId: string;
}

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function CodePreview({ isOpen, onClose, code: initialCode, projectId }: CodePreviewProps) {
    const [code, setCode] = useState(initialCode);
    const [copied, setCopied] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isRefining, setIsRefining] = useState(false);

    const refineCode = useAction(api.ai.refineCode);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Update code when initialCode changes (if opening fresh)
    useEffect(() => {
        setCode(initialCode);
        setMessages([]); // Reset chat on new generation? Or keep history? Reset for now.
    }, [initialCode, isOpen]);

    // Scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefine = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsRefining(true);

        try {
            const result = await refineCode({
                projectId: projectId as Id<"projects">,
                sourceCode: code,
                prompt: userMsg
            });

            if (result.code) {
                setCode(result.code);
                setMessages(prev => [...prev, { role: "ai", content: "I've updated the code based on your request." }]);
                toast.success("Code Updated!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to refine code");
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I couldn't update the code. Please try again." }]);
        } finally {
            setIsRefining(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col bg-[#0d0d0d] border-neutral-800 text-white gap-0 p-0 overflow-hidden sm:rounded-xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-sm font-medium text-neutral-300">Generated Component</DialogTitle>
                        <span className="text-neutral-600">/</span>
                        <span className="text-xs text-neutral-500 font-mono">React + Tailwind</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const blob = new Blob([code], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "GeneratedComponent.tsx";
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                            className="h-8 gap-2 text-neutral-400 hover:text-white hover:bg-white/10"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleCopy}
                            className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy Code"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 text-neutral-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Content: Split View */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Left: Code Editor (Read Only) */}
                    <div className="flex-1 overflow-hidden relative border-r border-neutral-800 bg-[#1e1e1e]">
                        <ScrollArea className="h-full w-full">
                            <SyntaxHighlighter
                                language="tsx"
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: 'transparent',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                }}
                                showLineNumbers={true}
                                wrapLines={true}
                            >
                                {code || "// No code generated yet..."}
                            </SyntaxHighlighter>
                        </ScrollArea>
                    </div>

                    {/* Right: Stitch Chat Interface */}
                    <div className="w-[350px] flex flex-col bg-neutral-900 border-l border-neutral-800">
                        <div className="p-3 border-b border-neutral-800 bg-neutral-900 z-10 shadow-sm">
                            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                Stitch AI
                            </h3>
                        </div>

                        {/* Chat History */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center mt-10 opacity-50">
                                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-500/50" />
                                    <p className="text-sm text-neutral-400">Ask me to refine the code.</p>
                                    <p className="text-xs text-neutral-600 mt-1">"Make background dark"<br />"Add a hero button"</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-neutral-800 text-neutral-300'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isRefining && (
                                <div className="flex justify-start">
                                    <div className="bg-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-400 flex items-center gap-2">
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        Refining...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-neutral-800 bg-neutral-900">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleRefine(); }}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Make it darker..."
                                    className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-indigo-600"
                                    disabled={isRefining}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isRefining}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
