'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Sprout, Phone, Shield, ArrowLeft, AlertCircle, Loader2, Info } from 'lucide-react'

export default function LoginPage() {
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { requestOtp, login } = useAuth()
    const otpInputRef = useRef<HTMLInputElement>(null)

    const normalizePhone = (input: string) => {
        const digits = input.replace(/\D/g, '')
        if (digits.length === 10) return `+91${digits}`
        if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
        if (input.startsWith('+') && digits.length === 12) return `+${digits}`
        return input
    }

    useEffect(() => {
        if (step === 'otp' && otpInputRef.current) {
            otpInputRef.current.focus()
        }
    }, [step])

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
            setPhone(normalized)
            setStep('otp')
        } catch (error) {
            setError('Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (loading || otp.length < 6) return
        
        setError('')
        setLoading(true)
        try {
            const normalized = normalizePhone(phone)
            await login(normalized, otp)
        } catch (error: any) {
            setError(error?.message || 'Login failed. Please try again.')
            setLoading(false) // Only reset loading on error; success will redirect
        }
    }

    return (
        <div className="flex min-h-dvh items-center justify-center p-4" style={{ background: 'var(--background)' }}>
            {/* Subtle radial gradient background */}
            <div className="fixed inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 60%)'
            }} />

            <div className="relative w-full max-w-md">
                {/* Brand header */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                         style={{ background: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                        <Sprout className="h-8 w-8" style={{ color: 'var(--primary)' }} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        KRISHI-EYE
                    </h1>
                    <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Precision agriculture for Indian farmers
                    </p>
                </div>

                {/* Login card */}
                <div className="rounded-2xl p-6 sm:p-8" style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    {/* Step header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            {step === 'otp' && (
                                <button
                                    onClick={() => { setStep('phone'); setError(''); setOtp(''); }}
                                    className="flex items-center justify-center h-8 w-8 rounded-lg transition-colors cursor-pointer"
                                    style={{ background: 'var(--surface-alt)', color: 'var(--muted-foreground)' }}
                                    aria-label="Go back to phone entry"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>
                            )}
                            <div className="flex items-center gap-2">
                                {step === 'phone' ? (
                                    <Phone className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                                ) : (
                                    <Shield className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                                )}
                                <h2 className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
                                    {step === 'phone' ? 'Sign in' : 'Verify OTP'}
                                </h2>
                            </div>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            {step === 'phone'
                                ? 'Enter your mobile number to receive a verification code'
                                : `Code sent to ${phone}`
                            }
                        </p>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="mb-4 flex items-start gap-3 rounded-xl p-3 text-sm" style={{
                            background: 'color-mix(in srgb, var(--danger) 10%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
                            color: 'var(--danger)'
                        }}>
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Phone step */}
                    {step === 'phone' ? (
                        <form onSubmit={handleRequestOtp} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="phone-input" className="block text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                    Mobile Number
                                </label>
                                <div className="flex rounded-xl overflow-hidden" style={{
                                    border: '1px solid var(--border)',
                                    background: 'var(--input)'
                                }}>
                                    <span className="flex items-center px-4 text-sm font-semibold select-none" style={{
                                        background: 'var(--surface-alt)',
                                        color: 'var(--muted-foreground)',
                                        borderRight: '1px solid var(--border)'
                                    }}>
                                        +91
                                    </span>
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="99999 99999"
                                        value={phone.replace('+91', '')}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="flex-1 px-4 py-3.5 text-base bg-transparent border-none focus:outline-none"
                                        style={{ color: 'var(--card-foreground)' }}
                                        required
                                        autoComplete="tel-national"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full font-bold py-6 text-base cursor-pointer transition-all"
                                style={{
                                    background: 'var(--primary)',
                                    color: 'var(--primary-foreground)',
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                                    </span>
                                ) : 'Send OTP'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="otp-input" className="block text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                    6-Digit Code
                                </label>
                                <input
                                    id="otp-input"
                                    ref={otpInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="• • • • • •"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.4em] font-bold bg-transparent focus:outline-none transition-colors"
                                    style={{
                                        border: '1px solid var(--border)',
                                        background: 'var(--input)',
                                        color: 'var(--card-foreground)',
                                    }}
                                    maxLength={6}
                                    required
                                    autoComplete="one-time-code"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full font-bold py-6 text-base cursor-pointer transition-all"
                                style={{
                                    background: 'var(--primary)',
                                    color: 'var(--primary-foreground)',
                                }}
                                disabled={loading || otp.length < 6}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                                    </span>
                                ) : 'Verify & Sign In'}
                            </Button>
                        </form>
                    )}

                    {/* Demo notice */}
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl p-3 text-xs" style={{
                        background: 'color-mix(in srgb, var(--info) 8%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--info) 20%, transparent)',
                        color: 'var(--info)'
                    }}>
                        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>
                            <strong>Demo Mode:</strong> SMS delivery is paused. Use code <strong className="font-mono">123456</strong> to log in.
                        </span>
                    </div>
                </div>

                {/* Trust cues */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3" style={{ color: 'var(--primary)' }} /> Secure Login
                    </span>
                    <span>•</span>
                    <span>ICAR/KVK Verified</span>
                    <span>•</span>
                    <span>Made in India</span>
                </div>
            </div>
        </div>
    )
}
