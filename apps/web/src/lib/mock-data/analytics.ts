export const mockAnalyticsData = {
    coverageTrend: [
        { label: 'Mon', value: 120 },
        { label: 'Tue', value: 340 },
        { label: 'Wed', value: 200 },
        { label: 'Thu', value: 430 },
        { label: 'Fri', value: 500 },
        { label: 'Sat', value: 650 },
        { label: 'Sun', value: 800 },
    ],
    savings: {
        total: '₹14,500',
        trend: { value: 12.5, positive: true, label: 'vs last month' }
    },
    issuesDetected: {
        count: 24,
        trend: { value: 5, positive: false, label: 'vs last month' }
    },
    activeFields: 3
}
