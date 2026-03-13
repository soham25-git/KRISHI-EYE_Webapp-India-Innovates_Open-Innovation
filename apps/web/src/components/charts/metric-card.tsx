import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

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
        <div className="flex flex-col rounded-xl p-5 transition-all cursor-default group" style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{title}</h4>
                {icon && (
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-alt)' }}>
                        {icon}
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{value}</div>
            {trend && (
                <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
                    {trend.positive ? (
                        <TrendingUp className="h-3.5 w-3.5" style={{ color: 'var(--success)' }} />
                    ) : (
                        <TrendingDown className="h-3.5 w-3.5" style={{ color: 'var(--danger)' }} />
                    )}
                    <span style={{ color: trend.positive ? 'var(--success)' : 'var(--danger)' }}>
                        {trend.positive ? '+' : ''}{trend.value}%
                    </span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{trend.label}</span>
                </div>
            )}
        </div>
    )
}
