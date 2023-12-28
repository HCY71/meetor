import { Text, useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

const Header = ({ children, ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Text
            as={ 'h1' }
            fontSize={ { base: '2.5rem', md: '3.5rem' } }
            fontWeight='700'
            lineHeight='1.15'
            letterSpacing='0px'
            textAlign='center'
            color={ colors[ colorMode ].font.header }
            whiteSpace='pre-line'
            { ...props }
        >
            { children }
        </Text >
    )
}

export default Header