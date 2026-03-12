'use client'

import { useState, useEffect } from 'react'
import { apiRequest } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RegisterTractorModal({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [farms, setFarms] = useState<any[]>([])
    const [name, setName] = useState('')
    const [model, setModel] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [selectedFarm, setSelectedFarm] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const data = await apiRequest<any[]>('/v1/farms');
                setFarms(data);
                if (data.length > 0) setSelectedFarm(data[0].id);
            } catch (error) {
                console.error('Failed to fetch farms', error);
            }
        };
        fetchFarms();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await apiRequest('/v1/tractors', {
                method: 'POST',
                body: JSON.stringify({
                    label: name,
                    description: `${model} (SN: ${serialNumber})`,
                    farm_id: selectedFarm
                }),
            })
            onSuccess()
        } catch (error) {
            alert('Failed to register tractor. Ensure serial number is unique.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-[#2A2D35] bg-[#181A20] text-white">
                <CardHeader>
                    <CardTitle>Register New Tractor</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#A0AAB5]">Assign to Farm</label>
                            <select
                                value={selectedFarm}
                                onChange={(e) => setSelectedFarm(e.target.value)}
                                className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                required
                            >
                                <option value="">Select a farm...</option>
                                {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#A0AAB5]">Tractor Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                placeholder="e.g. Swaraj 855"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Model</label>
                                <input
                                    type="text"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    placeholder="e.g. 2024 V3"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Serial Number</label>
                                <input
                                    type="text"
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    placeholder="e.g. AG-77221"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 text-[#A0AAB5]">Cancel</Button>
                            <Button type="submit" className="flex-1 bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115] font-bold" disabled={loading}>
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
