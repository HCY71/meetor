import {
    VStack,
    HStack,
    Text,
    Center,
    useColorMode
} from '@chakra-ui/react'

import { colors } from '@/public/theme'
const Step = ({ step, title, children, isDisable = false, ...props }) => {
    return (
        <VStack w='100%' alignItems='flex-start' { ...props }>
            <Title step={ step } isDisable={ isDisable }>
                { title }
            </Title>
            { children }
        </VStack>
    )
}

const Title = ({ step, children, isDisable }) => {
    const { colorMode } = useColorMode()
    return (
        <HStack display={ isDisable ? 'none' : 'flex' }>
            <Center
                borderRadius='50%'
                bg={ colors[ colorMode ].bg.invert }
                color={ colors[ colorMode ].font.invert }
                w='30px'
                h='30px'
                display='flex'
                padding='.5rem'
                fontSize='1rem'
                fontWeight='bold'
            >
                { step }
            </Center>
            <Text fontWeight='bold'>{ children }</Text>
        </HStack >
    )
}

export default Step