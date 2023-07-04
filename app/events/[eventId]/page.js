'use client'
import { useState, useEffect } from "react"
import {
    HStack,
    VStack,
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

const Page = () => {
    const [ event, setEvent ] = useState(null)
    const { eventId } = useParams()
    const { currentDate } = useDate()

    const { context } = useLang()
    const { configs } = useConfigs()
    const [ recent, setRecent ] = useLocalStorage('recent', [])

    const { GET_BY_ID, isLoading, data } = useSupabase()
    useEffect(() => {
        GET_BY_ID('events', eventId)
    }, [ GET_BY_ID, eventId ])

    useEffect(() => {
        if (!isLoading && data) {
            setEvent(data[ 0 ])

            // Add to recently visited
            const recentArray = typeof (recent) === 'object' ? recent : JSON.parse(recent)
            if (recentArray.some(r => r.id === data[ 0 ].id)) return
            setRecent([ ...recentArray, data[ 0 ] ])
        }
    }, [ isLoading, data ])

    return (
        <VStack spacing={ 5 } w='520px' >
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