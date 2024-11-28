import {
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Tag,
    Center,
    HStack,
    useColorMode
} from '@chakra-ui/react'
import CustomSelect from '../atoms/CustomSelect'
import { toast } from 'react-hot-toast'
import { useLang } from '@/context/LangContext'
import { colors } from '@/public/theme'

const CustomTabs = ({ onMouseDown = [ null, null ], tab, panel, isDisabled = false, inputRef = null, tips = [], timezoneConfigs, ...props }) => {
    const { context } = useLang()
    const handleDisable = () => {
        toast(context.global.toast.nameFirst, {
            icon: '😵‍💫',
        })
        inputRef.current.focus()
    }
    const { colorMode } = useColorMode()
    const handleReset = () => {
        timezoneConfigs.updateTimezone(props.event.timezone)
    }
    return (
        <Tabs
            variant={ colorMode === 'light' ? 'black' : 'white' }
            w='100%'
            isFitted
            { ...props }
        >
            <TabList as={ HStack } spacing={ { base: 1, md: 2 } }>
                <Center
                    onClick={ isDisabled ? handleDisable : null }
                    pointerEvents={ isDisabled ? 'initial' : 'none' }
                    cursor={ isDisabled ? 'not-allowed' : 'none' }
                    flex='1'
                >
                    <Tab
                        onMouseDown={ onMouseDown[ 0 ] }
                        pointerEvents={ isDisabled ? 'none' : 'initial' }
                    >
                        { tab[ 0 ] }
                    </Tab>
                </Center>
                <Center flex='1'>
                    <Tab onMouseDown={ onMouseDown[ 1 ] }>{ tab[ 1 ] }</Tab>
                </Center>
            </TabList>
            <TabPanels >
                <TabPanel p='1rem 0'>
                    <HStack>
                        { tips[ 0 ] && <TagTemplate>{ `💡 ${tips[ 0 ]}` }</TagTemplate> }
                        { tips[ 2 ] && <TagTemplate>{ `💡 ${tips[ 2 ]}` }</TagTemplate> }
                    </HStack>
                    { timezoneConfigs && !props.event.allDay &&
                        <HStack mt='-4px' mb={ 2 } justifyContent={ { base: 'space-between', md: 'flex-start' } } gap={ 3 }>
                            <CustomSelect
                                id='timezone'
                                value={ timezoneConfigs.timezone }
                                size='sm'
                                rounded='md'
                                width={ { base: '80%', sm: '50%' } }
                                fontSize='.75rem'
                                onChange={ (e) => timezoneConfigs.updateTimezone(e.target.value) }
                            />
                            <Center
                                fontSize='0.75rem'
                                fontWeight='medium'
                                color={ colors[ colorMode ].font.dim }
                                borderColor={ colors[ colorMode ].bg.dim }
                                cursor='pointer'
                                p={ '4px 8px' }
                                h={ '100%' }
                                border='solid 1px'
                                borderRadius='md'
                                onClick={ handleReset }
                                visibility={ props.event.timezone === timezoneConfigs.timezone ? 'hidden' : 'visible' }
                            >
                                { context.home.input.timezoneReset }
                            </Center>
                        </HStack>
                    }
                    { panel[ 0 ] }
                </TabPanel>
                <TabPanel p='1rem 0'>
                    <HStack>
                        { tips[ 1 ] && <TagTemplate>{ `💡 ${tips[ 1 ]}` }</TagTemplate> }
                        { tips[ 2 ] && <TagTemplate>{ `💡 ${tips[ 2 ]}` }</TagTemplate> }
                    </HStack>
                    { timezoneConfigs && !props.event.allDay &&
                        <HStack mt='-4px' mb={ 2 } justifyContent={ { base: 'space-between', md: 'flex-start' } } gap={ 3 }>
                            <CustomSelect
                                id='timezone'
                                value={ timezoneConfigs.timezone }
                                size='sm'
                                rounded='md'
                                width={ { base: '80%', sm: '50%' } }
                                fontSize='.75rem'
                                onChange={ (e) => timezoneConfigs.updateTimezone(e.target.value) }
                            />
                            <Center
                                fontSize='0.75rem'
                                fontWeight='medium'
                                color={ colors[ colorMode ].font.dim }
                                borderColor={ colors[ colorMode ].bg.dim }
                                cursor='pointer'
                                p={ '4px 8px' }
                                h={ '100%' }
                                border='solid 1px'
                                borderRadius='md'
                                onClick={ handleReset }
                                visibility={ props.event.timezone === timezoneConfigs.timezone ? 'hidden' : 'visible' }

                            >                                { context.home.input.timezoneReset }
                            </Center>
                        </HStack>
                    }
                    { panel[ 1 ] }
                </TabPanel>
            </TabPanels>
        </Tabs >
    )
}

export const TagTemplate = ({ children, ...props }) => {
    return (
        <Tag
            colorScheme='orange'
            mb='12px'
            { ...props }
        >
            { children }
        </Tag>
    )
}

export default CustomTabs