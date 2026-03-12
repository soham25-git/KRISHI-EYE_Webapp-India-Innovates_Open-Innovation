'use client'

import { useState, useEffect } from 'react'
import { apiRequest } from '@/lib/api-client'
import { Plus, MapPin, Tent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Farm {
    id: string;
    name: string;
    state: string;
    district: string;
}

import { AddFarmModal } from '@/components/forms/add-farm-modal'

export default function FarmsPage() {
    const [farms, setFarms] = useState<Farm[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    const fetchFarms = async () => {
        setLoading(true)
        try {
            const data = await apiRequest<Farm[]>('/v1/farms');
            setFarms(data);
        } catch (error) {
            console.error('Failed to fetch farms', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    return (
        <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight text-[#F1F3F5]">My Farms</h2>
                    <p className="text-[#A0AAB5]">Manage your agricultural holdings and field layouts.</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Farm
                </Button>
            </div>

            {showAddModal && (
                <AddFarmModal
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchFarms();
                    }}
                    onCancel={() => setShowAddModal(false)}
                />
            )}

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {farms.map((farm) => (
                        <Card key={farm.id} className="border-[#2A2D35] bg-[#181A20] text-white overflow-hidden hover:border-[#10B981]/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold">{farm.name}</CardTitle>
                                <Tent className="h-5 w-5 text-[#10B981]" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-[#A0AAB5] text-sm gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {farm.district}, {farm.state}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" className="flex-1 border-[#2A2D35] hover:bg-[#2A2D35] text-white h-9 text-xs">Manage Fields</Button>
                                    <Button variant="outline" className="flex-1 border-[#2A2D35] hover:bg-[#2A2D35] text-white h-9 text-xs">Settings</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {farms.length === 0 && (
                        <div className="col-span-full rounded-xl border border-dashed border-[#2A2D35] p-12 text-center text-[#A0AAB5]">
                            No farms found. Click "Add Farm" to create your first one.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
