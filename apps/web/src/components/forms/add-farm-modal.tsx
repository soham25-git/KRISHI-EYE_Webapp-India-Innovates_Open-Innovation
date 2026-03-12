'use client'

import { useState } from 'react'
import { apiRequest } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AddFarmModal({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [name, setName] = useState('')
    const [district, setDistrict] = useState('')
    const [state, setState] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await apiRequest('/v1/farms', {
                method: 'POST',
                body: JSON.stringify({ name, district, state }),
            })
            onSuccess()
        } catch (error) {
            alert('Failed to create farm')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-[#2A2D35] bg-[#181A20] text-white">
                <CardHeader>
                    <CardTitle>Add New Farm</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#A0AAB5]">Farm Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                placeholder="e.g. North Valley Farm"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">District</label>
                                <input
                                    type="text"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    placeholder="e.g. Pune"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">State</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    placeholder="e.g. Maharashtra"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 text-[#A0AAB5]">Cancel</Button>
                            <Button type="submit" className="flex-1 bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115] font-bold" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Farm'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
