'use client'

import { useState, useEffect } from 'react'
import { Send, Sprout, AlertCircle, RefreshCw } from 'lucide-react'
import { apiRequest } from '@/lib/api-client'

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

interface AiMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    sources?: { title: string; url?: string }[];
    confidence?: string;
}

export default function AskAIPage() {
    const [messages, setMessages] = useState<AiMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await apiRequest<any[]>('/v1/ai/history');
                const formattedHistory: AiMessage[] = data.flatMap(log => [
                    {
                        id: `${log.id}-user`,
                        role: 'user' as const,
                        content: log.prompt,
                        timestamp: log.createdAt
                    },
                    {
                        id: `${log.id}-ai`,
                        role: 'ai' as const,
                        content: log.response,
                        timestamp: log.createdAt,
                        sources: log.sources,
                        confidence: log.confidence
                    }
                ]);
                setMessages(formattedHistory);
            } catch (err) {
                console.error('Failed to load history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || sending) return

        const userText = input.trim();
        const optimisticId = Date.now().toString();
        
        const newMsg: AiMessage = { 
            id: optimisticId, 
            role: 'user', 
            content: userText,
            timestamp: new Date().toISOString()
        };
        
        setMessages((prev) => [...prev, newMsg])
        setInput('')
        setSending(true)

        try {
            const aiResponse = await apiRequest<any>('/v1/ai/chat', {
                method: 'POST',
                body: JSON.stringify({ question: userText, language: 'en' })
            });

            setMessages((prev) => [
                ...prev,
                {
                    id: aiResponse.id || Date.now().toString(),
                    role: 'ai',
                    content: aiResponse.response,
                    timestamp: aiResponse.createdAt || new Date().toISOString(),
                    sources: aiResponse.sources || [],
                    confidence: aiResponse.confidence
                }
            ]);
        } catch (error) {
            console.error('AI Request failed:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'ai',
                    content: 'I apologize, but I am currently unable to reach the advisory network. Please try again later.',
                    timestamp: new Date().toISOString()
                }
            ]);
        } finally {
            setSending(false);
        }
    }

    const resetHistory = () => {
        if (confirm('Clear chat history?')) {
            setMessages([]);
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-72px)] md:h-screen w-full max-w-5xl mx-auto bg-[#0F1115]">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#2A2D35] px-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                        <Sprout className="h-5 w-5 text-[#10B981]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#F1F3F5]">Agri Advisory AI</h2>
                        <p className="text-xs text-[#10B981] font-medium">Online & Ready</p>
                    </div>
                </div>

                <button onClick={resetHistory} className="flex items-center text-xs text-[#A0AAB5] hover:text-[#F1F3F5] gap-1 transition-colors">
                    <RefreshCw className="h-3 w-3" /> Reset Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <div className="bg-[#181A20] border border-[#2A2D35] rounded-xl p-4 text-sm text-[#A0AAB5] mb-6 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <p>Responses are generated by AI for agronomic decision support. This tool does not control vehicle hardware or boom sprayer outputs. Always verify with an agronomist for severe crop issues.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32 text-[#A0AAB5] text-sm">Loading history...</div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-[#A0AAB5] text-sm italic">Type your first agronomic question below.</div>
                ) : null}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                        <div
                            className={`rounded-2xl px-5 py-3 ${msg.role === 'user'
                                    ? 'bg-[#10B981] text-white rounded-br-none'
                                    : 'bg-[#181A20] border border-[#2A2D35] text-[#F1F3F5] rounded-bl-none'
                                }`}
                        >
                            <div className="whitespace-pre-wrap text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: (msg.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            
                            {/* Trust UI Preservation */}
                            {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-[#2A2D35]/50 flex flex-wrap gap-2">
                                    <span className="text-xs text-[#A0AAB5] w-full block mb-1">Sources:</span>
                                    {msg.sources.map((src, i) => (
                                        <div key={i} className="bg-[#22252C] text-[#10B981] text-xs px-2 py-1 rounded inline-flex items-center">
                                            {src.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            {msg.role === 'ai' && (
                                <span className="text-[10px] text-[#6B7280] ml-2 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Grounded
                                    {msg.confidence && ` • ${msg.confidence}`}
                                </span>
                            )}
                            {msg.timestamp && (
                                <span className="text-[10px] text-[#6B7280]">
                                    {formatTime(msg.timestamp)}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                
                {sending && (
                    <div className="flex flex-col max-w-[85%] mr-auto items-start">
                        <div className="rounded-2xl px-5 py-3 bg-[#181A20] border border-[#2A2D35] text-[#A0AAB5] rounded-bl-none italic text-sm">
                            Analyzing agromonic databanks...
                        </div>
                    </div>
                )}
            </div>

            <div className="shrink-0 border-t border-[#2A2D35] p-4 bg-[#181A20]">
                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your farming question here..."
                        className="w-full rounded-full border border-[#2A2D35] bg-[#0F1115] py-4 pl-6 pr-14 text-[#F1F3F5] placeholder:text-[#6B7280] focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] text-white disabled:opacity-50 disabled:bg-[#2A2D35] disabled:text-[#6B7280] transition-colors shadow-lg"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}
