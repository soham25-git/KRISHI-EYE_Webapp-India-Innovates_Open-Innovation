import { ReactNode } from 'react'

interface MetricCardProps {
    title: string
    value: string | number
    icon?: ReactNode
    trend?: {
        value: number
        label: string
        positive: boolean
    }
}

export function MetricCard({ title, value, icon, trend }: MetricCardProps) {
    return (
        <div className="flex flex-col rounded-xl border border-[#2A2D35] bg-[#181A20] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#A0AAB5]">{title}</h4>
                {icon && <div className="text-[#6B7280]">{icon}</div>}
            </div>
            <div className="text-2xl font-bold text-[#F1F3F5] mb-2">{value}</div>
            {trend && (
                <div className="flex items-center gap-2 text-xs font-medium">
                    <span className={trend.positive ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                        {trend.positive ? '+' : ''}{trend.value}%
                    </span>
                    <span className="text-[#6B7280]">{trend.label}</span>
                </div>
            )}
        </div>
    )
}
