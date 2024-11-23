import { useState, useRef, useEffect } from 'react'
import {
    Grid,
    GridItem,
    VStack,
    HStack,
    Center,
    Icon,
    FormControl,
    FormErrorMessage,
    useColorMode
} from "@chakra-ui/react"
import useDate from "@/hooks/useDate"
import { getDate, isToday, isPast, addDays, formatISO } from "date-fns"
import { FaPlay } from 'react-icons/fa'
import { FieldArray, useFormikContext } from "formik"
import { toast } from "react-hot-toast"

import { colors } from '@/public/theme'
import { useLang } from '@/context/LangContext'
import { useConfigs } from '@/context/ConfigsContext'
import { checkWeekStart, isDateInRange } from '@/public/utils/timeFormat'

const Dates = () => {
    const [ dates, setDates ] = useState([])
    const [ size, setSize ] = useState(new Array(35).fill(0))
    const { values, errors, touched, setFieldValue } = useFormikContext()
    const { currentDate, generateCalendar, monthControls } = useDate()

    const { colorMode } = useColorMode()
    const { context } = useLang()
    const { configs } = useConfigs()

    const [ selectedDates, setSelectedDates ] = useState([])

    const selectingMode = useRef(null)
    const selection = useRef({ start: null, end: null })

    useEffect(() => {
        if (currentDate.startOfMonth) {
            const result = size.map((s, index) => generateCalendar(currentDate.startOfMonth, index, configs.weekStartsOn))
            setDates(result)
        }
    }, [ currentDate.startOfMonth, size, generateCalendar, configs.weekStartsOn ])

    useEffect(() => {
        setFieldValue('dates', selectedDates)
    }, [ selectedDates ])

    // auto select dates
    useEffect(() => {
        if (dates.length && selectingMode.current === 'add') {

            const formattedDates = dates.filter(d => isDateInRange(selection.current.start, selection.current.end, formatISO(d)) && !isSelected(selectedDates, formatISO(d))).map(d => formatISO(d))
            setSelectedDates(prev => [ ...prev, ...formattedDates ])
        }
        else if (dates.length && selectingMode.current === 'remove') {
            const formattedDates = dates.filter(d => isDateInRange(selection.current.start, selection.current.end, formatISO(d)) && isSelected(selectedDates, formatISO(d))).map(d => formatISO(d))
            setSelectedDates(prev => prev.filter(t => !formattedDates.includes(t)))
        }
    }, [ selection.current.start, selection.current.end, selectingMode.current ])

    const handlePast = () => {
        toast(context.global.toast.selectPast, {
            icon: '😵‍💫',
        })
    }

    const isSelected = (values, date) => {
        return values.includes(date)
    }

    return (
        <VStack>
            <HStack
                justifyContent='space-between'
                w='100%'
                p={ 3 }
            >
                <Center
                    onClick={ monthControls.prevMonth }
                    visibility={ isPast(currentDate.date - 30) ? 'hidden' : 'visible' }
                    cursor='pointer'
                    transition='transform .2s'
                    _hover={ {
                        transform: 'scale(1.05)'
                    } }
                    _active={ {
                        transform: 'scale(.95)'
                    } }
                >
                    <ControlIcon transform='rotate(-180deg)' />
                </Center>
                <HStack
                    fontWeight='bold'
                    fontSize={ { base: '1rem', md: '1.5rem' } }
                    pos='relative'
                >
                    <Center>
                        { currentDate.monthAndYear }
                    </Center>
                    <Center
                        fontSize='0.75rem'
                        fontWeight='medium'
                        color={ colors[ colorMode ].font.dim }
                        borderColor={ colors[ colorMode ].bg.dim }
                        cursor='pointer'
                        p={ '4px 8px' }
                        border='solid 1px'
                        borderRadius='md'
                        onClick={ monthControls.goBack }
                        visibility={ isToday(currentDate.date) ? 'hidden' : 'visible' }
                        pos='absolute'
                        right='0'
                        transform='translateX(120%)'
                    >
                        { context.global.button.back }
                    </Center>
                </HStack>
                <Center
                    onClick={ monthControls.nextMonth }
                    cursor='pointer'
                    transition='transform .2s'
                    _hover={ {
                        transform: 'scale(1.05)'
                    } }
                    _active={ {
                        transform: 'scale(.95)'
                    } }
                >
                    <ControlIcon />
                </Center>
            </HStack>
            <HStack w='100%' color={ colors[ colorMode ].font.dim } fontSize={ { base: '.9rem', md: '1rem' } }>
                { checkWeekStart(context.global.weekdays, configs.weekStartsOn).map((d) =>
                    <Center w='100%' key={ d }>
                        { d }
                    </Center>
                ) }
            </HStack>
            <FormControl isInvalid={ errors.dates && touched.dates }>
                <Grid
                    w='100%'
                    gridTemplateRows='repeat(5,1fr)'
                    gridTemplateColumns='repeat(7,1fr)'
                    gridRowGap=' 2px'
                    gridColumnGap=' 2px'
                >
                    <FieldArray
                        name="dates"
                        render={ () => (
                            <>
                                { dates.length && dates.map(d =>
                                    <GridItem
                                        className='no-touch-action'

                                        w='100%'
                                        p={ 3 }
                                        border='solid 2px rgba(0,0,0,0)'
                                        borderRadius='4px'
                                        color={
                                            isSelected(values.dates, formatISO(d)) ?
                                                colors[ colorMode ].font.invert :
                                                monthControls.isCurrentMonth(d) && !isPast(addDays(d, 1)) ? colors[ colorMode ].font.primary : colors[ colorMode ].font.dimMore
                                        }
                                        fontWeight={
                                            isToday(d) ? 'bold' : 'normal'
                                        }
                                        bg={ isSelected(values.dates, formatISO(d)) ? colors[ colorMode ].bg.invert : 'transparent' }
                                        textAlign='center'
                                        key={ d }

                                        cursor={ !isPast(addDays(d, 1)) ? 'pointer' : null }
                                        userSelect='none'
                                        transition='.2s'
                                        _hover={ {
                                            borderColor: !isPast(addDays(d, 1)) ? colors[ colorMode ].bg.invert : 'rgba(0,0,0,0)'
                                        } }
                                        onPointerDown={
                                            !isPast(addDays(d, 1)) ?
                                                (e) => {
                                                    e.preventDefault()

                                                    selectingMode.current = isSelected(values.dates, formatISO(d)) ? 'remove' : 'add'
                                                    if (selectingMode.current === 'add') setSelectedDates(prev => [ ...prev, formatISO(d) ])
                                                    else if (selectingMode.current === 'remove') setSelectedDates(prev => prev.filter(t => t !== formatISO(d)))

                                                    // TODO: fix this
                                                    selection.current = { start: formatISO(d), end: formatISO(d) }
                                                    e.currentTarget.releasePointerCapture(e.pointerId)

                                                    document.addEventListener('pointerup', () => {
                                                        if (selectingMode.current === 'remove') {
                                                            setSelectedDates(prev => prev.filter(t => t !== formatISO(d)))
                                                        }

                                                        selectingMode.current = null


                                                    }, { once: true })

                                                } : handlePast
                                        }
                                        onPointerOver={
                                            !isPast(addDays(d, 1)) ?
                                                () => {
                                                    if (selectingMode.current) {
                                                        if (selectingMode.current === 'add' && !isSelected(values.dates, formatISO(d))) setSelectedDates(prev => [ ...prev, formatISO(d) ])
                                                        else if (selectingMode.current === 'remove') setSelectedDates(prev => prev.filter(t => t !== formatISO(d)))
                                                        selection.current = { start: selection.current.start, end: formatISO(d) }
                                                    }
                                                } : null
                                        }
                                    >
                                        { getDate(d) }
                                    </GridItem>
                                ) }
                            </>
                        ) }
                    />
                </Grid>
                <FormErrorMessage>
                    { errors.dates }
                </FormErrorMessage>
            </FormControl>
        </VStack >
    )
}

const ControlIcon = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Icon as={ FaPlay } fontSize={ '32px' } color={ colors[ colorMode ].bg.invert } userSelect='none' { ...props } />
    )
}

export default Dates