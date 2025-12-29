"use client";

import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Layout, Palette } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    // Checks if we are in the workspace area
    const isWorkspace = pathname.includes("/workspace");

    return (
        <nav className="flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-6">
                {/* Project Name or Logo */}
                <Link href="/protected/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    S2C
                </Link>

                {isWorkspace && (
                    <div className="flex items-center gap-1">
                        <Button variant={pathname.includes("/canvas") ? "secondary" : "ghost"} size="sm" asChild>
                            <Link href="/workspace/canvas">
                                <Layout className="mr-2 h-4 w-4" />
                                Canvas
                            </Link>
                        </Button>
                        <Button variant={pathname.includes("/generate") ? "secondary" : "ghost"} size="sm" asChild>
                            <Link href="/workspace/generate">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                            </Link>
                        </Button>
                        <Button variant={pathname.includes("/style-guide") ? "secondary" : "ghost"} size="sm" asChild>
                            <Link href="/workspace/style-guide">
                                <Palette className="mr-2 h-4 w-4" />
                                Style
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* User Credits & Avatar */}
                <div className="hidden text-sm font-medium md:block">Credits: 10</div>
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
}
