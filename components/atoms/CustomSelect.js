import { forwardRef } from "react"
import { Select } from "@chakra-ui/react"
import { timezoneNames } from "@/public/utils/timezoneNames"

const CustomSelect = forwardRef(({ id, placeholder, onChange, ...props }, ref) => {
    return (
        <Select
            id={ id }
            placeholder={ placeholder }
            onChange={ onChange }
            focusBorderColor='ink.primary'
            fontWeight='medium'
            fontSize='1rem'
            size='lg'
            borderColor='border.subtle'
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
