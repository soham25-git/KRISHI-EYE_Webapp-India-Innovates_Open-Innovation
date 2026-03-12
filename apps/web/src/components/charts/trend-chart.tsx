'use client'

interface TrendChartProps {
    title: string
    description?: string
    data: { label: string; value: number }[]
}

export function TrendChart({ title, description, data }: TrendChartProps) {
    const maxVal = Math.max(...data.map((d) => d.value))

    return (
        <div className="flex w-full flex-col rounded-xl border border-[#2A2D35] bg-[#181A20] p-6">
            <div className="mb-6">
                <h4 className="text-base font-semibold text-[#F1F3F5]">{title}</h4>
                {description && <p className="text-sm text-[#A0AAB5] mt-1">{description}</p>}
            </div>

            <div className="flex h-48 w-full items-end gap-2 sm:gap-4 px-2">
                {data.map((item, i) => {
                    const heightPct = maxVal > 0 ? (item.value / maxVal) * 100 : 0
                    return (
                        <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-2 h-full">
                            <div className="absolute -top-8 hidden rounded bg-[#2A2D35] px-2 py-1 text-xs text-white shadow-lg group-hover:block z-10 whitespace-nowrap">
                                {item.value} units
                            </div>
                            <div
                                className="w-full rounded-t-sm bg-[#10B981]/20 transition-all duration-500 group-hover:bg-[#10B981]/40 border-t-2 border-[#10B981]"
                                style={{ height: `${Math.max(4, heightPct)}%` }}
                            />
                            <span className="text-[10px] font-medium text-[#6B7280] truncate w-full text-center">
                                {item.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
