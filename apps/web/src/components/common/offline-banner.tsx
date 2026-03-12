'use client'

import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        function handleOnline() { setIsOffline(false) }
        function handleOffline() { setIsOffline(true) }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Initial check
        if (!navigator.onLine) {
            setIsOffline(true)
        }

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (!isOffline) return null

    return (
        <div className="flex items-center justify-center w-full bg-[#F59E0B] px-4 py-2 text-sm font-medium text-black z-50">
            <WifiOff className="mr-2 h-4 w-4" />
            You are viewing cached data offline.
        </div>
    )
}
