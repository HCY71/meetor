import { forwardRef } from "react"
import { Input } from "@chakra-ui/react"

const CustomInput = forwardRef(({ id, placeholder, onChange, ...props }, ref) => {
    return (
        <Input
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
        />
    )
})

CustomInput.displayName = 'CustomInput'


export default CustomInput
