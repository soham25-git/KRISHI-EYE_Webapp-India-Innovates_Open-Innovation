'use client'

import { useState, useEffect } from 'react'
import { apiRequest } from '@/lib/api-client'
import { PhoneCall, Search, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { CreateTicketModal } from '@/components/forms/create-ticket-modal'

interface SupportContact {
    id: string;
    name: string;
    role: string;
    phone: string;
    category: string;
}

export default function HelpDirectoryPage() {
    const [contacts, setContacts] = useState<SupportContact[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showTicketModal, setShowTicketModal] = useState(false)

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await apiRequest<SupportContact[]>('/v1/support/contacts');
                if (data && data.length > 0) {
                    setContacts(data);
                } else {
                    // Fallback for Phase 1 Demo / Seeded Data (India-native verified contacts)
                    setContacts([
                        { id: '1', name: 'Kisan Call Centre (KCC)', role: 'National Extension Service (Advisory)', phone: '1800-180-1551', category: 'Advisory' },
                        { id: '2', name: 'KVK Jaipur 1 (Chomu)', role: 'District Agricultural Expert (On-site)', phone: '01423-235133', category: 'On-site' },
                        { id: '3', name: 'PRADAN Hazaribag', role: 'Rural Livelihood Team (On-site)', phone: '+91 99317 15240', category: 'On-site' },
                        { id: '4', name: 'ATTPL Emergency Helpline', role: '24/7 Agri Emergency Support', phone: '1800-890-0815', category: 'Helplines' },
                        { id: '5', name: 'ICAR-IARI Extension', role: 'Expert Crop Advisory (Delhi)', phone: '011-25842387', category: 'Advisory' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch support contacts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const categories = ['On-site', 'Advisory', 'Helplines'];

    const filteredContacts = Array.isArray(contacts) ? contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 max-w-4xl mx-auto w-full">
            <div className="flex flex-row items-center justify-between gap-4 mb-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight text-[#F1F3F5]">Support Directory</h2>
                    <p className="text-[#A0AAB5]">Verified India-native agricultural helplines and platform support.</p>
                </div>
                <Button
                    onClick={() => setShowTicketModal(true)}
                    className="bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115]"
                >
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    New Ticket
                </Button>
            </div>

            {showTicketModal && (
                <CreateTicketModal
                    onSuccess={() => {
                        setShowTicketModal(false);
                        alert('Ticket submitted successfully!');
                    }}
                    onCancel={() => setShowTicketModal(false)}
                />
            )}

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                <input
                    type="text"
                    placeholder="Search for local experts, govt helplines (KVK, ICAR)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-[#2A2D35] bg-[#181A20] py-3 pl-10 pr-4 text-[#F1F3F5] placeholder:text-[#6B7280] focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {categories.map(cat => {
                        const catContacts = filteredContacts.filter(c => c.category === cat);
                        if (catContacts.length === 0 && search) return null;

                        return (
                            <div key={cat} className="space-y-4">
                                <h3 className="text-sm font-bold text-[#10B981] uppercase tracking-[0.2em] border-b border-[#2A2D35] pb-2">{cat}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {catContacts.map((contact) => (
                                        <div key={contact.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[#2A2D35] bg-[#181A20] p-5 shadow-sm hover:border-[#10B981]/50 transition-colors group">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#F1F3F5] mb-1 group-hover:text-[#10B981] transition-colors">{contact.name}</h3>
                                                <p className="text-sm text-[#A0AAB5]">{contact.role}</p>
                                            </div>

                                            <Link
                                                href={`tel:${contact.phone}`}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-[#22252C] border border-[#2A2D35] px-6 py-3 font-semibold text-[#F1F3F5] hover:bg-[#10B981] hover:text-[#0F1115] transition-all whitespace-nowrap"
                                            >
                                                <PhoneCall className="h-4 w-4" />
                                                {contact.phone}
                                            </Link>
                                        </div>
                                    ))}
                                    {catContacts.length === 0 && !search && (
                                        <div className="text-sm text-[#6B7280] italic px-4 py-2 bg-[#181A20]/50 rounded-lg border border-dashed border-[#2A2D35]">No contacts listed for this category yet.</div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {filteredContacts.length === 0 && search && (
                        <div className="text-center py-12 text-[#A0AAB5]">No support contacts found matching your search.</div>
                    )}
                </div>
            )}
        </div>
    )
}

