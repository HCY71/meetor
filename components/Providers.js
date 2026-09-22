'use client'


import { ChakraProvider } from '@chakra-ui/react'
import { ConfigsProvider } from '@/context/ConfigsContext'
import { LangProvider } from '@/context/LangContext'
import { ColorModeProvider } from '@/components/ColorMode'

import system from '@/public/theme'

export function Providers({ children }) {
    return (
        <ConfigsProvider>
            <LangProvider>
                <ChakraProvider value={ system }>
                    <ColorModeProvider>
                        { children }
                    </ColorModeProvider>
                </ChakraProvider>
            </LangProvider>
        </ConfigsProvider>
    )
}
