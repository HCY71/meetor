import { forwardRef } from 'react'
import Link from 'next/link'
import {
    HStack,
    VStack,
    Center,
    Box,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    useColorMode,
    // Link
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
        <Popover placement='bottom-end' isLazy autoFocus={ false } closeOnBlur={ true }>
            { ({ isOpen, onClose }) => (
                <>
                    <PopoverTrigger>
                        <MenuIcon isOpen={ isOpen } />
                    </PopoverTrigger>
                    <PopoverContent p={ 2 } bg={ colors[ colorMode ].bg.sidebar } boxShadow={ colorMode === 'light' ? '0 8px 32px rgb(0,0,0,0.10)' : null }>
                        <PopoverHeader fontWeight='bold' borderBottom='none' fontSize='20px'>{ context.global.settings.title }</PopoverHeader>
                        <PopoverBody pt='0' pb='20px' as={ VStack } align='flex-start' spacing={ 4 }>
                            <Template title={ context.global.settings.theme } center>
                                <CustomSwitch
                                    onClick={ toggleColorMode }
                                    // boxShadow='inset 0px -1px 2px rgba(255,255,255,0.1)'
                                    boxShadow={ colorMode === 'light' ? 'inset 0px -1px 4px rgba(0,0,0,0.06)' : 'inset 0px -1px 2px rgba(255,255,255,0.1)' }
                                />
                                {/* <CustomButton
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
                                </CustomButton> */}
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
                            <Box as={ Link } href='/about' rel='noopener noreferrer' fontWeight='bold' onClick={ onClose }>
                                { `${context.global.settings.about}` }
                            </Box>
                        </PopoverFooter>
                    </PopoverContent>
                </>
            ) }
        </Popover >
    )
}

const MenuIcon = forwardRef(({ isOpen, ...props }, ref) => {
    return (
        <Center
            bg='transparent'
            userSelect='none'
            cursor='pointer'
            h='100%'
            w='36px'
            justifyContent='flex-end'
            ref={ ref }
            { ...props }
        >
            <MenuIconComposition
                w={ isOpen ? '60%' : '100%' }
                transform={ 'translate3d(0, -100%, 0) rotate(0deg)' }
            />
            <MenuIconComposition
                w={ isOpen ? '100%' : '60%' }
                transform={ 'translate3d(0, 100%, 0) rotate(0deg)' }
            />
        </Center>
    )
})
MenuIcon.displayName = 'MenuIcon'

const MenuIconComposition = ({ ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Box
            h='6px'
            bg={ colors[ colorMode ].bg.invert }
            pos='absolute'
            borderRadius='1000px'
            opacity={ 1 }
            transition='.2s'
            willChange='transform'
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

export { MenuIconComposition }

export default SideBar