
"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Zap, Sparkles, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function BillingPage() {
    const hasEntitlement = useQuery(api.subscription.hasEntitlement);
    const createSubscription = useMutation(api.subscription.createSubscription);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);

    const handleUpgrade = async (planId: string) => {
        setIsLoading(true);
        // Simulate checkout delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            await createSubscription({ planCode: planId });
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
        return <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-black"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    }

    useEffect(() => {
        if (hasEntitlement === true) {
            router.push("/protected/dashboard");
        }
    }, [hasEntitlement, router]);

    if (hasEntitlement === true) {
        return null;
    }

    const plans = [
        {
            name: "Starter",
            price: 0,
            description: "Perfect for hobbyists exploring AI design generation.",
            features: [
                "3 credits per month",
                "Basic design generation",
                "Standard export quality",
                // "Commercial license" // crossed out logic handled in render
            ],
            cta: "Current Plan",
            disabled: true,
            popular: false
        },
        {
            name: "Standard Plan",
            price: isAnnual ? 9.99 : 12,
            period: "/month",
            description: "Get 10 credits every month to power your AI-assisted workflow.",
            features: [
                "AI-Powered Design Gen",
                "Premium Asset Exports",
                "Advanced processing tools",
                "10 Monthly Credits"
            ],
            cta: "Subscribe",
            primary: true,
            popular: true,
            id: "pro_monthly"
        },
        {
            name: "Professional",
            price: isAnnual ? 29.99 : 35,
            period: "/month",
            description: "For serious creators and agencies needing high volume.",
            features: [
                "50 credits per month",
                "Priority processing queue",
                "Team collaboration features",
                "Dedicated support",
                "Commercial license included"
            ],
            cta: "Upgrade",
            disabled: false,
            popular: false,
            id: "pro_annual" // Mock ID
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white flex flex-col items-center py-20 px-4 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="w-12 h-12 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Unlock S2C Premium
                </h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400">
                    Transform your design workflow with AI-powered tools and unlimited creativity. Choose the plan that fits your needs.
                </p>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-neutral-900 dark:text-white" : "text-neutral-500")}>Monthly</span>
                    <Switch
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                        className="data-[state=checked]:bg-indigo-600"
                    />
                    <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-neutral-900 dark:text-white" : "text-neutral-500")}>
                        Annual <span className="text-emerald-500 text-xs font-bold ml-1">SAVE 20%</span>
                    </span>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl w-full">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "relative bg-white dark:bg-neutral-900 rounded-[2rem] p-8 border transition-all duration-300 flex flex-col",
                            plan.popular
                                ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105 z-10"
                                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-neutral-900 dark:text-white">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-neutral-500 text-sm">/month</span>
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {plan.description}
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            size="lg"
                            variant={plan.primary ? "default" : "outline"}
                            className={cn(
                                "w-full rounded-2xl h-12 font-medium",
                                plan.primary
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            )}
                            disabled={plan.disabled || isLoading}
                            onClick={() => plan.id && handleUpgrade(plan.id)}
                        >
                            {isLoading && plan.primary ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : plan.cta}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-16 flex items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Secure Payment
                </div>
                <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> 30-Day Guarantee
                </div>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> 24/7 Support
                </div>
            </div>
        </div>
    );
}
