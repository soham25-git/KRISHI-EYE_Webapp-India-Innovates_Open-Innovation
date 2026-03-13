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
        <div className="absolute bottom-[88px] md:bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full px-6 py-3 shadow-xl" style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
        }}>
            <button
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer"
                style={{ color: 'var(--muted-foreground)' }}
                onClick={() => onSpeedChange(speed > 1 ? speed / 2 : 1)}
                aria-label="Decrease playback speed"
            >
                <Rewind className="h-5 w-5" />
            </button>

            <button
                className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform active:scale-95 cursor-pointer"
                style={{ background: 'var(--primary)' }}
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause replay' : 'Start replay'}
            >
                {isPlaying ? (
                    <Pause className="h-6 w-6" fill="currentColor" />
                ) : (
                    <Play className="h-6 w-6 ml-1" fill="currentColor" />
                )}
            </button>

            <button
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer"
                style={{ color: 'var(--muted-foreground)' }}
                onClick={() => onSpeedChange(speed < 4 ? speed * 2 : 4)}
                aria-label="Increase playback speed"
            >
                <FastForward className="h-5 w-5" />
            </button>

            <span className="min-w-[40px] text-center text-xs font-bold" style={{ color: 'var(--primary)' }}>
                {speed}x
            </span>
        </div>
    )
}
