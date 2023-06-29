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
import { useLang } from '@/context/LangContext'
import { useConfigs } from '@/context/ConfigsContext'

const SideBar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const { context } = useLang()
    const { configs, setConfigs } = useConfigs()
    return (
        <Popover placement='bottom-end' isLazy>
            { ({ isOpen }) => (
                <>
                    <PopoverTrigger>
                        <MenuIcon isOpen={ isOpen } />
                    </PopoverTrigger>
                    <PopoverContent p={ 2 } bg={ colors[ colorMode ].bg.primary }>
                        <PopoverHeader fontWeight='bold' borderBottom='none' fontSize='20px'>{ context.global.settings.title }</PopoverHeader>
                        <PopoverBody pt='0' as={ VStack } align='flex-start' spacing={ 4 }>
                            <Template title={ context.global.settings.theme } center>
                                <CustomSwitch onClick={ toggleColorMode } />
                                <CustomButton
                                    ghost={ !configs.useSystemColorMode }
                                    fontSize='0.75rem'
                                    fontWeight='medium'
                                    color={ !configs.useSystemColorMode ? colors[ colorMode ].font.primary : colors[ colorMode ].font.invert }
                                    cursor='pointer'
                                    p={ '8px 16px' }
                                    h='fit-content'
                                    border={ colors[ colorMode ].border.buttonGhost }
                                    borderRadius='md'
                                    onClick={ () => setConfigs({ ...configs, useSystemColorMode: !configs.useSystemColorMode }) }
                                >
                                    { context.global.button.auto }
                                </CustomButton>
                            </Template>
                            <Template title={ context.global.settings.language } center>
                                <Toggle isGhost={ configs.lang !== 'en' } onClick={ () => setConfigs({ ...configs, lang: "en" }) }>EN</Toggle>
                                <Toggle isGhost={ configs.lang !== 'zh-tw' } onClick={ () => setConfigs({ ...configs, lang: "zh-tw" }) }>繁</Toggle>
                            </Template>
                            <Template title={ context.global.settings.weekStart.title } center>
                                <Toggle isGhost={ configs.weekStartsOn !== 0 } onClick={ () => setConfigs({ ...configs, weekStartsOn: 0 }) }>{ context.global.settings.weekStart.sun }</Toggle>
                                <Toggle isGhost={ configs.weekStartsOn !== 1 } onClick={ () => setConfigs({ ...configs, weekStartsOn: 1 }) }>  { context.global.settings.weekStart.mon }</Toggle>
                            </Template>
                            <Template title={ context.global.settings.timeFormat } center>
                                <Toggle isGhost={ !configs.usePM } onClick={ () => setConfigs({ ...configs, usePM: true }) }>12H</Toggle>
                                <Toggle isGhost={ configs.usePM } onClick={ () => setConfigs({ ...configs, usePM: false }) }>24H</Toggle>
                            </Template>
                        </PopoverBody>
                        <PopoverFooter>
                            { context.global.settings.about }
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

const Toggle = ({ isGhost, onClick, children }) => {
    return (
        <CustomButton w='100%' ghost={ isGhost } onClick={ onClick }>
            { children }
        </CustomButton>
    )
}

export default SideBar