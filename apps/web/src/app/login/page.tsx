'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout } from 'lucide-react'

export default function LoginPage() {
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { requestOtp, login } = useAuth()

    const normalizePhone = (input: string) => {
        const digits = input.replace(/\D/g, '')
        if (digits.length === 10) return `+91${digits}`
        if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
        if (input.startsWith('+') && digits.length === 12) return `+${digits}`
        return input // return raw if malformed so validation can catch it
    }

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        const normalized = normalizePhone(phone)
        if (!/^\+91\d{10}$/.test(normalized)) {
            setError('Please enter a valid 10-digit mobile number')
            return
        }

        setLoading(true)
        try {
            await requestOtp(normalized)
            setPhone(normalized) // Update input to show normalized form
            setStep('otp')
        } catch (error) {
            setError('Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const normalized = normalizePhone(phone)
            await login(normalized, otp)
        } catch (error: any) {
            setError(error?.message || 'Login failed due to a server issue. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F1115] p-4">
            <Card className="w-full max-w-md border-[#2A2D35] bg-[#181A20] text-white">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/20">
                        <Sprout className="h-6 w-6 text-[#10B981]" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome to KRISHI-EYE</CardTitle>
                    <CardDescription className="text-[#A0AAB5]">
                        {step === 'phone' ? 'Enter your mobile number to get started' : 'Enter the 6-digit code sent to your phone'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    {step === 'phone' ? (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number e.g. 99999 99999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-3 text-white focus:border-[#10B981] focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115] font-bold py-6 text-lg"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Button>
                            <div className="mt-4 rounded border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-3 text-center text-xs text-[#3B82F6]">
                                <strong>Notice:</strong> Live SMS is currently resting. <br/>Use the demo OTP code: <strong>123456</strong>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#A0AAB5]">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full rounded-lg border border-[#2A2D35] bg-[#22252C] px-4 py-3 text-white focus:border-[#10B981] focus:outline-none text-center text-2xl tracking-[0.5em] font-bold transition-colors"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#10B981] hover:bg-[#0E9D6E] text-[#0F1115] font-bold py-6 text-lg"
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Login'}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="w-full text-sm text-[#A0AAB5] hover:text-[#10B981] transition-colors"
                            >
                                Change phone number
                            </button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
