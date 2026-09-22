import { forwardRef } from 'react'
import Link from 'next/link'
import {
    HStack,
    VStack,
    Center,
    Box,
    Text,
    Popover,
    Portal,
    useDisclosure,
} from '@chakra-ui/react'
import CustomButton from './atoms/CustomButton'
import CustomSwitch from './atoms/CustomSwitch'
import { useColorMode } from '@/components/ColorMode'
import { useLang } from '@/context/LangContext'
import { useConfigs } from '@/context/ConfigsContext'

const SideBar = () => {
    const { toggleColorMode } = useColorMode()
    const { context } = useLang()
    const { configs, setConfigs } = useConfigs()
    const { open, setOpen, onToggle, onClose } = useDisclosure()

    // v2's Popover closed on blur, which never fired when tapping somewhere
    // unfocusable, so this used to listen for outside pointer downs itself.
    // v3 detects outside interaction by pointer, which covers that case.
    return (
        <Popover.Root
            open={ open }
            onOpenChange={ (details) => setOpen(details.open) }
            positioning={ { placement: 'bottom-end' } }
            lazyMount
            unmountOnExit
            autoFocus={ false }
        >
            <Popover.Trigger asChild>
                <MenuIcon
                    isOpen={ open }
                    role='button'
                    tabIndex={ 0 }
                    onKeyDown={ (keyboardEvent) => {
                        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                            keyboardEvent.preventDefault()
                            onToggle()
                        }
                    } }
                />
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content
                        w='320px'
                        textStyle='md'
                        p={ 2 }
                        bg='bg.surface'
                        borderWidth='1px'
                        borderStyle='solid'
                        borderColor='border'
                        borderRadius='md'
                        boxShadow='menu'
                    >
                        <Popover.Header px='3' py='2' fontWeight='bold' fontSize='20px' lineHeight='1.5'>{ context.global.settings.title }</Popover.Header>
                        <Popover.Body px='3' pt='0' pb='20px' display='flex' flexDirection='column' alignItems='flex-start' gap={ 4 }>
                            <Template title={ context.global.settings.theme } center>
                                <CustomSwitch
                                    onClick={ toggleColorMode }
                                    boxShadow='switchTrack'
                                />
                                {/* <CustomButton
                                    ghost={ !configs.useSystemColorMode }
                                    fontSize='0.75rem'
                                    fontWeight='medium'
                                    color={ !configs.useSystemColorMode ? 'ink.primary' : 'ink.inverted' }
                                    cursor='pointer'
                                    p={ '8px 16px' }
                                    h='fit-content'
                                    borderWidth='1px'
                                    borderStyle='solid'
                                    borderColor='ink.primary'
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
                            <Center w='full' mt='5'>
                                {/* <!-- WebCurate Spotlight -->    */ }
                                <a href="https://webcurate.co/p/meetor" target="_blank">
                                    <img src="https://webcurate.co/assets/images/webcurate-featured-badge.svg" alt="Meetor Featured on WebCurate" style={ { maxWidth: '250px', maxHeight: '54px' } } />
                                </a>
                            </Center>

                        </Popover.Body>
                        <Popover.Footer px='3' py='2' borderTopWidth='1px' borderStyle='solid' borderColor='border'>
                            <Box asChild fontWeight='bold'>
                                <Link href='/about' rel='noopener noreferrer' onClick={ onClose }>
                                    { `${context.global.settings.about}` }
                                </Link>
                            </Box>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
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
    return (
        <Box
            h='6px'
            bg='ink.primary'
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