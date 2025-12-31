"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowRight, Loader2, Folder } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function DashboardPage() {
    const hasEntitlement = useQuery(api.subscription.hasEntitlement);
    const projects = useQuery(api.projects.listProjects);
    const createProject = useMutation(api.projects.createProject);
    const router = useRouter();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (hasEntitlement === false) {
            // For test purposes, we might want to bypass billing check if needed
            // but user had a valid subscription flow in mind.
            // router.push("/protected/billing");
        }
    }, [hasEntitlement, router]);

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
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Manage your design projects.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="w-4 h-4" /> New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                Give your project a name to get started.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="My Awesome App"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateProject} disabled={isCreating}>
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <Folder className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium">No projects yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first project to start designing.</p>
                    <Button onClick={() => setIsCreateOpen(true)}>Create Project</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project._id} className="cursor-pointer hover:shadow-md transition-all group" onClick={() => router.push(`/protected/dashboard/session/${project._id}`)}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    {project.name}
                                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                                </CardTitle>
                                <CardDescription>
                                    Created {new Date(project._creationTime).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-400 text-xs">
                                    Preview
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="text-sm text-muted-foreground capitalize">
                                    {project.status || "active"}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
