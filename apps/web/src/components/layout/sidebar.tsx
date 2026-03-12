'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map as MapIcon, BarChart3, HelpCircle, MessageSquare, Tractor, ClipboardList, Tent, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Tent, label: 'My Farms', href: '/farms' },
    { href: '/tractors', label: 'Boom Sprayer Fleet', icon: Tractor },
    { href: '/jobs', label: 'Spraying Operations', icon: ClipboardList },
    { href: '/map', label: 'Field Map', icon: MapIcon },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/ask', label: 'Ask AI', icon: MessageSquare },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
]

export function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <aside className="hidden h-full w-64 flex-col border-r border-[#2A2D35] bg-[#181A20] md:flex">
            <div className="flex h-16 items-center px-6 border-b border-[#2A2D35]">
                <h1 className="text-xl font-bold tracking-tight text-[#10B981]">KRISHI-EYE</h1>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${isActive
                                ? 'bg-[#10B981]/10 text-[#10B981] font-medium'
                                : 'text-[#A0AAB5] hover:bg-[#2A2D35] hover:text-[#F1F3F5]'
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-[#2A2D35]">
                <div className="flex items-center gap-3 rounded-xl bg-[#22252C] p-3">
                    <div className="h-8 w-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                        <p className="truncate text-xs font-bold text-[#F1F3F5]">{user?.phone || 'Farmer Account'}</p>
                        <button
                            onClick={logout}
                            className="text-[10px] text-[#10B981] hover:underline block"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
