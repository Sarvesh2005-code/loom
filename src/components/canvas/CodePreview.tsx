import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
}

export default function CodePreview({ isOpen, onClose, code }: CodePreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col bg-[#1e1e1e] border-neutral-800 text-white gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-neutral-800 flex-shrink-0">
                    <div className="flex items-center justify-between mr-8">
                        <div>
                            <DialogTitle>Generated Design Code</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                                You can copy this code into your React project.
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className="gap-2 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy Code"}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative group">
                    <ScrollArea className="h-full w-full">
                        <pre className="p-4 text-sm font-mono leading-relaxed text-blue-100/90 whitespace-pre-wrap break-all">
                            {code || "// No code generated yet..."}
                        </pre>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
