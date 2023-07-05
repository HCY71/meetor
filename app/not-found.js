'use client'
import Link from 'next/link'
import { VStack, Text } from '@chakra-ui/react'
import Header from '@/components/atoms/Header'
import CustomButton from '@/components/atoms/CustomButton'
import { useLang } from '@/context/LangContext'

export default function NotFound() {
    const { context } = useLang()
    return (
        <VStack spacing={ 15 }>
            <VStack>
                <Header fontSize='10rem'>404</Header>
                <Header>{ context.notFound.title }</Header>
            </VStack>
            <VStack>
                <Text fontWeight='bold'>{ context.notFound.tryGoHome }</Text>
                <Link href="/">
                    <CustomButton ghost>
                        Home
                    </CustomButton>
                </Link>
            </VStack>
        </VStack>
    )
}