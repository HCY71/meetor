import { VStack } from "@chakra-ui/react"

const Content = ({ children }) => {
    return (
        <VStack
            w='100%'
            p={ { base: '20px 12px', md: '50px 40px' } }
            mt={ { base: '60px', md: '80px' } }
        >
            { children }
        </VStack>
    )
}

export default Content