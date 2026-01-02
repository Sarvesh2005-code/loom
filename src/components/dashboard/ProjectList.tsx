"use client";

import { Id } from "../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, FolderOpen, Grid, List as ListIcon, MoreHorizontal, Plus, Search, Trash2, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface Project {
    _id: Id<"projects">;
    _creationTime: number;
    name: string;
    description?: string;
    moodBoardImages?: string[];
}

interface ProjectListProps {
    projects: Project[];
    onCreateNew: () => void;
}

export default function ProjectList({ projects, onCreateNew }: ProjectListProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-10 bg-black/50 backdrop-blur-xl p-4 -mx-4 rounded-xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-9 bg-neutral-900/50 border-white/10 text-white placeholder:text-neutral-500 focus:ring-indigo-500/50 rounded-lg h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)} className="bg-neutral-900/50 border border-white/10 p-1 rounded-lg">
                        <ToggleGroupItem value="grid" className="h-8 w-8 p-0 hover:bg-white/10 data-[state=on]:bg-white/20 data-[state=on]:text-white text-neutral-400">
                            <Grid className="w-4 h-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list" className="h-8 w-8 p-0 hover:bg-white/10 data-[state=on]:bg-white/20 data-[state=on]:text-white text-neutral-400">
                            <ListIcon className="w-4 h-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Button onClick={onCreateNew} className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-10 px-4">
                        <Plus className="w-4 h-4 mr-2" /> New Project
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/5">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                        <FolderOpen className="w-8 h-8 text-neutral-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                    <p className="text-neutral-500 max-w-sm mb-8">
                        {searchQuery ? "Try adjusting your search terms." : "Create your first project to get started."}
                    </p>
                    <Button onClick={onCreateNew} variant="outline" className="border-white/10 text-white hover:bg-white/10">
                        Create Project
                    </Button>
                </div>
            ) : (
                <>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Create Card */}
                            <button
                                onClick={onCreateNew}
                                className="group relative aspect-[4/3] rounded-3xl border border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-4 text-neutral-500 hover:text-white"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-medium">Create New</span>
                            </button>

                            {filteredProjects.map((project) => (
                                <ProjectGridCard key={project._id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                            <table className="w-full text-left text-sm text-neutral-400">
                                <thead className="bg-white/5 text-neutral-300 font-medium">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Name</th>
                                        <th className="px-6 py-3 font-medium">Created</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProjects.map((project) => (
                                        <ProjectListRow key={project._id} project={project} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function ProjectGridCard({ project }: { project: Project }) {
    // Generate a deterministic gradient based on ID
    const gradient = `linear-gradient(135deg, ${stringToColor(project._id, 10)} 0%, ${stringToColor(project._id, 50)} 100%)`;

    return (
        <Link href={`/protected/dashboard/session/${project._id}`} className="group relative aspect-[4/3] rounded-3xl bg-neutral-900 border border-white/10 overflow-hidden hover:border-white/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 block">
            {/* Thumbnail Preview (Using gradient or moodboard image) */}
            <div className="absolute inset-0 h-2/3 bg-neutral-800" style={{ background: project.moodBoardImages?.[0] ? `url(${project.moodBoardImages[0]}) center/cover` : gradient }}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 w-full h-1/3 bg-neutral-900/95 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-medium truncate max-w-[150px]">{project.name}</h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {formatDistanceToNow(project._creationTime, { addSuffix: true })}
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white rounded-full hover:bg-white/10 h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </Link>
    )
}

function ProjectListRow({ project }: { project: Project }) {
    return (
        <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-3">
                <Link href={`/protected/dashboard/session/${project._id}`} className="flex items-center gap-3 text-white font-medium group-hover:text-indigo-400 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-neutral-400" />
                    </div>
                    {project.name}
                </Link>
            </td>
            <td className="px-6 py-3 text-neutral-500">
                {formatDistanceToNow(project._creationTime, { addSuffix: true })}
            </td>
            <td className="px-6 py-3 text-right">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white rounded-full hover:bg-white/10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </td>
        </tr>
    )
}

// Helper to generate pastel colors from string
function stringToColor(str: string, lightness: number) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, ${lightness}%)`;
}
