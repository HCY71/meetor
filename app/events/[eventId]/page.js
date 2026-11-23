'use client'
import { useState, useEffect } from "react"
import {
    VStack,
    Text
} from "@chakra-ui/react"
import Header from "@/components/atoms/Header"
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
import { EventPageSkeleton } from "@/components/cells/PageSkeleton"
import EventPageFrame, { eventTitleSize } from "@/components/cells/EventPageFrame"
import { EventProvider } from "@/context/EventContext"

const Page = () => {
    const [ event, setEvent ] = useState(null)
    const { eventId } = useParams()
    const { currentDate } = useDate()

    const [ notFound, setNotFound ] = useState(false)

    const { context } = useLang()
    const { configs } = useConfigs()
    const [ recent, setRecent ] = useLocalStorage('meetor_recent', [])

    const { GET_BY_ID, isLoading, data } = useSupabase()
    useEffect(() => {
        GET_BY_ID('events', eventId)
    }, [ GET_BY_ID, eventId ])

    useEffect(() => {
        if (!isLoading && data && data[ 0 ]) {
            setEvent(data[ 0 ])

            // Add to recently visited
            const recentArray = typeof (recent) === 'object' ? recent : JSON.parse(recent)
            if (recentArray.some(r => r.id === data[ 0 ].id)) return
            setRecent([ ...recentArray, data[ 0 ] ])
        } else {
            if (!isLoading) setNotFound(true)
        }
    }, [ isLoading, data ])

    // handle event not found
    if (notFound) return (
        <VStack gap={ 15 } >
            <VStack gap={ 5 }>
                <Header fontSize={ { base: '4rem', md: '5rem' } }>{ context.eventNotFound.title }</Header>
                <Header fontSize={ { base: '1.5rem', md: '2rem' } }>{ context.notFound.title }</Header>
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
    else if (!event) return <EventPageSkeleton />
    return (
        <EventProvider event={ event }>
            <EventPageFrame
                title={
                    <Header fontSize={ eventTitleSize } lineHeight='1.2' textAlign='start' overflowWrap='anywhere'>
                        { event.name }
                    </Header>
                }
                metadata={
                    <Text color='ink.muted' fontSize='sm'>
                        { context.event.createdAt + getTimeDistance(event, currentDate, configs.lang) + context.event.ago }
                    </Text>
                }
                actions={
                    <>
                        <CopyLink />
                        <Share eventName={ event.name } />
                    </>
                }
            >
                <SecondForm />
            </EventPageFrame>
        </EventProvider>
    )
}

export default Page
