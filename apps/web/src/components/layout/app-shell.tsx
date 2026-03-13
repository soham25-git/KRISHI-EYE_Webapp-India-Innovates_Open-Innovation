'use client'

import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { OfflineBanner } from '../common/offline-banner'

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh w-full theme-transition" style={{ background: 'var(--background)' }}>
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative">
                <OfflineBanner />
                <main className="flex-1 overflow-y-auto scroll-smooth-touch" style={{
                    paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))'
                }}>
                    <div className="md:!pb-0">
                        {children}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    )
}
