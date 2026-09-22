import { Text } from '@chakra-ui/react'

const Header = ({ children, ...props }) => {
    return (
        <Text
            as={ 'h1' }
            fontSize={ { base: '2.5rem', md: '3.5rem' } }
            fontWeight='700'
            lineHeight='1.15'
            letterSpacing='0px'
            textAlign='center'
            color='ink.primary'
            whiteSpace='pre-line'
            { ...props }
        >
            { children }
        </Text >
    )
}

export default Header
