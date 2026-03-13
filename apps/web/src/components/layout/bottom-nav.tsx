'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Tractor, ClipboardList, Tent, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/farms', label: 'Farms', icon: Tent },
    { href: '/tractors', label: 'Fleet', icon: Tractor },
    { href: '/jobs', label: 'Spraying', icon: ClipboardList },
    { href: '/ask', label: 'Ask', icon: MessageSquare },
]

export function BottomNav() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    const nextTheme = () => {
        const cycle: Record<string, 'dark' | 'light' | 'system'> = {
            dark: 'light',
            light: 'system',
            system: 'dark',
        }
        setTheme(cycle[theme] || 'dark')
    }

    const themeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around md:hidden theme-transition"
            style={{
                background: 'var(--surface)',
                borderTop: '1px solid var(--border)',
                height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 p-1.5 transition-colors cursor-pointer relative touch-target"
                        style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
                    >
                        {isActive && (
                            <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full" style={{ background: 'var(--primary)' }} />
                        )}
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                    </Link>
                )
            })}
            {/* Theme toggle — accessible on mobile */}
            <button
                onClick={nextTheme}
                className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 p-1.5 transition-colors cursor-pointer touch-target"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label={`Current theme: ${theme}. Tap to switch.`}
            >
                {(() => { const ThemeIcon = themeIcon; return <ThemeIcon className="h-5 w-5" /> })()}
                <span className="text-[10px] font-medium leading-tight">Theme</span>
            </button>
        </nav>
    )
}
