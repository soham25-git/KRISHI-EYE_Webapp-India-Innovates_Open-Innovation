'use client'

export function HeatLegend() {
    const levels = [
        { color: '#3B82F6', label: 'Low', pattern: '─', description: 'No infection detected' },
        { color: '#10B981', label: 'Mild', pattern: '░', description: 'Minor presence' },
        { color: '#FBBF24', label: 'Moderate', pattern: '▒', description: 'Treatment advised' },
        { color: '#F97316', label: 'High', pattern: '▓', description: 'Immediate action' },
        { color: '#EF4444', label: 'Severe', pattern: '█', description: 'Critical intervention' },
    ]

    return (
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-3 rounded-xl p-4 shadow-lg" style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)'
        }}>
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
                Infection Risk Level
            </h4>

            {/* Color bar with pattern overlay */}
            <div className="flex w-40 items-center gap-0.5 rounded overflow-hidden" role="img" aria-label="Infection risk gradient from low to severe">
                {levels.map(level => (
                    <div key={level.label} className="h-3 flex-1 relative" style={{ background: level.color }} title={`${level.label}: ${level.description}`}>
                        <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-white/70 select-none" aria-hidden="true">
                            {level.pattern}
                        </span>
                    </div>
                ))}
            </div>

            {/* Labelled legend items — not color-only */}
            <div className="space-y-1.5">
                {levels.map(level => (
                    <div key={level.label} className="flex items-center gap-2 text-[11px]">
                        <span className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center text-[7px] font-bold text-white/80" style={{ background: level.color }} aria-hidden="true">
                            {level.pattern}
                        </span>
                        <span className="font-semibold min-w-[52px]" style={{ color: 'var(--foreground)' }}>{level.label}</span>
                        <span style={{ color: 'var(--muted-foreground)' }}>{level.description}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
