import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 p-8 text-center bg-[#0F1115] text-[#F1F3F5]">
            <div className="rounded-full bg-[#22252C] p-4 text-[#A0AAB5]">
                <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-[#A0AAB5] max-w-sm">
                We couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            <Link
                href="/dashboard"
                className="mt-6 rounded-lg bg-[#181A20] border border-[#2A2D35] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#2A2D35]"
            >
                Return to Dashboard
            </Link>
        </div>
    )
}
