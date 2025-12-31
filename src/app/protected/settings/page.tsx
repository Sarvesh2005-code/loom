"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUploadFiles } from "@/hooks/useUploadFiles";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader2, Upload } from "lucide-react";

export default function SettingsPage() {
    const user = useQuery(api.users.getCurrentUser);
    const updateUser = useMutation(api.users.updateUser);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setImage(user.image || "");
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser({ name, image });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        toast.loading("Uploading avatar...");

        try {
            const uploaded = await startUpload([file]);
            const storageId = uploaded[0].response as Id<"_storage">;
            const url = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;

            setImage(url);
            toast.dismiss();
            toast.success("Avatar uploaded");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to upload avatar");
        }
    };

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="container mx-auto max-w-2xl py-20 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">Profile Settings</h1>

            <div className="space-y-8 bg-white dark:bg-neutral-900/50 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none backdrop-blur-sm">
                <div className="flex items-center gap-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="relative group">
                        <Avatar className="w-24 h-24 border-4 border-white dark:border-neutral-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105" onClick={() => fileInputRef.current?.click()}>
                            <AvatarImage src={image} className="object-cover" />
                            <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600 font-bold">{name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-lg font-semibold block">Profile Picture</Label>
                        <p className="text-sm text-muted-foreground">Click to upload a new avatar. JPG, PNG or GIF.</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                            Upload New
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">Display Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="h-12 rounded-xl bg-neutral-50 dark:bg-black/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-medium">Email Address</Label>
                    <Input
                        value={user.email || ""}
                        disabled
                        className="h-12 rounded-xl bg-muted/50 text-muted-foreground border-transparent"
                    />
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto h-12 px-8 rounded-full text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
