'use client'

import { ThemeProvider, useTheme } from 'next-themes'

// Chakra v3 dropped its own colour mode, so next-themes owns it now. The
// storage key is the one Chakra v2 wrote to, which keeps every returning
// visitor's saved choice.
export function ColorModeProvider({ children }) {
    return (
        <ThemeProvider
            attribute='class'
            storageKey='meetor_color_mode'
            defaultTheme='system'
            enableSystem
        >
            { children }
        </ThemeProvider>
    )
}

// Mirrors the useColorMode hook v2 exposed, so call sites keep the same shape.
// colorMode is the resolved value, never 'system'.
export function useColorMode() {
    const { resolvedTheme, setTheme } = useTheme()
    const toggleColorMode = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
    return {
        colorMode: resolvedTheme,
        toggleColorMode,
    }
}
