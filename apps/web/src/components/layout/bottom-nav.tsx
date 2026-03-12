'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map as MapIcon, MessageSquare, Tractor, ClipboardList, Tent } from 'lucide-react'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/farms', label: 'Farms', icon: Tent },
    { href: '/tractors', label: 'Fleet', icon: Tractor },
    { href: '/jobs', label: 'Spraying', icon: ClipboardList },
    { href: '/ask', label: 'Ask', icon: MessageSquare },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-[#2A2D35] bg-[#181A20] md:hidden pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1 p-2 transition-colors ${isActive ? 'text-[#10B981]' : 'text-[#A0AAB5] hover:text-[#F1F3F5]'
                            }`}
                    >
                        <Icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
