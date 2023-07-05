import { Text, useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

const Header = ({ children, ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Text
            fontSize='3.5rem'
            fontWeight='700'
            lineHeight='1'
            letterSpacing='0px'
            textAlign='center'
            color={ colors[ colorMode ].font.header }
            { ...props }
        >
            { children }
        </Text >
    )
}

export default Header