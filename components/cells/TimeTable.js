import { useEffect, useState, forwardRef, useRef } from "react"
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
import {
    getMonthAndDate,
    displayTime,
    displayDay,
    getFullDateAndTime,
    adjustDatesToLocal,
    adjustDaysToLocal,
    combineDateAndTime,
    combineDaysAndTime,
    UTCTimeToLocalTime,
    translateDay,
    reorderSunDay,
    getUTCOffsetDifference,
    getLocalRange,
    getTimesFromRange,
    isDateSelectable,
    convertDaysToIndex
} from '@/public/utils/timeFormat'
import CustomTag from "../atoms/CustomTag"
import CustomButton from "../atoms/CustomButton"

import { colors } from "@/public/theme"

import useSupabase from "@/hooks/useSupabase"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useParams } from "next/navigation"
import { useConfigs } from "@/context/ConfigsContext"
import { useLang } from "@/context/LangContext"
import { useEvent } from "@/context/EventContext"
import { useTimezone } from "@/context/TimezoneContext"
import { useTouchDevices } from "@/hooks/useTouchDevices"
import { downloadObjectAsJson } from "@/lib/download"

import { format, addMinutes } from "date-fns"
import { tz } from "@date-fns/tz"

import { motion } from "framer-motion"

const TimeTable = ({ readOnly }) => {
    const event = useEvent()
    const { eventId } = useParams()

    const { POST_USER_TIME, SUBSCRIBE, isLoading, setIsLoading } = useSupabase()

    const [ user ] = useLocalStorage('meetor_name')

    const [ users, setUsers ] = useState(event.users)

    const { timezone, updateTimezone } = useTimezone()

    const [ localTimes, setLocalTimes ] = useState({
        dates: event.dates,
        days: event.days,
        range: event.range,
        times: [],
        dataWithTime: [],
    })

    const [ selectedTime, setSelectedTime ] = useState([])
    const [ groupTime, setGroupTime ] = useState({})
    const { configs } = useConfigs()
    const { context } = useLang()
    const { colorMode } = useColorMode()

    const selectingMode = useRef('init')
    const selection = useRef({ start: null, end: null })

    // initialize
    useEffect(() => {
        setIsLoading(false)
    }, [])

    // update localTimes when user timezone changes
    useEffect(() => {
        const updateLocalTimes = () => {
            const delta = getUTCOffsetDifference(event.timezone, timezone)
            const { localRange, dayChangeIndex, isRangeRearranged } = getLocalRange(event.range, delta)

            if (event.timezone !== timezone && dayChangeIndex !== 0 && !event.allDay) {
                let times
                const localTimes = getTimesFromRange(localRange)
                if (isRangeRearranged) {
                    times = getTimesFromRange([ 0, 24 ])
                    localTimes.shift()
                    localTimes.pop()
                    localTimes.pop()
                    times = times.filter(t => !localTimes.includes(t))
                } else {
                    times = localTimes
                }

                let dataWithTime = []
                let updatedDates = []
                let updatedDays = []
                // if these is change in day, adjust the dates or days
                if (event.type === 'dates') {
                    updatedDates = adjustDatesToLocal(event.dates, dayChangeIndex, isRangeRearranged)
                    dataWithTime = times.map((t, indexRow) => updatedDates.map((d, indexCol) => {
                        return {
                            indexRow,
                            indexCol,
                            data: combineDateAndTime(d, t, timezone, event.allDay)
                        }
                    }))
                } else {
                    // fallback to old data - days
                    const isOldData = isNaN(parseInt(event.days[ 0 ]))
                    const targetDays = isOldData ? event.days.map(d => convertDaysToIndex(d)) : event.days

                    updatedDays = reorderSunDay(adjustDaysToLocal(targetDays, dayChangeIndex, isRangeRearranged), configs.weekStartsOn)
                    dataWithTime = times.map((t, indexRow) => updatedDays.map((d, indexCol) => {
                        return {
                            indexRow,
                            indexCol,
                            data: combineDaysAndTime(d, t, timezone, event.allDay)
                        }
                    }))

                }
                setLocalTimes((prev) => {
                    return { ...prev, dates: updatedDates, days: updatedDays, range: localRange, times, dataWithTime: event.allDay ? dataWithTime.flat() : dataWithTime.slice(0, -1).flat() }
                })
            } else {
                // reset  if timezone is the same or dayChangeIndex===0
                const times = getTimesFromRange(localRange, event.allDay)

                let dataWithTime = []
                let targetDays = []

                if (event.type === 'dates') {
                    dataWithTime = times.map((t, indexRow) => event.dates.map((d, indexCol) => {
                        return {
                            indexRow,
                            indexCol,
                            data: combineDateAndTime(d, t, timezone, event.allDay)
                        }
                    }))

                } else {
                    // fallback to old data - days
                    const isOldData = isNaN(parseInt(event.days[ 0 ]))
                    targetDays = isOldData ? event.days.map(d => convertDaysToIndex(d)).sort((a, b) => a - b) : event.days


                    dataWithTime = times.map((t, indexRow) => reorderSunDay(targetDays, configs.weekStartsOn).map((d, indexCol) => {
                        return {
                            indexRow,
                            indexCol,
                            data: combineDaysAndTime(d, t, timezone, event.allDay)
                        }
                    }))
                }

                setLocalTimes((prev) => {
                    return {
                        ...prev,
                        range: localRange,
                        dates: event.dates,
                        days: targetDays,
                        times,
                        dataWithTime: event.allDay ? dataWithTime.flat() : dataWithTime.slice(0, -1).flat(),
                    }
                })
            }
        }
        updateLocalTimes()
    }, [ timezone, configs.weekStartsOn ])

    // get user selectedTime from event
    useEffect(() => {
        const userSelectedTime = event.users?.find(u => u.user === user)?.time

        if (userSelectedTime) {
            const convertedDates = event.type === 'dates' ? userSelectedTime.map(d => parseOldDateData(d)) : userSelectedTime.map(d => parseOldDayData(d))
            setSelectedTime(convertedDates)
        }
    }, [ user ])

    // set default timezone
    useEffect(() => {
        // set saved timezone to default
        if (event.allDay) {
            updateTimezone(event.timezone)
        }
        else if (user && event.users) {
            const savedTimezone = event.users.find(u => u.user === user)?.timezone
            if (savedTimezone) updateTimezone(savedTimezone)
        }
    }, [ user ])

    useEffect(() => {
        if (readOnly) {
            SUBSCRIBE('events', setUsers, eventId)
        }
    }, [ SUBSCRIBE, readOnly, eventId ])

    // update
    useEffect(() => {
        if (selectedTime !== null && !selectingMode.current && !isLoading) {
            const uniqueTime = [ ...new Set(selectedTime) ]
            POST_USER_TIME(eventId, { user, time: uniqueTime, timezone })
        }
    }, [ selectedTime, POST_USER_TIME, user, eventId, selectingMode.current ])

    useEffect(() => {
        if (readOnly) checkGroupTime()
    }, [ users ])

    // auto select
    useEffect(() => {
        const handleAutoSelect = () => {
            if (selectingMode.current === 'add') {
                if (event.allDay) {
                    const selected = localTimes.dataWithTime.filter((d) => checkIsInRange(selection.current.start, selection.current.end, { row: 0, col: d.indexCol }) && !checkIsSelect(selectedTime, d.data))
                        .map(d => d.data)

                    setSelectedTime(prev => [ ...prev, ...selected ])
                }
                else {
                    const selected = localTimes.dataWithTime
                        .filter((d) =>
                            checkIsInRange(selection.current.start, selection.current.end, { row: d.indexRow, col: d.indexCol }) && !checkIsSelect(selectedTime, d.data) && isDateSelectable(truthTable, d.data))
                        .map(d => d.data)
                    setSelectedTime(prev => [ ...prev, ...selected ])
                }
            }
            else if (selectingMode.current === 'remove') {
                const toBeRemoved = localTimes.dataWithTime
                    .filter((d) =>
                        checkIsInRange(selection.current.start, selection.current.end, { row: d.indexRow, col: d.indexCol }) && checkIsSelect(selectedTime, d.data))
                    .map(d => d.data)

                // in filter method, if the return value is true, it will be kept
                // !checkIsSelect means it is not in the toBeRemoved list -> it should be kept(true)
                setSelectedTime(prev => prev.filter(t => !checkIsSelect(toBeRemoved, t)))
            }
        }
        handleAutoSelect()
    }, [ selection.current.start, selection.current.end, selectingMode.current ])


    const times = getTimesFromRange(event.range, event.allDay)

    const truthTable = times.map(t => {
        if (event.allDay) return event.type === 'dates' ? event.dates : event.days
        if (event.type === 'dates') return event.dates.map(d => combineDateAndTime(d, t, event.timezone))
        else return reorderSunDay(event.days, configs.weekStartsOn).map(d => combineDaysAndTime(d, t, event.timezone))
    }).flat()

    const checkIsSelect = (from, dataWithTime) => {
        return from.some(t => t === dataWithTime)
    }

    const checkIsInRange = (from, to, key) => {
        if (from === null || to === null) return false
        const rowRange = [ from.row, to.row ].sort((a, b) => a - b)
        const colRange = [ from.col, to.col ].sort((a, b) => a - b)
        if (key.row >= rowRange[ 0 ] && key.row <= rowRange[ 1 ] && key.col >= colRange[ 0 ] && key.col <= colRange[ 1 ]) return true
        else return false
    }

    const checkGroupTime = () => {
        const group = {}

        if (users) users.forEach(u => {
            u.time.forEach(t => {
                // t = event.type === 'dates' ? parseOldDateData(t) : t
                t = event.type === 'dates' ? parseOldDateData(t) : parseOldDayData(t)

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

    // fallback to old data - dates
    const parseOldDateData = (d) => {
        try {
            // fallback to old data - dates - all day
            if (event.allDay && !d.includes('Z')) {
                const match = d.match(/(.*?)([+-]\d{1,2}(\.\d+)?$)/)
                if (match) return

                const delta = getUTCOffsetDifference('UTC', timezone)
                return new Date(addMinutes(new Date(d), delta * 60)).toISOString()
            }
            return new Date(d).toISOString()
        } catch {
            const [ dateTime, offset ] = d.split(/([+-]\d{1,2}(\.\d+)?$)/)
            return new Date(addMinutes(new Date(dateTime), Math.abs(parseFloat(offset)) * 60, { in: tz(timezone) })).toISOString()
        }
    }

    // fallback to old data - days
    const parseOldDayData = (d) => {
        const isOldData = isNaN(parseInt(d))
        if (isOldData && event.allDay) {
            return convertDaysToIndex(d)
        }
        if (isOldData) {
            const [ day, time ] = d.split('-')
            const delta = getUTCOffsetDifference('UTC', event.timezone)
            if (time - delta < 0) {
                if (convertDaysToIndex(day) === 0) return '6-' + (time - delta + 24)
                return convertDaysToIndex(day) - 1 + '-' + (time - delta + 24)
            } else if (time - delta >= 24) {
                if (convertDaysToIndex(day) === 6) return '0-' + (time - delta - 24)
                return convertDaysToIndex(day) + 1 + '-' + (time - delta - 24)
            }
            return convertDaysToIndex(day) + '-' + (time - delta)
        } else return d
    }

    if (event.allDay) return (
        <Center fontWeight='bold' fontSize='12px' margin={ '0 auto' } flexDir={ 'column' } gap={ 5 } alignItems={ 'flex-start' }>
            <VStack
                spacing={ 0 }
                pt={ '0rem' }
                pos={ 'absolute' }
                left={ { base: '-0px', md: '-50px' } }
                top={ event.type === 'dates' ? '40px' : '22px' }
                zIndex={ 1 }
            >
                <Center
                    h={ { base: '60px', md: '70px' } }
                    borderRadius='sm'
                    border={ { base: colors[ colorMode ].border.table, md: "none" } }
                    bg={ { base: colors[ colorMode ].bg.nav.primary, md: "none" } }
                    p={ '2px' }
                    top='-15px'
                    w={ { base: '30px', md: '50px' } }
                    textAlign='center'
                    whiteSpace='pre-wrap'
                >
                    { context.home.input.switch }
                </Center>
            </VStack>
            <VStack w='100%' className="time-table" overflowX='auto' pos='relative' p='0 4px 8px 0px' alignItems='flex-start' minH='300px'>
                <Grid
                    gridTemplateRows={ `repeat(${1}, auto)` }
                    gridTemplateColumns={ event.type === 'dates' ? `repeat(${localTimes.dates.length}, 1fr)` : `repeat(${localTimes.days.length}, 1fr)` }
                    w='100%'
                    h='fit-content'
                >
                    { event.type === 'dates' ?
                        localTimes.dates.map((d) => (
                            <GridItem key={ d } w='100%' minW={ { base: '100px' } } mb='8px'>
                                <Center>{ getMonthAndDate(d, configs.lang) }</Center>
                                <Center>{ displayDay(d, configs.lang) }</Center>
                            </GridItem>)) :
                        // fallback to old data - days
                        reorderSunDay(localTimes.days, configs.weekStartsOn).map((d) => (
                            <GridItem key={ d } mb='8px'>
                                <Center>{ translateDay(d, configs.lang) }</Center>
                            </GridItem>
                        ))
                    }
                    { localTimes.dataWithTime.map((d) => {
                        return (readOnly ?
                            <GridGroupPopover
                                id={ d.data }
                                key={ d.data }
                                index={ 0 }
                                borderBottom={ colors[ colorMode ].border.table }

                                bg={ generateColors(groupTime[ event.type === 'dates' ? new Date(d.data).toISOString() : d.data ]?.length / users?.length, colorMode === 'dark') }

                                whoIs={ groupTime[ event.type === 'dates' ? new Date(d.data).toISOString() : d.data ] }

                                users={ users }
                                type={ event.type }

                                allDayMode={ event.allDay }
                            />
                            :
                            <GridItemTemplate
                                id={ d.data }
                                key={ d.data }
                                index={ 0 }
                                borderBottom={ colors[ colorMode ].border.table }
                                bg={ checkIsSelect(selectedTime, d.data) ? colors[ colorMode ].bg.timetableSelected : 'transparent' }

                                onPointerDown={ (e) => {
                                    e.preventDefault()
                                    selectingMode.current = checkIsSelect(selectedTime, d.data) ? 'remove' : 'add'
                                    if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d.data)) setSelectedTime(prev => [ ...prev, d.data ])
                                    else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d.data))

                                    selection.current = { start: { row: 0, col: d.indexCol }, end: null }
                                    e.currentTarget.releasePointerCapture(e.pointerId)

                                    document.addEventListener('pointerup', () => {
                                        if (selectingMode.current === 'remove') {
                                            setSelectedTime(prev => prev.filter(t => t !== d.data))
                                        }
                                        selectingMode.current = null
                                    }, { once: true })

                                } }
                                onPointerOver={ () => {
                                    if (selectingMode.current) {
                                        if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d.data)) setSelectedTime(prev => [ ...prev, d.data ])
                                        else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d.data))
                                        selection.current = { start: selection.current.start, end: { row: 0, col: d.indexCol } }
                                    }
                                } }
                            />
                        )
                    }) }
                </Grid>
            </VStack>
            { (readOnly && users) &&
                <CustomButton onClick={ () => downloadObjectAsJson(users) } zIndex={ 10 } ghost>
                    { context.event.export }
                </CustomButton>
            }
        </Center >
    )
    return (
        <Center fontWeight='bold' fontSize='12px' margin={ '0 auto' } flexDir={ 'column' } gap={ 5 } alignItems={ 'flex-start' }>
            <VStack
                spacing={ 0 }
                pt={ '0rem' }
                pos={ 'absolute' }
                left={ { base: '-0px', md: '-48px' } }
                top={ localTimes.times[ 0 ] % 1 === 0 ? { base: '14px', md: '5px' } : '36px' }
                zIndex={ 1 }
                alignItems={ { base: 'flex-start', md: 'center' } }
            >
                <Center h={ event.type === 'dates' ? '35px' : '20px' } />
                { localTimes.times.map((t, i, arr) => {
                    const hasBreakpoint = i < arr.length - 1 && arr[ i + 1 ] - t !== 0.5
                    return (t % 1 === 0 &&
                        <Center key={ t + '-time-col' } h={ { base: '60px', md: '70px' } } alignItems='flex-start'>
                            <Center
                                borderRadius='sm'
                                border={ { base: colors[ colorMode ].border.table, md: "none" } }
                                bg={ { base: colors[ colorMode ].bg.nav.primary, md: "none" } }
                                p='2px'
                                top='-10px'
                            >
                                { displayTime(t, configs.usePM) }
                            </Center>
                            { hasBreakpoint &&
                                <Center pos={ 'absolute' } color={ colors[ colorMode ].font.subtitle } top={ { base: '30px', md: '35px' } } transform={ 'translateY(-50%)' }>
                                    |
                                </Center>
                            }
                        </Center>
                    )
                }) }
            </VStack>
            <VStack w='100%' className="time-table" overflowX='auto' pos='relative' p='0 4px 8px 0px' alignItems='flex-start' minH='300px'>
                <Grid
                    gridTemplateRows={ `repeat(${localTimes.times.length}, auto)` }
                    gridTemplateColumns={ event.type === 'dates' ? `repeat(${localTimes.dates.length}, 1fr)` : `repeat(${localTimes.days.length}, 1fr)` }
                    w='100%'
                    h='fit-content'
                >
                    { event.type === 'dates' ?
                        localTimes.dates.map((d, id) =>
                        (<GridItem key={ d + id } w='100%' minW={ { base: '100px' } } mb={ { base: 4, md: 2 } }>
                            <Center>{ getMonthAndDate(d, configs.lang) }</Center>
                            <Center>{ displayDay(d, configs.lang) }</Center>
                        </GridItem>)) :
                        reorderSunDay(localTimes.days, configs.weekStartsOn).map((d) => (
                            <GridItem key={ d } mb={ { base: 4, md: 2 } }>
                                <Center>{ translateDay(d, configs.lang) }</Center>
                            </GridItem>
                        ))
                    }
                    { localTimes.dataWithTime.map((d) =>
                    (readOnly ?
                        <GridGroupPopover
                            id={ d.data }
                            key={ d.data }
                            index={ d.indexRow }

                            bg={ generateColors(groupTime[ event.type === 'dates' ? new Date(d.data).toISOString() : d.data ]?.length / users?.length, colorMode === 'dark') }
                            opacity={ isDateSelectable(truthTable, d.data) ? 1 : .1 }
                            whoIs={ groupTime[ event.type === 'dates' ? new Date(d.data).toISOString() : d.data ] }

                            users={ users }
                            type={ event.type }
                        />
                        :
                        <GridItemTemplate
                            id={ d.data }
                            key={ d.data }
                            index={ d.indexRow }
                            bg={ checkIsSelect(selectedTime, d.data) ? colors[ colorMode ].bg.timetableSelected : 'transparent' }
                            opacity={ isDateSelectable(truthTable, d.data) ? 1 : .1 }
                            onPointerDown={ (e) => {
                                if (!isDateSelectable(truthTable, d.data)) return
                                e.preventDefault()
                                selectingMode.current = checkIsSelect(selectedTime, d.data) ? 'remove' : 'add'

                                if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d.data)) setSelectedTime(prev => [ ...prev, d.data ])
                                else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d.data))

                                selection.current = { start: { row: d.indexRow, col: d.indexCol }, end: null }
                                e.currentTarget.releasePointerCapture(e.pointerId)

                                document.addEventListener('pointerup', () => {
                                    if (selectingMode.current === 'remove') {
                                        setSelectedTime(prev => prev.filter(t => t !== d.data))
                                    }
                                    selectingMode.current = null
                                }, { once: true })

                            } }
                            onPointerOver={ () => {
                                if (!isDateSelectable(truthTable, d.data)) return
                                if (selectingMode.current) {
                                    if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d.data)) setSelectedTime(prev => [ ...prev, d.data ])
                                    else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d.data))
                                    selection.current = { start: selection.current.start, end: { row: d.indexRow, col: d.indexCol } }
                                }
                            } }
                        />
                    )
                    ) }
                </Grid>
            </VStack>
            {
                (readOnly && users) &&
                <CustomButton onClick={ () => downloadObjectAsJson(users) } zIndex={ 10 } ghost>
                    { context.event.export }
                </CustomButton>
            }
        </Center >
    )
}

