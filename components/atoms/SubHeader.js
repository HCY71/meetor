import { Text } from '@chakra-ui/react'

const SubHeader = ({ children }) => {
    return (
        <Text
            fontSize={ { base: '2rem', md: '2.5rem' } }
            fontWeight='700'
            lineHeight='1'
            letterSpacing='0px'
            textAlign='center'
            color='ink.primary'
        >
            { children }
        </Text>
    )
}

export default SubHeader
