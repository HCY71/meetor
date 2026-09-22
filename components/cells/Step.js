import {
    VStack,
    HStack,
    Text,
    Center,
} from '@chakra-ui/react'

const Step = ({ step, title, children, isDisable = false, insert, ...props }) => {
    if (insert) return (
        <VStack w='100%' alignItems='flex-start' { ...props }>
            <HStack>
                <Title step={ step } isDisable={ isDisable }>
                    { title }
                </Title>
                { insert }
            </HStack>
            { children }
        </VStack>
    )
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
    return (
        <HStack display={ isDisable ? 'none' : 'flex' }>
            <Center
                borderRadius='50%'
                bg='ink.primary'
                color='ink.inverted'
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