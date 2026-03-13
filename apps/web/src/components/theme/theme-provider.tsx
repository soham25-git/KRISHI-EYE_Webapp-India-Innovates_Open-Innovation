'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: 'dark' | 'light'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    resolvedTheme: 'dark',
    setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

function getSystemTheme(): 'dark' | 'light' {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')
    const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

    // Initialize from localStorage or default to dark
    useEffect(() => {
        const stored = localStorage.getItem('krishi-theme') as Theme | null
        if (stored && ['dark', 'light', 'system'].includes(stored)) {
            setThemeState(stored)
        }
    }, [])

    // Resolve and apply theme to <html>
    useEffect(() => {
        const resolved = theme === 'system' ? getSystemTheme() : theme
        setResolvedTheme(resolved)

        const root = document.documentElement
        root.classList.remove('dark', 'light')
        root.classList.add(resolved)

        // Listen for system preference changes when in system mode
        if (theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: light)')
            const handler = (e: MediaQueryListEvent) => {
                const newResolved = e.matches ? 'light' : 'dark'
                setResolvedTheme(newResolved)
                root.classList.remove('dark', 'light')
                root.classList.add(newResolved)
            }
            mq.addEventListener('change', handler)
            return () => mq.removeEventListener('change', handler)
        }
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('krishi-theme', newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
