'use client'

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Loading...</span>
                </div>
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
