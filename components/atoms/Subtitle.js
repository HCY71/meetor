import { Text } from '@chakra-ui/react'

const Subtitle = ({ children }) => {
    return (
        <Text
            fontSize={ { base: '1rem' } }
            color='ink.muted'
        >
            { children }
        </Text>
    )
}

export default Subtitle
