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

import { zhTW } from "date-fns/locale"

const Page = () => {
    const [ event, setEvent ] = useState(null)
    const { eventId } = useParams()
    const { currentDate } = useDate()

    const { GET_BY_ID, isLoading, data } = useSupabase()
    useEffect(() => {
        GET_BY_ID('events', eventId)
    }, [ GET_BY_ID, eventId ])
    useEffect(() => {
        if (!isLoading && data) setEvent(data[ 0 ])
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
                        created at { getTimeDistance(event, currentDate) } ago.
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