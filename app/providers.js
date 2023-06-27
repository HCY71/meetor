'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { ConfigsProvider } from '@/context/ConfigsContext'
import { LangProvider } from '@/context/LangContext'

import { ColorModeScript } from '@chakra-ui/react'
import theme from '@/public/theme'

export function Providers({ children }) {
    return (
        // <CacheProvider>
        <ConfigsProvider>
            <LangProvider>
                <ChakraProvider theme={ theme }>
                    <ColorModeScript initialColorMode={ theme.config.initialColorMode } />
                    { children }
                </ChakraProvider>
            </LangProvider>
        </ConfigsProvider>
        // </CacheProvider>
    )
}