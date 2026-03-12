'use client'

export function HeatLegend() {
    return (
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 rounded-xl border border-[#2A2D35] bg-[#181A20]/90 p-4 backdrop-blur-md shadow-lg">
            <h4 className="text-xs font-semibold text-[#F1F3F5] mb-1">Infection Risk</h4>
            <div className="flex w-32 items-center gap-1 rounded bg-black/20 p-1">
                <div className="h-2 flex-1 rounded-sm bg-[#3B82F6]" title="Low" />
                <div className="h-2 flex-1 rounded-sm bg-[#10B981]" title="Mild" />
                <div className="h-2 flex-1 rounded-sm bg-[#FBBF24]" title="Moderate" />
                <div className="h-2 flex-1 rounded-sm bg-[#F97316]" title="High" />
                <div className="h-2 flex-1 rounded-sm bg-[#EF4444]" title="Severe" />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-[#A0AAB5]">
                <span>Low</span>
                <span>Severe</span>
            </div>
        </div>
    )
}
