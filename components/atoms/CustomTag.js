import { Center } from "@chakra-ui/react"
import { useColorMode } from "@chakra-ui/react"
import { colors } from "@/public/theme"

const CustomTag = ({ isGhost, children, props }) => {
    const { colorMode } = useColorMode()
    if (isGhost) return (
        <Template
            bg='transparent'
            border={ colors[ colorMode ].border.buttonGhost }
            color={ colors[ colorMode ].font.primary }
            { ...props }
        >
            { children }
        </Template>
    )
    return (
        <Template { ...props }>
            { children }
        </Template>
    )
}

const Template = ({ children, ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Center
            bg={ colors[ colorMode ].bg.invert }
            color={ colors[ colorMode ].font.invert }
            borderRadius='sm'
            p='2px 4px'
            { ...props }
        >
            { children }
        </Center>
    )
}

export default CustomTag