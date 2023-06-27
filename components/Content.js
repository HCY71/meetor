import { VStack } from "@chakra-ui/react"

const Content = ({ children }) => {
    return (
        <VStack w='100%' p={ { base: 5, md: 50 } } mt='80px'>
            { children }
        </VStack>
    )
}

export default Content