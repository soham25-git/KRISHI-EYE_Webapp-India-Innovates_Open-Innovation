import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
}

export function ErrorState({ title = 'Error', message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex w-full flex-col items-center justify-center rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 p-6 text-center">
            <AlertTriangle className="mb-3 h-8 w-8 text-[#EF4444]" />
            <h3 className="mb-2 text-lg font-semibold text-[#F1F3F5]">{title}</h3>
            <p className="mb-6 text-sm text-[#A0AAB5]">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="rounded-lg bg-[#2A2D35] px-4 py-2 text-sm font-medium text-[#F1F3F5] transition-colors hover:bg-[#A0AAB5]/20"
                >
                    Try Again
                </button>
            )}
        </div>
    )
}
