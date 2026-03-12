'use client'

import { useState } from 'react'
import { apiRequest } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateTicketModal({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('agronomy')
    const [priority, setPriority] = useState('medium')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await apiRequest('/v1/support/tickets', {
                method: 'POST',
                body: JSON.stringify({ title, category, priority, description }),
            })
            onSuccess()
        } catch (error) {
            alert('Failed to submit ticket')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-[#2A2D35] bg-[#181A20] text-white">
                <CardHeader>
                    <CardTitle>Submit Support Request</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#A0AAB5]">Issue Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                placeholder="Briefly describe the issue"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none"
                                    required
                                >
                                    <option value="agronomy">Agronomy Advice</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing/Account</option>
                                    <option value="other">Other</option>
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#A0AAB5]">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-2 text-white focus:border-[#10B981] focus:outline-none min-h-[100px]"
                                placeholder=" provide details about the problem or question"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 text-[#A0AAB5]">Cancel</Button>
                            <Button type="submit" className="flex-1 bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115] font-bold" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Ticket'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
