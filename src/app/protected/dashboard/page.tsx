"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const hasEntitlement = useQuery(api.subscription.hasEntitlement);
    const router = useRouter();

    useEffect(() => {
        // If undefined, it's loading. If false, redirect.
        if (hasEntitlement === false) {
            router.push("/protected/billing");
        }
    }, [hasEntitlement, router]);

    if (hasEntitlement === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-4">Welcome to your dashboard.</p>
            {/* Project list will go here */}
        </div>
    );
}
