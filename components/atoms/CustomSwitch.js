import {
    Center,
    Icon,
    useColorMode
} from '@chakra-ui/react'
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs'

const CustomSwitch = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Center bg='bg.track' w='80px' borderRadius='32px' p={ 1 } pos='relative' cursor='pointer' { ...props }>
            <IconTemplate as={ BsSunFill } color='accent' left='2' opacity={ colorMode === 'light' ? 0 : 1 } />
            <IconTemplate as={ BsFillMoonFill } color='ink.primary' right='2' opacity={ colorMode === 'light' ? 1 : 0 } />
            <Center
                bg='white'
                borderRadius='50%'
                h='32px'
                w='32px'
                transition='.2s'
                willChange={ 'transform' }
                transform={ colorMode === 'light' ? 'translate(-60%, 0)' : 'translate(60%, 0)' }
            />
        </Center>
    )
}

// Each icon is only visible in the mode it represents, so it can carry a fixed
// token instead of branching on the current mode.
const IconTemplate = ({ as, color, ...props }) => {
    return (
        <Center transition='color .1s' pos='absolute'  { ...props }>
            <Icon as={ as } color={ color } />
        </Center>
    )
}
export default CustomSwitch