const GridGroupPopover = ({ whoIs, users, type, allDayMode, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { configs } = useConfigs()
    const { context } = useLang()
    const { isTouch } = useTouchDevices()
    const { colorMode } = useColorMode()
    const { timezone } = useTimezone()
    return (
        <Popover
            returnFocusOnClose={ false }
            isOpen={ isOpen }
            onClose={ onClose }
            closeOnBlur={ true }
            isLazy
            lazyBehavior='unmount'
            autoFocus={ false }
        >
            <PopoverTrigger>
                <GridGroupTime
                    as={ motion.div }
                    onHoverStart={ isTouch ? onOpen : null }
                    onHoverEnd={ isTouch ? onClose : null }
                    onMouseOver={ isTouch ? null : onOpen }
                    onMouseLeave={ isTouch ? null : onClose }
                    { ...props }
                />
            </PopoverTrigger>

            <PopoverContent w='fit-content' maxW='360px' bg={ colors[ colorMode ].bg.primary }>
                <PopoverHeader fontWeight='semibold'>
                    { users &&
                        <HStack spacing={ 1 }>
                            <Text fontWeight='bold'>
                                { whoIs?.length === users?.length ?
                                    context.global.timeTable.all
                                    :
                                    `${whoIs?.length ? whoIs.length : 0} / ${users?.length}`
                                }
                            </Text>
                            <Text>
                                { context.global.timeTable.available }
                            </Text>
                        </HStack>
                    }
                    { allDayMode ?
                        <Text>{ getFullDateAndTime(props.id, type, configs.lang) }</Text>
                        :
                        <Text>{ getFullDateAndTime(props.id, type, configs.lang)
                            + context.global.timeTable.at
                            + displayTime(type === 'dates'
                                ? format(props.id, 'HHmm', { in: tz(timezone) })
                                : UTCTimeToLocalTime(parseFloat(props.id.split("-")[ 1 ]), timezone),
                                configs.usePM) }</Text>
                    }
                </PopoverHeader>
                <PopoverArrow bg={ colors[ colorMode ].bg.primary } />
                <PopoverBody>
                    <HStack flexWrap='wrap'>
                        { users &&
                            users.map(u =>
                                <CustomTag key={ u.user + '-user-tag' } isGhost={ !whoIs?.some(w => w === u.user) }>
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
            className="no-touch-action"
            w='100%'
            minW='100px'
            h={ { base: '30px', md: '35px' } }

            border={ colors[ colorMode ].border.table }
            p={ '4px 8px' }
            borderRadius='sm'
            transition='.2s'
            borderBottom={ props.index % 2 === 0 ? colors[ colorMode ].border.table2 : colors[ colorMode ].border.table }
            borderTop={ props.index % 2 === 0 ? colors[ colorMode ].border.table : 'none' }
            ref={ ref }
            { ...props }
        >
            <Center color='transparent' userSelect='none' />
        </GridItem>
    )
})

GridItemTemplate.displayName = 'GridItemTemplate'



export default TimeTable