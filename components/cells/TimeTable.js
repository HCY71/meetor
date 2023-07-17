import { useEffect, useState, forwardRef, useRef, use } from "react"
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
import { getMonthAndDate, displayTime, displayDay, getFullDateAndTime, translateDay, reorderSunDay } from '@/public/utils/timeFormat'
import CustomTag from "../atoms/CustomTag"

import { colors } from "@/public/theme"

import useSupabase from "@/hooks/useSupabase"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useParams } from "next/navigation"
import { useConfigs } from "@/context/ConfigsContext"
import { useLang } from "@/context/LangContext"
import { useTouchDevices } from "@/hooks/useTouchDevices"

import { motion } from "framer-motion"

import { toast } from "react-hot-toast"

const TimeTable = ({ readOnly }) => {
    const { GET_BY_ID, POST_USER_TIME, SUBSCRIBE, data, isLoading } = useSupabase()
    const { eventId } = useParams()
    const [ user ] = useLocalStorage('name')
    const [ range, setRange ] = useState([])
    const [ dates, setDates ] = useState([])
    const [ type, setType ] = useState('dates')
    const [ allDayMode, setAllDayMode ] = useState(false)
    const [ selectedTime, setSelectedTime ] = useState([])
    const [ groupTime, setGroupTime ] = useState({})
    const [ users, setUsers ] = useState([])
    const { configs } = useConfigs()
    const { context } = useLang()

    const selectingMode = useRef('init')
    const selection = useRef({ start: null, end: null })

    useEffect(() => {
        GET_BY_ID('events', eventId)

        if (readOnly) {
            SUBSCRIBE('events', setUsers)
        }

    }, [ GET_BY_ID, SUBSCRIBE, readOnly, eventId ])

    // init data
    useEffect(() => {
        if (data && data?.length && selectingMode.current === 'init') {
            setRange(data[ 0 ].range)
            setType(data[ 0 ].type)
            setUsers(data[ 0 ].users)
            setAllDayMode(data[ 0 ].allDay)
            if (data[ 0 ].type === 'dates') setDates(data[ 0 ].dates || [])
            else setDates(data[ 0 ].days || [])
            if (user !== '') setSelectedTime(data[ 0 ].users?.find(u => u.user === user)?.time || [])
        }
    }, [ data, user ])

    // update
    useEffect(() => {
        if (selectedTime !== null && !selectingMode.current && !isLoading) {
            const uniqueTime = [ ...new Set(selectedTime) ]
            POST_USER_TIME(eventId, { user, time: uniqueTime })
            // toast.promise(
            //     {
            //         loading: context.global.toast.loading,
            //         success: context.global.toast.saved,
            //         error: context.global.toast.error,
            //     }
            // )
        }
    }, [ selectedTime, POST_USER_TIME, user, eventId, selectingMode.current ])

    useEffect(() => {
        if (readOnly) checkGroupTime()
    }, [ users ])

    const { colorMode } = useColorMode()

    const times = Array.from(
        { length: (range[ 1 ] - range[ 0 ]) / .5 + 1 },
        (value, index) => range[ 0 ] + index * .5
    )
    const timesCopy = [ ...times ]
    timesCopy.pop()

    const table = timesCopy.map(t => {
        if (type === 'dates') return dates.map(d => d + '-' + t)
        if (configs.weekStartsOn === 0) return dates.map(d => d + "-" + t)

        if (configs.weekStartsOn === 1) {
            const reordered = reorderSunDay(dates, configs.weekStartsOn)
            return reordered.map(d => {
                return d + "-" + t
            })
        }
    })

    const checkIsSelect = (from, d) => {
        return from.some(t => t === d)
    }

    const checkInRange = (from, to, key) => {
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

    // auto select
    useEffect(() => {
        if (selectingMode.current === 'add') {
            const result = table.map((t, indexRow) => t.filter((d, indexCol) => checkInRange(selection.current.start, selection.current.end, { row: indexRow, col: indexCol }) && !checkIsSelect(selectedTime, d)))
            const cleanedResult = result.flat()
            setSelectedTime(prev => [ ...prev, ...cleanedResult ])
        }
        else if (selectingMode.current === 'remove') {
            const result = table.map((t, indexRow) => t.filter((d, indexCol) => checkInRange(selection.current.start, selection.current.end, { row: indexRow, col: indexCol }) && checkIsSelect(selectedTime, d)))
            const cleanedResult = result.flat()
            setSelectedTime(prev => prev.filter(t => !cleanedResult.includes(t)))
        }
    }, [ selection.current.start, selection.current.end, selectingMode.current ])

    if (allDayMode) return (
        <Center fontWeight='bold' fontSize='12px' margin={ '0 auto' } >
            <VStack
                spacing={ 0 }
                pt={ '0rem' }
                pos={ 'absolute' }
                left={ { base: '-0px', md: '-50px' } }
                top='5px'
                zIndex={ 1 }
            >
                <Center h={ type === 'dates' ? '35px' : '20px' } />
                <Center
                    h={ { base: '60px', md: '70px' } }
                    borderRadius='sm'
                    border={ { base: colors[ colorMode ].border.table, md: "none" } }
                    bg={ { base: colors[ colorMode ].bg.nav.primary, md: "none" } }
                    p='2px'
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
                    gridTemplateRows={ `repeat(${times.length}, auto)` }
                    gridTemplateColumns={ `repeat(${dates.length}, 1fr)` }
                    w='100%'
                    h='fit-content'
                >
                    { type === 'dates' ?
                        dates.map((d, id) => (<GridItem key={ d + id } w='100%' minW={ { base: '100px' } } mb='8px'>
                            <Center>{ getMonthAndDate(d, configs.lang) }</Center>
                            <Center>{ displayDay(d, configs.lang) }</Center>
                        </GridItem>)) :
                        reorderSunDay(dates, configs.weekStartsOn).map((d, id) => (
                            <GridItem key={ d + id } mb='8px' >
                                <Center>{ translateDay(d, configs.lang) }</Center>
                            </GridItem>
                        ))
                    }
                    { dates.map((d, indexCol) =>
                    (readOnly ?
                        <GridGroupPopover
                            id={ d }
                            key={ d + indexCol }
                            index={ 0 }
                            borderBottom={ colors[ colorMode ].border.table }
                            bg={ generateColors(groupTime[ d ]?.length / users?.length, colorMode === 'dark') }

                            whoIs={ groupTime[ d ] }

                            users={ users }
                            type={ type }

                            allDayMode={ allDayMode }
                        />
                        :
                        <GridItemTemplate
                            id={ d }
                            key={ d + indexCol }
                            index={ 0 }
                            borderBottom={ colors[ colorMode ].border.table }

                            bg={ checkIsSelect(selectedTime, d) ? colors[ colorMode ].bg.timetableSelected : 'transparent' }

                            onPointerDown={ (e) => {
                                e.preventDefault()
                                selectingMode.current = checkIsSelect(selectedTime, d) ? 'remove' : 'add'
                                if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d)) setSelectedTime(prev => [ ...prev, d ])
                                else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d))

                                selection.current = { start: { row: 0, col: indexCol }, end: null }
                                e.currentTarget.releasePointerCapture(e.pointerId)

                                document.addEventListener('pointerup', () => {
                                    if (selectingMode.current === 'remove') {
                                        setSelectedTime(prev => prev.filter(t => t !== d))
                                    }
                                    selectingMode.current = null
                                }, { once: true })

                            } }
                            onPointerOver={ () => {
                                if (selectingMode.current) {
                                    if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d)) setSelectedTime(prev => [ ...prev, d ])
                                    else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d))
                                    selection.current = { start: selection.current.start, end: { row: 0, col: indexCol } }
                                }
                            } }
                        />
                    )) }
                </Grid>
            </VStack>
        </Center >
    )
    return (
        <Center fontWeight='bold' fontSize='12px' margin={ '0 auto' } >
            <VStack
                spacing={ 0 }
                pt={ '0rem' }
                pos={ 'absolute' }
                left={ { base: '-0px', md: '-48px' } }
                top='5px'
                zIndex={ 1 }
                alignItems={ { base: 'flex-start', md: 'center' } }
            >
                <Center h={ type === 'dates' ? '35px' : '20px' } />
                { times.map(t => (
                    t % 1 === 0 &&
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
                    </Center>
                )) }
            </VStack>
            <VStack w='100%' className="time-table" overflowX='auto' pos='relative' p='0 4px 8px 0px' alignItems='flex-start' minH='300px'>
                <Grid
                    gridTemplateRows={ `repeat(${times.length}, auto)` }
                    gridTemplateColumns={ `repeat(${dates.length}, 1fr)` }
                    w='100%'
                    h='fit-content'
                >
                    { type === 'dates' ?
                        dates.map((d, id) => (<GridItem key={ d + id } w='100%' minW={ { base: '100px' } } mb='8px'>
                            <Center>{ getMonthAndDate(d, configs.lang) }</Center>
                            <Center>{ displayDay(d, configs.lang) }</Center>
                        </GridItem>)) :
                        reorderSunDay(dates, configs.weekStartsOn).map((d, id) => (
                            <GridItem key={ d + id } mb='8px' >
                                <Center>{ translateDay(d, configs.lang) }</Center>
                            </GridItem>
                        ))
                    }
                    { table.map((data, indexRow) =>
                        data.map((d, indexCol) =>
                        (readOnly ?
                            <GridGroupPopover
                                id={ d }
                                key={ d + indexCol }
                                index={ indexRow }
                                bg={ generateColors(groupTime[ d ]?.length / users?.length, colorMode === 'dark') }

                                whoIs={ groupTime[ d ] }

                                users={ users }
                                type={ type }
                            />
                            :
                            <GridItemTemplate
                                id={ d }
                                key={ d + indexCol }
                                index={ indexRow }

                                bg={ checkIsSelect(selectedTime, d) ? colors[ colorMode ].bg.timetableSelected : 'transparent' }

                                onPointerDown={ (e) => {
                                    e.preventDefault()
                                    selectingMode.current = checkIsSelect(selectedTime, d) ? 'remove' : 'add'
                                    if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d)) setSelectedTime(prev => [ ...prev, d ])
                                    else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d))

                                    selection.current = { start: { row: indexRow, col: indexCol }, end: null }
                                    e.currentTarget.releasePointerCapture(e.pointerId)

                                    document.addEventListener('pointerup', () => {
                                        if (selectingMode.current === 'remove') {
                                            setSelectedTime(prev => prev.filter(t => t !== d))
                                        }
                                        selectingMode.current = null
                                    }, { once: true })

                                } }
                                onPointerOver={ () => {
                                    if (selectingMode.current) {
                                        if (selectingMode.current === 'add' && !checkIsSelect(selectedTime, d)) setSelectedTime(prev => [ ...prev, d ])
                                        else if (selectingMode.current === 'remove') setSelectedTime(prev => prev.filter(t => t !== d))
                                        selection.current = { start: selection.current.start, end: { row: indexRow, col: indexCol } }
                                    }
                                } }
                            />
                        ))
                    )
                    }
                </Grid>
            </VStack>
        </Center >
    )
}

