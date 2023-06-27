import { Text, useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

const SubHeader = ({ children }) => {
    const { colorMode } = useColorMode()
    return (
        <Text
            fontSize='2.5rem'
            fontWeight='700'
            lineHeight='1'
            letterSpacing='0px'
            textAlign='center'
            color={ colors[ colorMode ].font.subHeader }
        >
            { children }
        </Text>
    )
}

export default SubHeader