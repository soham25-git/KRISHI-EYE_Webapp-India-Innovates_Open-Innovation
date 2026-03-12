'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Play, Pause, Settings2, PlayCircle, MapIcon } from 'lucide-react'
import { TractorMarker } from '@/components/map/tractor-marker'
import { RouteTrail } from '@/components/map/route-trail'
import { HeatLegend } from '@/components/map/heat-legend'
import { ReplayControls } from '@/components/map/replay-controls'
import { mockRouteData } from '@/lib/mock-data/telemetry'

export default function MapPage() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)
    const [progressIndex, setProgressIndex] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            if (prefersReducedMotion) {
                setProgressIndex(mockRouteData.length - 1)
                setIsPlaying(false)
                return
            }

            interval = setInterval(() => {
                setProgressIndex((prev) => {
                    if (prev >= mockRouteData.length - 1) {
                        setIsPlaying(false)
                        return prev
                    }
                    return prev + 1
                })
            }, 1000 / speed)
        }
        return () => clearInterval(interval)
    }, [isPlaying, speed])

    const currentPoint = mockRouteData[progressIndex]

    let rotation = 0
    if (progressIndex < mockRouteData.length - 1 && currentPoint) {
        const next = mockRouteData[progressIndex + 1]
        rotation = Math.atan2(next.lng - currentPoint.lng, next.lat - currentPoint.lat) * (180 / Math.PI)
    }

    if (!currentPoint) return null

    return (
        <div className="relative h-[calc(100vh-72px)] md:h-screen w-full bg-[#111318] overflow-hidden">
            <HeatLegend />

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981] via-[#0F1115] to-[#0F1115]" />

            <div className="absolute inset-4 md:inset-12 border border-[#2A2D35]/50 bg-[#181A20]/30 rounded-3xl overflow-hidden backdrop-blur-sm shadow-inner">
                <RouteTrail points={mockRouteData} progressIndex={progressIndex} />
                <TractorMarker
                    lat={currentPoint.lat}
                    lng={currentPoint.lng}
                    rotation={rotation}
                />
            </div>

            <ReplayControls
                isPlaying={isPlaying}
                onTogglePlay={() => {
                    if (progressIndex >= mockRouteData.length - 1) {
                        setProgressIndex(0)
                    }
                    setIsPlaying(!isPlaying)
                }}
                onSpeedChange={setSpeed}
                speed={speed}
            />
            <div className="absolute top-4 left-4 z-10 bg-[#181A20] p-4 rounded-xl border border-[#2A2D35] shadow-lg">
                <h2 className="text-xl font-bold text-[#F1F3F5]">North Wheat Plot</h2>
                <p className="text-sm text-[#A0AAB5] flex items-center gap-2 mt-1">
                    <MapIcon className="h-4 w-4" />
                    12.5 Acres • Tracking Swaraj 855 boom-equipped with KRISHI-EYE
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-[#A0AAB5] border-t border-[#2A2D35] pt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                    Phase 1 Visualization (Simulated Replay)
                </div>
            </div>
        </div>
    )
}
