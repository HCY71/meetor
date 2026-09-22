'use client'


import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react'
import { ConfigsProvider } from '@/context/ConfigsContext'
import { LangProvider } from '@/context/LangContext'

import theme from '@/public/theme'
const manager = createLocalStorageManager("meetor_color_mode")

export function Providers({ children }) {
    return (
        // <CacheProvider>
        <ConfigsProvider>
            <LangProvider>
                <ChakraProvider theme={ theme } colorModeManager={ manager }>
                    { children }
                </ChakraProvider>
            </LangProvider>
        </ConfigsProvider>
        // </CacheProvider>
    )
}