export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <h2 className="text-xl font-semibold text-slate-200">Loading...</h2>
                <p className="text-sm text-slate-400">Please wait while we prepare your dashboard.</p>
            </div>
        </div>
    )
}
