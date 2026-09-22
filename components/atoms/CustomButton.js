import { forwardRef } from "react"
import { Button } from "@chakra-ui/react"

const CustomButton = forwardRef(({ children, ghost, ...props }, ref) => {
    if (ghost) return (
        <Button
            bg={ 'transparent' }
            color='ink.primary'
            borderWidth='1px'
            borderStyle='solid'
            borderColor='ink.primary'
            _hover={ {
                transform: 'scale(1.05)'
            } }
            _active={ {
                transform: 'scale(.95)'
            } }
            ref={ ref }
            { ...props }
        >
            { children }
        </Button>
    )
    return (
        <Button
            bg='ink.primary'
            color='ink.inverted'
            _hover={ {
                bg: 'ink.hover',
                transform: 'scale(1.05)'
            } }
            _active={ {
                transform: 'scale(.95)'
            } }
            ref={ ref }
            { ...props }
        >
            { children }
        </Button>
    )
})

CustomButton.displayName = 'CustomButton'

export default CustomButton
