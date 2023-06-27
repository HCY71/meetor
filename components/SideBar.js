import { forwardRef } from 'react'
import {
    HStack,
    VStack,
    Center,
    Box,
    Text,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    useColorMode,
} from '@chakra-ui/react'
import CustomButton from './atoms/CustomButton'
import CustomSwitch from './atoms/CustomSwitch'
import { colors } from '@/public/theme'

const SideBar = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Popover placement='bottom-end' isLazy>
            { ({ isOpen }) => (
                <>
                    <PopoverTrigger>
                        <MenuIcon isOpen={ isOpen } />
                    </PopoverTrigger>
                    <PopoverContent p={ 2 } bg={ colors[ colorMode ].bg.primary }>
                        <PopoverHeader fontWeight='bold' borderBottom='none' fontSize='20px'>Settings</PopoverHeader>
                        <PopoverBody pt='0' as={ VStack } align='flex-start' spacing={ 4 }>
                            <Template title='Theme' center>
                                <CustomSwitch onClick={ toggleColorMode } />
                                <CustomButton
                                    ghost
                                    fontSize='0.75rem'
                                    fontWeight='medium'
                                    color={ colors[ colorMode ].font.primary }
                                    cursor='pointer'
                                    p={ '8px 16px' }
                                    h='fit-content'
                                    border={ colors[ colorMode ].border.buttonGhost }
                                    borderRadius='md'
                                >
                                    AUTO
                                </CustomButton>
                            </Template>
                            <Template title='Language' center>
                                <CustomButton w='100%' >EN</CustomButton>
                                <CustomButton w='100%' ghost >繁</CustomButton>
                            </Template>
                            <Template title='Week Start' center>
                                <CustomButton w='100%' >SUN</CustomButton>
                                <CustomButton w='100%' ghost>MON</CustomButton>
                            </Template>
                            <Template title='Time Format' center>
                                <CustomButton w='100%' >12H</CustomButton>
                                <CustomButton w='100%' ghost>24H</CustomButton>
                            </Template>
                        </PopoverBody>
                        <PopoverFooter>
                            About author
                        </PopoverFooter>
                    </PopoverContent>
                </>
            ) }
        </Popover >
    )
}

const MenuIcon = forwardRef(({ isOpen, ...props }, ref) => {
    return (
        <Button
            bg='transparent'
            userSelect='none'
            cursor='pointer'
            w='120px'
            h='80px'
            ref={ ref }
            _hover={ {
                bg: 'unset',
            } }
            { ...props }
        >
            <MenuIconComposition
                w={ isOpen ? '20%' : '35%' }
                transform={ isOpen ? 'translate(-30%, 80%) rotate(-90deg)' : 'translate(0, -90%)' }
            />
            <MenuIconComposition
                w={ isOpen ? '35%' : '20%' }
                transform={ isOpen ? 'translate(30%, 0%) rotate(-90deg)' : 'translate(30%, 90%)' }
            />
        </Button >
    )
})
MenuIcon.displayName = 'MenuIcon'

const MenuIconComposition = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Box
            h='14%'
            bg={ colors[ colorMode ].bg.invert }
            pos='absolute'
            borderRadius='1000px'
            opacity={ .8 }
            transition='.2s'
            { ...props }
        />
    )
}
const Template = ({ title, children, center }) => {
    return (
        <VStack align='flex-start' w='100%'>
            <Text fontWeight='bold'>{ title }</Text>
            <HStack justify={ center ? 'center' : 'flex-start' } w='100%'>
                { children }
            </HStack>
        </VStack>
    )
}

export default SideBar