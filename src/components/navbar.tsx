"use client";

import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../convex/_generated/api"; // Relative path to convex folder
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    // Logic to fetch project details if in a project route
    // Transcript: "Fetches project details using api.projects.getProject query... Uses usePathname..."
    const pathname = usePathname();
    // extracting projectId from pathname if possible, usually /dashboard/projectId
    // For now, simple structure.

    return (
        <nav className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-4">
                {/* Project Name or Logo */}
                <h1 className="text-xl font-bold">S2C</h1>
            </div>
            <div className="flex items-center gap-4">
                {/* Tabs: Canvas, Style Guide (Visible if in project) */}
            </div>
            <div className="flex items-center gap-4">
                {/* User Credits & Avatar */}
                <div className="text-sm font-medium">Credits: 10</div>
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
}
