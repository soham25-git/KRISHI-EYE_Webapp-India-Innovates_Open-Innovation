'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-8 text-center bg-[#0F1115] text-[#F1F3F5]">
            <div className="rounded-full bg-red-500/10 p-4">
                <svg
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-[#A0AAB5] max-w-sm">
                We encountered an error loading this page. Please try again.
            </p>
            <button
                onClick={() => reset()}
                className="mt-6 rounded-lg bg-[#10B981] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#059669] active:bg-[#047857]"
            >
                Try Again
            </button>
        </div>
    )
}
