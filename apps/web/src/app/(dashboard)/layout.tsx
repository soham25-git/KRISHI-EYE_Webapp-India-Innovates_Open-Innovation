'use client'

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0F1115]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <AppShell>
            {children}
        </AppShell>
    );
}
