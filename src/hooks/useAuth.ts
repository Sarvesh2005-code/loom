"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"), // Convex Auth with password? Usually separate provider.
    // The transcript implies Google OAuth mainly, but mentions "signin/signup" pages.
    // We'll stick to OAuth flow primarily or Magic Link if supported.
    // If user used "Password" provider, we'd need that.
    // Transcript specifically mentions "Google OAuth" and "Convex Auth". 
    // SignIn usually just sends magic link or strictly OAuth.
    // I'll keep it simple for now or just generic.
});

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function useAuth() {
    const { signIn, signOut } = useAuthActions();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Since we are primarily using Google OAuth as per the transcript details on "Google OAuth Setup",
    // we might not implement full email/password flow unless specified.
    // The transcript mentions "S2C Account" title, "or continue with" separator.
    // This implies Email/Password OR OAuth.
    // I will assume standard signIn("google") for now.

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { redirectTo: "/protected/dashboard" });
        } catch (error) {
            toast.error("Failed to sign in with Google");
            console.error(error);
            setIsLoading(false);
        }
    };

    return {
        signIn: handleGoogleSignIn, // exposing a generic signIn for Google for now
        signOut,
        isLoading
    }
}