const GridGroupPopover = ({ whoIs, users, type, allDayMode, ...props }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { configs } = useConfigs()
    const { context } = useLang()
    const { isTouch } = useTouchDevices()
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
                    onTapStart={ isTouch ? onOpen : null }
                    onTapCancel={ isTouch ? onClose : null }
                    onMouseOver={ isTouch ? null : onOpen }
                    onMouseLeave={ isTouch ? null : onClose }
                    { ...props }
                />
            </PopoverTrigger>

            <PopoverContent w='fit-content'>
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
                        <Text>{ getFullDateAndTime(props.id + '-', type, configs.lang) }</Text>
                        :
                        <Text>{ getFullDateAndTime(props.id, type, configs.lang) + context.global.timeTable.at + displayTime(props.id.slice(props.id.lastIndexOf('-') + 1, props.id.length), configs.usePM) }</Text>
                    }
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody>
                    <HStack>
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
            borderBottom={ props.index % 2 === 0 ? 'none' : colors[ colorMode ].border.table }
            borderTop={ props.index % 2 === 0 ? colors[ colorMode ].border.table : colors[ colorMode ].border.table2 }
            ref={ ref }
            { ...props }
        >
            <Center color='transparent' userSelect='none' />
        </GridItem>
    )
})

GridItemTemplate.displayName = 'GridItemTemplate'



export default TimeTable