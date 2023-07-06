import { useEffect, useState, forwardRef } from "react"
import {
    Center,
    Text,
    Grid,
    GridItem,
    VStack,
    HStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    useDisclosure,
    useColorMode
} from "@chakra-ui/react"
import { getMonthAndDate, displayTime, displayDay, getFullDateAndTime, translateDay } from '@/public/utils/timeFormat'
import CustomTag from "../atoms/CustomTag"

import { colors } from "@/public/theme"

import useSupabase from "@/hooks/useSupabase"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useParams } from "next/navigation"
import { useConfigs } from "@/context/ConfigsContext"
import { useLang } from "@/context/LangContext"

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
    const [ groupTime, setGroupTime ] = useState({})
    const [ users, setUsers ] = useState([])
    const { configs } = useConfigs()

    const { onMove } = useDragSelect()

    useEffect(() => {
        GET_BY_ID('events', eventId)

        if (readOnly) {
            SUBSCRIBE('events', setUsers)
        }

    }, [ GET_BY_ID, SUBSCRIBE, readOnly, eventId ])

    useEffect(() => {
        if (data && data?.length) {
            setRange(data[ 0 ].range)
            setType(data[ 0 ].type)
            setUsers(data[ 0 ].users)
            if (data[ 0 ].type === 'dates') setDates(data[ 0 ].dates || [])
            else setDates(data[ 0 ].days || [])
            if (user !== '') setSelectedTime(data[ 0 ].users?.find(u => u.user === user)?.time || [])
        }
    }, [ data, user ])

    useEffect(() => {
        if (selectedTime !== null) POST_USER_TIME(eventId, { user, time: selectedTime })
    }, [ selectedTime, POST_USER_TIME, user, eventId ])

    useEffect(() => {
        checkGroupTime()
    }, [ users ])

    const { colorMode } = useColorMode()

    const times = Array.from(
        { length: (range[ 1 ] - range[ 0 ]) / .5 + 1 },
        (value, index) => range[ 0 ] + index * .5
    )
    const timesCopy = [ ...times ]
    timesCopy.pop()

    const table = timesCopy.map(t =>
        dates.map(d => {
            return d + "-" + t
        })
    )

    const checkIsSelect = (from, d) => {
        return from.some(t => t === d)
    }

    const checkGroupTime = () => {
        const group = {}
        if (users) users.forEach(u => {
            u.time.forEach(t => {
                if (group[ t ]) group[ t ].push(u.user)
                else group[ t ] = [ u.user ]
            })
        })
        setGroupTime(group)
    }

    const generateColors = (percent, isDark) => {

        if (isNaN(percent)) return 'transparent'
        if (isDark) return `hsla(47, 81%, ${(61 * percent)}%, ${percent * .8 + 20})`
        else return `hsla(51, 89%, ${(100 - 33 * percent)}%, ${percent * .8 + 20})`
    }


    return (
        <Center fontWeight='bold' fontSize='12px' margin={ '0 auto' } pos='relative'>
            <VStack spacing={ 0 } pt={ '0rem' } pos={ 'absolute' } left='-50px' top='5px' h='101.3%' >
                { times.map(t => (
                    t % 1 === 0 &&
                    <Center key={ t } h='100%'>
                        { displayTime(t, configs.usePM) }
                    </Center>
                )) }
            </VStack>
            <VStack w='100%' className="time-table" overflowX='auto' pos='relative' p='0 0px 8px 0px' alignItems='flex-start'>
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
                        { dates.map(d => (
                            type === 'dates' ?
                                <GridItem key={ d } w='100%' minW='100px'>
                                    <Center>{ getMonthAndDate(d, configs.lang) }</Center>
                                    <Center>{ displayDay(d, configs.lang) }</Center>
                                </GridItem> :
                                <GridItem key={ d } >
                                    <Center>{ translateDay(d, configs.lang) }</Center>
                                </GridItem>
                        )) }
                        { table.map((data, indexRow) =>
                            data.map(d =>
                            (readOnly ?
                                <GridPopover
                                    id={ d }
                                    key={ d }
                                    index={ indexRow }
                                    bg={ generateColors(groupTime[ d ]?.length / users?.length, colorMode === 'dark') }

                                    whoIs={ groupTime[ d ] }
                                    users={ users }
                                    type={ type }
                                /> :
                                <GridItemTemplate
                                    id={ d }
                                    key={ d }
                                    index={ indexRow }

                                    bg={ checkIsSelect(selectedTime, d) ? colors[ colorMode ].bg.timetableSelected : 'transparent' }
                                />)
                            )
                        ) }
                    </Grid>
                </SelectionArea>
            </VStack>
        </Center>
    )
}

const GridPopover = ({ whoIs, users, type, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { configs } = useConfigs()
    const { context } = useLang()

    return (
        <Popover
            returnFocusOnClose={ false }
            isOpen={ isOpen }
            onClose={ onClose }
            closeOnBlur={ true }
            isLazy
            lazyBehavior='unmount'
        >
            <PopoverTrigger>
                <GridGroupTime
                    onClick={ onOpen }
                    onMouseOver={ onOpen }
                    onMouseLeave={ onClose }
                    { ...props }
                />
            </PopoverTrigger>

            <PopoverContent w='fit-content'>
                <PopoverHeader fontWeight='semibold'>
                    { users &&
                        <HStack spacing={ 1 }>
                            <Text fontWeight='bold'>
                                { `${whoIs?.length ? whoIs.length : 0} / ${users?.length}` }
                            </Text>
                            <Text>
                                { context.global.timeTable.available }
                            </Text>
                        </HStack>
                    }
                    <Text>{ getFullDateAndTime(props.id, type, configs.lang) + context.global.timeTable.at + displayTime(props.id.slice(props.id.lastIndexOf('-') + 1, props.id.length), configs.usePM) }</Text>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody>
                    <HStack>
                        { users &&
                            users.map(u =>
                                <CustomTag key={ u.user } isGhost={ !whoIs?.some(w => w === u.user) }>
                                    { u.user }
                                </CustomTag>
                            ) }
                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

const GridGroupTime = forwardRef(({ ...props }, ref) => {
    return (
        <GridItemTemplate
            ref={ ref }
            { ...props }
        />
    )
})

GridGroupTime.displayName = 'GridGroupTime'

const GridItemTemplate = forwardRef(({ ...props }, ref) => {
    const { colorMode } = useColorMode()
    return (
        <GridItem
            className="selectable"
            w='100%'
            minW='100px'
            border={ colors[ colorMode ].border.table }
            p={ '4px 8px' }
            borderRadius='sm'
            transition='.2s'
            borderBottom={ props.index % 2 === 0 ? 'none' : colors[ colorMode ].border.table }
            borderTop={ props.index % 2 === 0 ? colors[ colorMode ].border.table : colors[ colorMode ].border.table2 }
            ref={ ref }
            { ...props }
        >
            <Center color='transparent' userSelect='none'>
                ITS TIME
            </Center>
        </GridItem>
    )
})

GridItemTemplate.displayName = 'GridItemTemplate'



export default TimeTable