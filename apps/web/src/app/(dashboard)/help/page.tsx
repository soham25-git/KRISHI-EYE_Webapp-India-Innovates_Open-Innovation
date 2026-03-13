'use client'

import { useState, useEffect } from 'react'
import { apiRequest } from '@/lib/api-client'
import { PhoneCall, Search, MessageSquarePlus, Loader2, AlertCircle, Users } from 'lucide-react'
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

const categoryIcons: Record<string, string> = {
    'On-site': '📍',
    'Advisory': '🧑‍🌾',
    'Helplines': '☎️'
}

export default function HelpDirectoryPage() {
    const [contacts, setContacts] = useState<SupportContact[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [showTicketModal, setShowTicketModal] = useState(false)

    useEffect(() => {
        const fallbackContacts: SupportContact[] = [
            { id: '1', name: 'Kisan Call Centre (KCC)', role: 'National Extension Service (Advisory)', phone: '1800-180-1551', category: 'Advisory' },
            { id: '2', name: 'KVK Jaipur 1 (Chomu)', role: 'District Agricultural Expert (On-site)', phone: '01423-235133', category: 'On-site' },
            { id: '3', name: 'PRADAN Hazaribag', role: 'Rural Livelihood Team (On-site)', phone: '+91 99317 15240', category: 'On-site' },
            { id: '4', name: 'ATTPL Emergency Helpline', role: '24/7 Agri Emergency Support', phone: '1800-890-0815', category: 'Helplines' },
            { id: '5', name: 'ICAR-IARI Extension', role: 'Expert Crop Advisory (Delhi)', phone: '011-25842387', category: 'Advisory' }
        ];

        const fetchContacts = async () => {
            try {
                const data = await apiRequest<SupportContact[]>('/v1/support/contacts');
                if (data && data.length > 0) {
                    setContacts(data);
                } else {
                    setContacts(fallbackContacts);
                }
            } catch (err) {
                console.error('Failed to fetch support contacts, using fallback:', err);
                setContacts(fallbackContacts);
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
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>Support Directory</h2>
                    <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">Verified India-native agricultural helplines and platform support.</p>
                </div>
                <Button
                    onClick={() => setShowTicketModal(true)}
                    className="cursor-pointer font-semibold"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
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

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
                <input
                    type="text"
                    placeholder="Search for local experts, govt helplines (KVK, ICAR)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl py-3 pl-11 pr-4 bg-transparent focus:outline-none transition-all"
                    style={{
                        border: '1px solid var(--border)',
                        background: 'var(--input)',
                        color: 'var(--foreground)',
                    }}
                />
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading support directory...</span>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {categories.map(cat => {
                        const catContacts = filteredContacts.filter(c => c.category === cat);
                        if (catContacts.length === 0 && search) return null;

                        return (
                            <div key={cat} className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-[0.15em] pb-2 flex items-center gap-2" style={{
                                    color: 'var(--primary)',
                                    borderBottom: '1px solid var(--border)'
                                }}>
                                    {cat}
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {catContacts.map((contact) => (
                                        <div key={contact.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl p-5 transition-all group" style={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            <div>
                                                <h3 className="text-base font-bold mb-1 transition-colors" style={{ color: 'var(--foreground)' }}>{contact.name}</h3>
                                                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{contact.role}</p>
                                            </div>

                                            <Link
                                                href={`tel:${contact.phone}`}
                                                className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all whitespace-nowrap cursor-pointer text-sm"
                                                style={{
                                                    background: 'var(--surface-alt)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--foreground)',
                                                }}
                                            >
                                                <PhoneCall className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                                                {contact.phone}
                                            </Link>
                                        </div>
                                    ))}
                                    {catContacts.length === 0 && !search && (
                                        <div className="flex items-center gap-2 text-sm italic px-4 py-3 rounded-xl" style={{
                                            color: 'var(--muted-foreground)',
                                            background: 'var(--surface-alt)',
                                            border: '1px dashed var(--border)'
                                        }}>
                                            <Users className="h-4 w-4 shrink-0" />
                                            No contacts listed for this category yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {filteredContacts.length === 0 && search && (
                        <div className="flex flex-col items-center py-12 gap-2" style={{ color: 'var(--muted-foreground)' }}>
                            <Search className="h-8 w-8 opacity-40" />
                            <span className="text-sm">No support contacts found matching your search.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
