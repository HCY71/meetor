'use client'
import { useState, useEffect } from "react"
import {
    HStack,
    VStack,
    Text,
} from "@chakra-ui/react"
import Header from "@/components/atoms/Header"
import Subtitle from "@/components/atoms/Subtitle"
import SecondForm from "@/components/SecondForm"
import { CopyLink, Share } from "@/components/atoms/ShareButtons"
import useSupabase from "@/hooks/useSupabase"
import { useParams } from "next/navigation"
import { getTimeDistance } from "@/public/utils/timeFormat"
import useDate from "@/hooks/useDate"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useLang } from "@/context/LangContext"
import { useConfigs } from "@/context/ConfigsContext"
import Link from "next/link"
import CustomButton from "@/components/atoms/CustomButton"

const Page = () => {
    const [ event, setEvent ] = useState(null)
    const { eventId } = useParams()
    const { currentDate } = useDate()

    const [ notFound, setNotFound ] = useState(false)

    const { context } = useLang()
    const { configs } = useConfigs()
    const [ recent, setRecent ] = useLocalStorage('recent', [])

    const { GET_BY_ID, isLoading, data } = useSupabase()
    useEffect(() => {
        GET_BY_ID('events', eventId)
    }, [ GET_BY_ID, eventId ])

    useEffect(() => {
        if (!isLoading && data[ 0 ]) {
            setEvent(data[ 0 ])

            // Add to recently visited
            const recentArray = typeof (recent) === 'object' ? recent : JSON.parse(recent)
            if (recentArray.some(r => r.id === data[ 0 ].id)) return
            setRecent([ ...recentArray, data[ 0 ] ])
        } else {
            if (!isLoading) setNotFound(true)
        }
    }, [ isLoading, data ])

    if (notFound) return (
        <VStack spacing={ 15 }>
            <VStack spacing={ 5 }>
                <Header fontSize='5rem'>{ context.eventNotFound.title }</Header>
                <Header fontSize='2rem'>{ context.notFound.title }</Header>
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
    return (
        <VStack spacing={ 5 } w='min(100%, 520px)' >
            { event
                &&
                <VStack spacing={ 0 }>
                    <Header>
                        { event.name }
                    </Header>
                    <Subtitle>
                        { context.event.createdAt + getTimeDistance(event, currentDate, configs.lang) + context.event.ago }
                    </Subtitle>
                    <HStack mt={ 4 } mb={ 4 } spacing={ 3 }>
                        <CopyLink />
                        <Share />
                    </HStack>
                </VStack>
            }
            <SecondForm />
        </VStack >
    )
}

export default Page