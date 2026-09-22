import { forwardRef } from "react"
import { Input } from "@chakra-ui/react"

const CustomInput = forwardRef(({ id, placeholder, onChange, ...props }, ref) => {
    return (
        <Input
            id={ id }
            placeholder={ placeholder }
            onChange={ onChange }
            focusRingColor='ink.primary'
            fontWeight='medium'
            fontSize='1rem'
            size='lg'
            borderColor='border.subtle'
            // The explicit border colour above outranks the recipe's focus colour,
            // so the focused state is restated here: v2 turned the border ink and
            // doubled it with a 1px ring, on any focus rather than only keyboard focus
            _focus={ {
                borderColor: 'ink.primary',
                boxShadow: '0 0 0 1px var(--chakra-colors-ink-primary)',
            } }
            ref={ ref }
            { ...props }
        />
    )
})

CustomInput.displayName = 'CustomInput'


export default CustomInput
