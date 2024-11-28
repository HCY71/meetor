import { useState, useEffect, useRef } from 'react'
import { HStack, Center, FormControl, FormErrorMessage, useColorMode } from "@chakra-ui/react"
import { FieldArray, useFormikContext } from "formik"
import useToday from "@/hooks/useDate"
import { colors } from "@/public/theme"
import { useLang } from "@/context/LangContext"
import { checkWeekStart } from "@/public/utils/timeFormat"
import { useConfigs } from "@/context/ConfigsContext"


const Days = () => {
    const { values, errors, touched, setFieldValue } = useFormikContext()
    const { today } = useToday()
    const { colorMode } = useColorMode()
    const { context } = useLang()
    const { configs } = useConfigs()

    const [ selectedDays, setSelectedDays ] = useState([])
    const selectingMode = useRef(null)
    const dayOptions = Array.from({ length: 7 }, (_, i) => i)

    useEffect(() => {
        setFieldValue('days', selectedDays)
    }, [ selectedDays ])

    const isSelected = (from, check) => {
        return from.includes(check)
    }
    return (
        <FormControl isInvalid={ errors.days && touched.days }>

            <HStack w='100%' spacing={ 1 }>
                <FieldArray
                    name="days"
                    render={ () => (
                        <>
                            { checkWeekStart(dayOptions, configs.weekStartsOn).map(day => (
                                <Center
                                    className='no-touch-action'
                                    id={ day }
                                    key={ day }
                                    border={ colors[ colorMode ].border.buttonGhost }
                                    borderRadius='md'
                                    p={ 2 }
                                    w='100%'
                                    fontWeight={ isSelected(values.days, day) ? 'bold' : (today.day === day ? 'bold' : 'normal') }
                                    cursor='pointer'
                                    userSelect='none'
                                    _active={ {
                                        transform: 'scale(.95)'
                                    } }
                                    bg={ isSelected(values.days, day) ? colors[ colorMode ].bg.invert : 'transparent' }
                                    color={ isSelected(values.days, day) ? colors[ colorMode ].font.invert : colors[ colorMode ].font.primary }
                                    transition='.2s'
                                    fontSize={ { base: '.875rem', md: '1rem' } }

                                    onPointerDown={ (e) => {
                                        e.preventDefault()
                                        selectingMode.current = isSelected(values.days, day) ? 'remove' : 'add'
                                        if (selectingMode.current === 'add' && !isSelected(values.days, day)) setSelectedDays(prev => [ ...prev, day ])
                                        else if (selectingMode.current === 'remove') setSelectedDays(prev => prev.filter(t => t !== day))

                                        // selection.current = { start: formatISO(d), end: null }
                                        e.currentTarget.releasePointerCapture(e.pointerId)

                                        document.addEventListener('pointerup', () => {
                                            if (selectingMode.current === 'remove') {
                                                setSelectedDays(prev => prev.filter(t => t !== day))
                                            }
                                            selectingMode.current = null
                                        }, { once: true })
                                    } }
                                    onPointerOver={ () => {
                                        if (selectingMode.current) {
                                            if (selectingMode.current === 'add' && !isSelected(values.days, day)) setSelectedDays(prev => [ ...prev, day ])
                                            else if (selectingMode.current === 'remove') setSelectedDays(prev => prev.filter(t => t !== day))
                                        }
                                    } }
                                >
                                    { context.global.weekdays[ day ] }
                                </Center>
                            )) }
                        </>
                    ) }
                />
            </HStack>

            <FormErrorMessage>
                { errors.days }
            </FormErrorMessage>
        </FormControl >
    )
}

export default Days