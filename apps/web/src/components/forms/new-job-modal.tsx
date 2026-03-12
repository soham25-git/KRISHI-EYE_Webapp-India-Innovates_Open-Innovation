'use client'

import { useState, useEffect } from 'react'
import { apiRequest } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NewJobModal({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [farms, setFarms] = useState<any[]>([])
    const [fields, setFields] = useState<any[]>([])
    const [tractors, setTractors] = useState<any[]>([])

    const [selectedFarm, setSelectedFarm] = useState('')
    const [selectedField, setSelectedField] = useState('')
    const [selectedTractor, setSelectedTractor] = useState('')
    const [type, setType] = useState('spraying')
    const [priority, setPriority] = useState('medium')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const [fData, tData] = await Promise.all([
                    apiRequest<any[]>('/v1/farms'),
                    apiRequest<any[]>('/v1/tractors'),
                ])
                setFarms(fData)
                setTractors(tData)
            } catch (error) {
                console.error('Failed to fetch resources', error)
            }
        }
        fetchResources()
    }, [])

    useEffect(() => {
        if (selectedFarm) {
            apiRequest<any[]>(`/v1/farms/${selectedFarm}/fields`).then(setFields).catch(console.error)
        } else {
            setFields([])
        }
    }, [selectedFarm])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await apiRequest('/v1/jobs', {
                method: 'POST',
                body: JSON.stringify({
                    tractor_id: selectedTractor,
                    field_id: selectedField,
                    status: 'pending' // Enforce pending status from DTO matching
                }),
            })
            onSuccess()
        } catch (error) {
            alert('Failed to create job. Ensure all resources belong to the same farm.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-[#2A2D35] bg-[#181A20] text-white">
                <CardHeader>
                    <CardTitle>Schedule Operation Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#A0AAB5]">Select Farm</label>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Select Field</label>
                                <select
                                    value={selectedField}
                                    onChange={(e) => setSelectedField(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    disabled={!selectedFarm}
                                    required
                                >
                                    <option value="">Select a field...</option>
                                    {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Select Tractor</label>
                                <select
                                    value={selectedTractor}
                                    onChange={(e) => setSelectedTractor(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    required
                                >
                                    <option value="">Select a tractor...</option>
                                    {tractors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Operation Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    required
                                >
                                    <option value="spraying">Spraying</option>
                                    <option value="harvesting">Harvesting</option>
                                    <option value="tillage">Tillage</option>
                                    <option value="seeding">Seeding</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 text-[#A0AAB5]">Cancel</Button>
                            <Button type="submit" className="flex-1 bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115] font-bold" disabled={loading}>
                                {loading ? 'Scheduling...' : 'Schedule Job'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
