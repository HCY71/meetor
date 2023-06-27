import { HStack, Center, FormControl, FormErrorMessage, useColorMode } from "@chakra-ui/react"
import { FieldArray, useFormikContext } from "formik"
import useToday from "@/hooks/useDate"
import { colors } from "@/public/theme"

const Days = () => {
    const { values, errors, touched } = useFormikContext()
    const { days, today } = useToday()
    const { colorMode } = useColorMode()

    const toggler = (helper, isThere, index, day) => {
        if (isThere) helper.remove(index)
        else helper.push(day)
    }
    return (
        <FormControl isInvalid={ errors.days && touched.days }>
            <HStack w='100%' spacing={ 1 }>
                <FieldArray
                    name="days"
                    render={ arrayHelpers => (
                        <>
                            { days.map(day => (
                                <Center
                                    key={ day }
                                    border={ colors[ colorMode ].border.buttonGhost }
                                    borderRadius='md'
                                    p={ 2 }
                                    w='100%'
                                    fontWeight={ values.days.includes(day) ? 'bold' : (days[ today.day ] === day ? 'bold' : 'normal') }
                                    cursor='pointer'
                                    userSelect='none'
                                    _active={ {
                                        transform: 'scale(.95)'
                                    } }
                                    bg={ values.days.includes(day) ? colors[ colorMode ].bg.invert : 'transparent' }
                                    color={ values.days.includes(day) ? colors[ colorMode ].font.invert : colors[ colorMode ].font.primary }
                                    transition='.2s'
                                    onClick={ () => toggler(arrayHelpers, values.days.includes(day), values.days.indexOf(day), day) }
                                >
                                    { day }
                                </Center>
                            )) }
                        </>
                    ) }
                />
            </HStack>
            <FormErrorMessage>
                { errors.days }
            </FormErrorMessage>
        </FormControl>
    )
}

export default Days