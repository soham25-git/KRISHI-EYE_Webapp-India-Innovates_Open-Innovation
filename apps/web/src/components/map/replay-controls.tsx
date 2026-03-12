'use client'

import { Play, Pause, FastForward, Rewind } from 'lucide-react'

interface ReplayControlsProps {
    isPlaying: boolean
    onTogglePlay: () => void
    onSpeedChange: (speed: number) => void
    speed: number
}

export function ReplayControls({
    isPlaying,
    onTogglePlay,
    onSpeedChange,
    speed
}: ReplayControlsProps) {
    return (
        <div className="absolute bottom-[88px] md:bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full border border-[#2A2D35] bg-[#181A20]/90 px-6 py-3 shadow-xl backdrop-blur-md">
            <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#A0AAB5] transition-colors hover:bg-[#2A2D35] hover:text-[#F1F3F5]"
                onClick={() => onSpeedChange(speed > 1 ? speed / 2 : 1)}
            >
                <Rewind className="h-5 w-5" />
            </button>

            <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform active:scale-95"
                onClick={onTogglePlay}
            >
                {isPlaying ? (
                    <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                    <Play className="h-6 w-6 ml-1" fill="currentColor" />
                )}
            </button>

            <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#A0AAB5] transition-colors hover:bg-[#2A2D35] hover:text-[#F1F3F5]"
                onClick={() => onSpeedChange(speed < 4 ? speed * 2 : 4)}
            >
                <FastForward className="h-5 w-5" />
            </button>

            <span className="min-w-[40px] text-center text-xs font-bold text-[#10B981]">
                {speed}x
            </span>
        </div>
    )
}
