'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    phone: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (phone: string, otp: string) => Promise<void>;
    requestOtp: (phone: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If a valid HttpOnly cookie exists, the session route will succeed
                const userData = await apiRequest<User>('/v1/auth/sessions');
                setUser(userData);
            } catch (error) {
                // Not authenticated or cookies expired
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const requestOtp = async (phone: string) => {
        await apiRequest('/v1/auth/request-otp', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });
    };

    const login = async (phone: string, otp: string) => {
        // Verification endpoint now attaches the HttpOnly cookies seamlessly
        await apiRequest('/v1/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phone, otp }),
        });
        
        // Immediately fetch the user using the newly set cookies
        const userData = await apiRequest<User>('/v1/auth/sessions');
        setUser(userData);
        router.push('/');
    };

    const logout = async () => {
        try {
            await apiRequest('/v1/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed:', error);
        }
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, requestOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
