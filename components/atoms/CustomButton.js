import { forwardRef } from "react"
import { Button, useColorMode } from "@chakra-ui/react"
import { colors } from "@/public/theme"

const CustomButton = forwardRef(({ children, ghost, ...props }, ref) => {
    const { colorMode } = useColorMode()
    if (ghost) return (
        <Button
            bg={ 'transparent' }
            color={ colors[ colorMode ].font.primary }
            border={ colors[ colorMode ].border.buttonGhost }
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
            bg={ colors[ colorMode ].bg.invert }
            color={ colors[ colorMode ].font.invert }
            _hover={ {
                bg: colors[ colorMode ].bg.button.hover,
                transform: 'scale(1.05)'
            } }
            _active={ {
                bg: colors[ colorMode ].bg.button.active,
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