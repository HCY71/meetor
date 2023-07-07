import { useState, useEffect } from 'react'
import { HStack, Center, FormControl, FormErrorMessage, useColorMode } from "@chakra-ui/react"
import { FieldArray, useFormikContext } from "formik"
import useToday from "@/hooks/useDate"
import { colors } from "@/public/theme"
import { useLang } from "@/context/LangContext"
import { checkWeekStart } from "@/public/utils/timeFormat"
import { useConfigs } from "@/context/ConfigsContext"

import SelectionArea from "@viselect/react"
import useDragSelect from "@/hooks/useDragSelect"

const Days = () => {
    const { values, errors, touched, setFieldValue } = useFormikContext()
    const { today } = useToday()
    const { colorMode } = useColorMode()
    const { context } = useLang()
    const { configs } = useConfigs()

    const { onMove } = useDragSelect()
    const [ selectedDays, setSelectedDays ] = useState([])

    useEffect(() => {
        setFieldValue('days', selectedDays)
    }, [ selectedDays ])

    return (
        <FormControl isInvalid={ errors.days && touched.days }>
            <SelectionArea
                className="container"
                onMove={ (e) => onMove(e, setSelectedDays) }
                selectables=".selectable"
                features={ { singleTap: { intersect: 'touch' } } }
            >
                <HStack w='100%' spacing={ 1 }>
                    <FieldArray
                        name="days"
                        render={ () => (
                            <>
                                { checkWeekStart(context.global.weekdays, configs.weekStartsOn).map(day => (
                                    <Center
                                        className='selectable'
                                        id={ day }
                                        key={ day }
                                        border={ colors[ colorMode ].border.buttonGhost }
                                        borderRadius='md'
                                        p={ 2 }
                                        w='100%'
                                        fontWeight={ values.days.includes(day) ? 'bold' : (context.global.weekdays[ today.day ] === day ? 'bold' : 'normal') }
                                        cursor='pointer'
                                        userSelect='none'
                                        _active={ {
                                            transform: 'scale(.95)'
                                        } }
                                        bg={ values.days.includes(day) ? colors[ colorMode ].bg.invert : 'transparent' }
                                        color={ values.days.includes(day) ? colors[ colorMode ].font.invert : colors[ colorMode ].font.primary }
                                        transition='.2s'
                                        fontSize={ { base: '.875rem', md: '1rem' } }
                                    >
                                        { day }
                                    </Center>
                                )) }
                            </>
                        ) }
                    />
                </HStack>
            </SelectionArea>
            <FormErrorMessage>
                { errors.days }
            </FormErrorMessage>
        </FormControl>
    )
}

export default Days