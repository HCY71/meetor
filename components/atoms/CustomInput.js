import { forwardRef } from "react"
import { Input, useColorMode } from "@chakra-ui/react"
import { colors } from "@/public/theme"

const CustomInput = forwardRef(({ id, placeholder, onChange, ...props }, ref) => {
    const { colorMode } = useColorMode()
    return (
        <Input
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
        />
    )
})

CustomInput.displayName = 'CustomInput'


export default CustomInput