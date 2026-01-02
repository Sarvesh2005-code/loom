"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Sparkles, FolderOpen, CreditCard, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProjectList from "@/components/dashboard/ProjectList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function DashboardPage() {
    const hasEntitlement = useQuery(api.subscription.hasEntitlement);
    const projects = useQuery(api.projects.listProjects);
    const createProject = useMutation(api.projects.createProject);
    const user = useQuery(api.users.getCurrentUser);
    const router = useRouter();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;
        setIsCreating(true);
        try {
            const projectId = await createProject({ name: newProjectName });
            toast.success("Project created!");
            setNewProjectName("");
            setIsCreateOpen(false);
            router.push(`/protected/dashboard/session/${projectId}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create project");
        } finally {
            setIsCreating(false);
        }
    };

    if (hasEntitlement === undefined || projects === undefined) {
        return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>;
    }

    return (
        <div className="min-h-screen bg-black text-foreground antialiased selection:bg-indigo-500/30">
            {/* Top Bar matching Loop Design */}
            <header className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex h-16 items-center justify-between px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold">
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-6 mr-4">
                            <Link href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">0 credits</Link>
                            <Link href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"><HelpCircle className="w-5 h-5" /></Link>
                        </div>

                        <Link href="/protected/billing">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-300 to-rose-300 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                                <CreditCard className="w-4 h-4 text-white/90" />
                            </div>
                        </Link>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-full bg-white text-black hover:bg-neutral-200 font-medium px-6 h-9 transition-colors">
                                    <Plus className="w-4 h-4 mr-1" /> New Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Start a masterpiece</DialogTitle>
                                    <DialogDescription className="text-neutral-400">
                                        Enter a name for your new design project.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-neutral-300">Project Name</Label>
                                        <Input
                                            id="name"
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            placeholder="e.g. Portfolio V2"
                                            className="bg-neutral-800 border-neutral-700 text-white focus:ring-indigo-500/50"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-neutral-400 hover:text-white hover:bg-white/5">Cancel</Button>
                                    <Button onClick={handleCreateProject} disabled={isCreating} className="bg-white text-black hover:bg-neutral-200 rounded-full px-6">
                                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Project"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-[1600px] mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
                    <p className="text-neutral-500">Manage your design projects and continue where you left off.</p>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/5 mx-auto animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 shadow-inner border border-white/5">
                            <FolderOpen className="w-8 h-8 text-neutral-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">It's quiet here</h3>
                        <p className="text-neutral-500 max-w-sm mb-8">
                            Create your first project to start designing layout concepts with generic styles.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)} className="rounded-full bg-white text-black hover:bg-neutral-200 h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all">
                            Create First Project
                        </Button>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <ProjectList
                            projects={projects}
                            onCreateNew={() => setIsCreateOpen(true)}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
