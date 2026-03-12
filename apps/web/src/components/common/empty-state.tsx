import { ReactNode } from 'react'

interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-8 text-center bg-[#181A20] rounded-xl border border-[#2A2D35]">
            {icon && (
                <div className="mb-6 rounded-full bg-[#22252C] p-4 text-[#A0AAB5]">
                    {icon}
                </div>
            )}
            <h3 className="mb-2 text-xl font-semibold text-[#F1F3F5]">{title}</h3>
            {description && (
                <p className="mb-6 max-w-sm text-[#A0AAB5]">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    )
}
