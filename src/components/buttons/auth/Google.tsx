"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GoogleAuthButton() {
    const { signIn } = useAuthActions();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("google", { redirectTo: "/protected/dashboard" });
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full"
            onClick={handleSignIn}
            disabled={isLoading}
        >
            {isLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
    );
}
