import { Text } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

const Subtitle = ({ children }) => {
    const { colorMode } = useColorMode()
    return (
        <Text
            fontSize='1rem'
            color={ colors[ colorMode ].font.subtitle }
        >
            { children }
        </Text>
    )
}

export default Subtitle