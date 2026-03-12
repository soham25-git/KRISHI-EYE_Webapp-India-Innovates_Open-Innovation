'use client'

import { MapPin } from 'lucide-react'

interface TractorMarkerProps {
    lat: number
    lng: number
    rotation?: number
}

export function TractorMarker({ lat, lng, rotation = 0 }: TractorMarkerProps) {
    return (
        <div
            className="absolute z-10 flex h-8 w-8 transform items-center justify-center rounded-full bg-[#181A20] shadow-[0_0_15px_rgba(252,211,77,0.5)] border-2 border-[#FCD34D] transition-all duration-300 ease-linear motion-reduce:transition-none"
            style={{
                top: `${lat}%`,
                left: `${lng}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`
            }}
        >
            <MapPin className="h-4 w-4 text-[#FCD34D]" />
        </div>
    )
}
