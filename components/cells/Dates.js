import { useState, useEffect } from 'react'
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

import { colors } from '@/public/theme'

const Dates = () => {
    const [ dates, setDates ] = useState([])
    const [ size, setSize ] = useState(new Array(35).fill(0))
    const { values, errors, touched } = useFormikContext()
    const { days, currentDate, generateCalendar, monthControls } = useDate()

    const { colorMode } = useColorMode()

    const toggler = (helper, isThere, index, day) => {
        if (isThere) helper.remove(index)
        else helper.push(day)
    }
    useEffect(() => {
        if (currentDate.startOfMonth) {
            const result = size.map((s, index) => generateCalendar(currentDate.startOfMonth, index))
            setDates(result)
        }
    }, [ currentDate.startOfMonth, size, generateCalendar ])

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
                    fontSize='1.5rem'
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
                        p={ 1 }
                        border='solid 1px'
                        borderRadius='md'
                        onClick={ monthControls.goBack }
                        visibility={ isToday(currentDate.date) ? 'hidden' : 'visible' }
                        pos='absolute'
                        right='0'
                        transform='translateX(120%)'
                    >
                        BACK
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
            <HStack w='100%' color={ colors[ colorMode ].font.dim }>
                { days.map((d) =>
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
                    gridRowGap={ 1 }
                    gridColumnGap={ 1 }
                >
                    <FieldArray
                        name="dates"
                        render={ arrayHelpers => (
                            <>
                                { dates.length && dates.map(d =>
                                    <GridItem
                                        w='100%'
                                        p={ 3 }
                                        border='solid 2px rgba(0,0,0,0)'
                                        borderRadius='4px'
                                        color={
                                            values.dates.includes(formatISO(d)) ?
                                                colors[ colorMode ].font.invert :
                                                monthControls.isCurrentMonth(d) && !isPast(addDays(d, 1)) ? colors[ colorMode ].font.primary : colors[ colorMode ].font.dimMore
                                        }
                                        fontWeight={
                                            isToday(d) ? 'bold' : 'normal'
                                        }
                                        bg={ values.dates.includes(formatISO(d)) ? colors[ colorMode ].bg.invert : 'transparent' }
                                        textAlign='center'
                                        key={ d }
                                        onClick={
                                            !isPast(addDays(d, 1)) ?
                                                () => toggler(arrayHelpers, values.dates.includes(formatISO(d)), values.dates.indexOf(formatISO(d)), formatISO(d))
                                                : null
                                        }
                                        cursor={ !isPast(addDays(d, 1)) ? 'pointer' : null }
                                        userSelect='none'
                                        transition='.2s'
                                        _hover={ {
                                            borderColor: !isPast(addDays(d, 1)) ? colors[ colorMode ].bg.invert : 'rgba(0,0,0,0)'
                                        } }
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
        </VStack>
    )
}

const ControlIcon = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Icon as={ FaPlay } fontSize={ '32px' } color={ colors[ colorMode ].bg.invert } userSelect='none' { ...props } />
    )
}

export default Dates