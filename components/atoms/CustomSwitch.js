import {
    Center,
    Icon,
    useColorMode
} from '@chakra-ui/react'
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs'
import { colors } from '@/public/theme'

const CustomSwitch = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Center bg={ colors[ colorMode ].border.sliderTrack } w='80px' borderRadius='32px' p={ 1 } pos='relative' cursor='pointer' { ...props }>
            <IconTemplate as={ BsSunFill } left='2' opacity={ colorMode === 'light' ? 0 : 1 } />
            <IconTemplate as={ BsFillMoonFill } right='2' opacity={ colorMode === 'light' ? 1 : 0 } />
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
const IconTemplate = ({ as, ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Center transition='color .1s' pos='absolute'  { ...props }>
            <Icon
                as={ as }
                color={ colorMode === 'light' ? colors[ colorMode ].font.default : colors[ colorMode ].font.highlight }
            />
        </Center>
    )
}
export default CustomSwitch