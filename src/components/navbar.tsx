"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Layout, Palette } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const user = useQuery(api.users.getCurrentUser);

    // Checks if we are in the workspace area
    const isWorkspace = pathname.includes("/workspace");

    return (
        <nav className="flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-6">
                {/* Project Name or Logo */}
                <Link href="/protected/dashboard" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <span className="font-bold text-lg">L</span>
                    </div>
                    S2C
                </Link>

                {/* We removed the workspace links for now as they are integrated into Session Page */}
            </div>

            <div className="flex items-center gap-4">
                {/* User Credits & Avatar */}
                <div className="hidden text-sm font-medium md:block">Credits: 10</div>
                <Link href="/protected/settings">
                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </nav>
    );
}
