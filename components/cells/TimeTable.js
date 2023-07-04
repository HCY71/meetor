import { useEffect, useState } from "react"
import { Center, Grid, GridItem, VStack, useColorMode } from "@chakra-ui/react"
import { getMonthAndDate, displayTime, displayDay } from '@/public/utils/timeFormat'

import { colors } from "@/public/theme"

import useSupabase from "@/hooks/useSupabase"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useParams } from "next/navigation"
import { useConfigs } from "@/context/ConfigsContext"

import SelectionArea from '@viselect/react'
import useDragSelect from "@/hooks/useDragSelect"

const TimeTable = ({ readOnly }) => {
    const { GET_BY_ID, POST_USER_TIME, SUBSCRIBE, data } = useSupabase()
    const { eventId } = useParams()
    const [ user ] = useLocalStorage('name')
    const [ range, setRange ] = useState([])
    const [ dates, setDates ] = useState([])
    const [ type, setType ] = useState('dates')
    const [ selectedTime, setSelectedTime ] = useState([])
    const { configs } = useConfigs()

    const { onMove } = useDragSelect()

    useEffect(() => {
        GET_BY_ID('events', eventId)

        if (readOnly) {
            // SUBSCRIBE('events', 'eventId', eventId)
        }

    }, [ GET_BY_ID, SUBSCRIBE, readOnly, eventId ])

    useEffect(() => {
        if (data && data?.length) {
            setRange(data[ 0 ].range || [])
            setType(data[ 0 ].type)
            if (data[ 0 ].type === 'dates') setDates(data[ 0 ].dates || [])
            else setDates(data[ 0 ].days || [])
            if (user !== '') setSelectedTime(data[ 0 ].users?.find(u => u.user === user)?.time || [])
        }
    }, [ data, user ])

    useEffect(() => {
        if (selectedTime !== null) POST_USER_TIME(eventId, { user, time: selectedTime })
    }, [ selectedTime, POST_USER_TIME, user, eventId ])

    const { colorMode } = useColorMode()

    const times = Array.from(
        { length: (range[ 1 ] - range[ 0 ]) / .5 + 1 },
        (value, index) => range[ 0 ] + index * .5
    )
    const timesCopy = [ ...times ]
    timesCopy.pop()

    const table = timesCopy.map((t, idRow) =>
        dates.map((d, idCol) => {
            return d + "-" + t
        })
    )

    const checkIsSelect = (d) => {
        return selectedTime.some(t => t === d)
    }

    return (
        <VStack w='100%' pos='relative' fontWeight='bold' fontSize='12px'>
            <Grid w='100%' gridTemplateColumns={ `repeat(${dates.length}, 1fr)` }>
                { dates.map(d => (
                    type === 'dates' ?
                        <GridItem key={ d } >
                            <Center>{ getMonthAndDate(d, configs.lang) }</Center>
                            <Center>{ displayDay(d, configs.lang) }</Center>
                        </GridItem> :
                        <GridItem key={ d } >
                            <Center>{ d }</Center>
                        </GridItem>
                )) }
            </Grid>
            <VStack h='100%' justifyContent='space-around' pos='absolute' left='-52px' spacing={ 0 } pt={ '0rem' }>
                { times.map(t => (
                    t % 1 === 0 &&
                    <Center key={ t } h='100%' >
                        { displayTime(t, configs.usePM) }
                    </Center>
                )) }
            </VStack>
            <SelectionArea
                className="container"
                onMove={ readOnly ? null : (e) => onMove(e, setSelectedTime) }
                selectables=".selectable"
            >
                <Grid
                    gridTemplateRows={ `repeat(${times.length}, 1fr)` }
                    gridTemplateColumns={ `repeat(${dates.length}, 1fr)` }
                    w='100%'
                >
                    { table.map((data, indexRow) =>
                        data.map((d, indexCol) =>
                            <GridItem
                                key={ indexCol }
                                border={ colors[ colorMode ].border.table }
                                borderBottom={ indexRow % 2 === 0 ? 'none' : colors[ colorMode ].border.table }
                                borderTop={ indexRow % 2 === 0 ? colors[ colorMode ].border.table : colors[ colorMode ].border.table2 }
                                p={ '4px 8px' }
                                borderRadius='sm'
                                transition='.2s'

                                bg={ checkIsSelect(d) ? colors[ colorMode ].bg.timetableSelected : 'transparent' }

                                className="selectable"
                                id={ d }
                            >
                                <Center color='transparent' userSelect='none'>
                                    ITS TIME
                                </Center>
                            </GridItem>
                        )
                    ) }
                </Grid>
            </SelectionArea>
        </VStack>
    )
}

export default TimeTable