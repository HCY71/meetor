import { Switch } from "@chakra-ui/react"

import { useColorMode } from "@chakra-ui/react"
import { colors } from "@/public/theme"

const ChakraSwitch = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Switch
            variant={ colorMode === 'dark' ? 'dark' : 'light' }
            { ...props }
        />
    )
}

export default ChakraSwitch