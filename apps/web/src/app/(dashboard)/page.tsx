'use client'

import { useState, useEffect } from 'react'
import { MetricCard } from '@/components/charts/metric-card'
import { FarmHeatmap } from '@/components/map/farm-heatmap'
import { apiRequest } from '@/lib/api-client'
import { Activity, LayoutDashboard, Tractor, Target, CheckSquare, CheckCircle2 } from 'lucide-react'

interface AnalyticsOverview {
    totalFarms: number;
    activeFields: number;
    totalJobs: number;
    totalSavings: number; // Re-purposed mapping
}

export default function DashboardPage() {
    const [data, setData] = useState<AnalyticsOverview | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const overview = await apiRequest<AnalyticsOverview>('/v1/analytics/overview');
                setData(overview);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Spraying Operations Overview</h1>
                <p className="text-slate-400 max-w-2xl">
                    Monitor your boom-width coverage, precision detection metrics, and spraying efficiency for equipped tractors.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    title="Coverage Area"
                    value="0ac"
                    icon={<Target className="h-5 w-5 text-[#3B82F6]" />}
                    trend={{ value: 12.5, label: 'vs last run', positive: true }}
                />
                <MetricCard
                    title="Equipped Boom Fleet"
                    value="1"
                    icon={<Tractor className="h-5 w-5 text-[#10B981]" />}
                    trend={{ value: 0, label: 'All systems ready', positive: true }}
                />
                <MetricCard
                    title="Spraying Passes"
                    value="0"
                    icon={<Activity className="h-5 w-5 text-[#EF4444]" />}
                />
                <MetricCard
                    title="Treatment Efficiency"
                    value="85%"
                    icon={<CheckCircle2 className="h-5 w-5 text-[#10B981]" />}
                    trend={{ value: 5, label: 'Optimized Spraying', positive: true }}
                />
            </div>

            <div className="w-full mt-4 h-[600px] flex">
                <FarmHeatmap />
            </div>
        </div>
    )
}
