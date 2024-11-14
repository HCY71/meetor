import { forwardRef } from "react"
import { Select, useColorMode } from "@chakra-ui/react"
import { colors } from "@/public/theme"
import { timezoneNames } from "@/public/utils/timezoneNames"

const CustomSelect = forwardRef(({ id, placeholder, onChange, ...props }, ref) => {
    const { colorMode } = useColorMode()
    return (
        <Select
            id={ id }
            placeholder={ placeholder }
            onChange={ onChange }
            focusBorderColor={ colors[ colorMode ].border.focus }
            fontWeight='medium'
            fontSize='1rem'
            size='lg'
            borderColor={ 'gray.200' }
            ref={ ref }
            { ...props }
        >
            { timezoneNames.map((tz) => (
                <option value={ tz } key={ tz }>{ tz }</option>
            )) }
        </Select>
    )
})

CustomSelect.displayName = 'CustomSelect'


export default CustomSelect