"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BillingPage() {
    const hasEntitlement = useQuery(api.subscription.hasEntitlement);
    const createSubscription = useMutation(api.subscription.createSubscription);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        // Simulate checkout delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            await createSubscription({ planCode: "pro_monthly" });
            toast.success("Welcome to Pro!", { description: "You now have access to all features." });
            router.push("/protected/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Upgrade failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (hasEntitlement === undefined) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    }

    if (hasEntitlement === true) {
        // Already subscribed, redirect
        router.push("/protected/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-white">
                    Upgrade to <span className="text-indigo-600">Loom Pro</span>
                </h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                    Unlock the full power of AI generation and unlimited projects.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Free Plan */}
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader>
                        <CardTitle>Free</CardTitle>
                        <CardDescription>Perfect for hobbyists.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 1 Project</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Basic Shapes</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Community Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="relative border-indigo-500 bg-white dark:bg-neutral-900 shadow-xl scale-105 z-10">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Pro <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                        </CardTitle>
                        <CardDescription>For serious designers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo (Demo)</span></div>
                        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-indigo-500" /> Unlimited Projects</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-indigo-500" /> AI Code Generation</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-indigo-500" /> Mood Board & Storage</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-indigo-500" /> Priority Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={handleUpgrade}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Upgrade Now"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
