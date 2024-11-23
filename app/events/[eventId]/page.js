'use client'
import { useState, useEffect } from "react"
import {
    HStack,
    VStack,
    Text,
    useDisclosure
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
import UpdateModal from "@/components/cells/UpdateModal"
import PageSkeleton from "@/components/cells/PageSkeleton"
import { EventProvider } from "@/context/EventContext"

const Page = () => {
    const [ event, setEvent ] = useState(null)
    const { eventId } = useParams()
    const { currentDate } = useDate()

    const [ notFound, setNotFound ] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { context } = useLang()
    const { configs } = useConfigs()
    const [ recent, setRecent ] = useLocalStorage('meetor_recent', [])
    const [ isUpdateRead ] = useLocalStorage('meetor_update_timezone_read')

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

    useEffect(() => {
        if (!isUpdateRead) onOpen()
    }, [])

    // handle event not found
    if (notFound) return (
        <VStack spacing={ 15 } >
            <VStack spacing={ 5 }>
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
    else if (!event) return <PageSkeleton />
    return (
        <EventProvider event={ event }>
            <UpdateModal controls={ { isOpen, onClose } } />
            <VStack spacing={ 5 } w='520px' maxW='100%'>
                { event
                    &&
                    <VStack spacing={ { base: 2, md: 3 } }>
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
            </VStack>
        </EventProvider>
    )
}

export default Page