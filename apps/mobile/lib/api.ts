// Seeded mock data until API integration
export const api = {
    getFarms: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return [
            { id: 'f1', name: 'North Field (Demo)', location: 'Punjab', status: 'Healthy' },
        ];
    },
    getAnalyticsOverview: async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
            performanceScore: 88,
            savings: '$450',
            coverage: '95%',
            issuesDetected: 2,
        };
    },
    getSupportContacts: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [
            { id: 'c1', name: 'Agri Support Center', phone: '1800-120-1011', type: 'Government' },
            { id: 'c2', name: 'Local Extension Office', phone: '1800-180-1551', type: 'Local Info' },
        ];
    }
};
