'use client'

interface RouteTrailProps {
    points: { lat: number; lng: number }[]
    progressIndex: number
}

export function RouteTrail({ points, progressIndex }: RouteTrailProps) {
    if (points.length < 2) return null

    const pathData = points.reduce((acc, point, index) => {
        return `${acc} ${index === 0 ? 'M' : 'L'} ${point.lng} ${point.lat}`
    }, '')

    const activePoints = points.slice(0, Math.max(2, progressIndex + 1))
    const activePathData = activePoints.reduce((acc, point, index) => {
        return `${acc} ${index === 0 ? 'M' : 'L'} ${point.lng} ${point.lat}`
    }, '')

    return (
        <svg className="absolute inset-0 h-full w-full opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path
                d={pathData}
                fill="none"
                stroke="#2A2D35"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d={activePathData}
                fill="none"
                stroke="#22D3EE"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-linear motion-reduce:transition-none"
                style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.6))' }}
            />
        </svg>
    )
}
