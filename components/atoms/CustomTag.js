import { Center } from "@chakra-ui/react"

const CustomTag = ({ isGhost, children, props }) => {
    if (isGhost) return (
        <Template
            bg='transparent'
            borderWidth='1px'
            borderStyle='solid'
            borderColor='ink.primary'
            color='ink.primary'
            { ...props }
        >
            { children }
        </Template>
    )
    return (
        <Template { ...props }>
            { children }
        </Template>
    )
}

const Template = ({ children, ...props }) => {
    return (
        <Center
            bg='ink.primary'
            color='ink.inverted'
            borderRadius='sm'
            p='2px 4px'
            { ...props }
        >
            { children }
        </Center>
    )
}

export default CustomTag
