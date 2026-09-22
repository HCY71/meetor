import {
    Tabs,
    Tag,
    Center,
    HStack,
} from '@chakra-ui/react'
import CustomSelect from '../atoms/CustomSelect'
import { toast } from 'react-hot-toast'
import { useLang } from '@/context/LangContext'

const CustomTabs = ({ onMouseDown = [ null, null ], tab, panel, isDisabled = false, inputRef = null, tips = [], timezoneConfigs, index, onChange, ...props }) => {
    const { context } = useLang()
    const handleDisable = () => {
        toast(context.global.toast.nameFirst, {
            icon: '😵‍💫',
        })
        inputRef.current.focus()
    }
    const handleReset = () => {
        timezoneConfigs.updateTimezone(props.event.timezone)
    }
    // v3 tabs are keyed by string value rather than position. Callers still
    // work in indexes, so the translation happens here and nowhere else.
    const isControlled = index !== undefined
    return (
        <Tabs.Root
            w='100%'
            fitted
            lazyMount
            value={ isControlled ? String(index) : undefined }
            defaultValue={ isControlled ? undefined : '0' }
            onValueChange={ (details) => onChange?.(Number(details.value)) }
        >
            <Tabs.List display='flex' gap={ { base: 1, md: 2 } }>
                <Center
                    onClick={ isDisabled ? handleDisable : null }
                    pointerEvents={ isDisabled ? 'initial' : 'none' }
                    cursor={ isDisabled ? 'not-allowed' : 'none' }
                    flex='1'
                >
                    <Tabs.Trigger
                        value='0'
                        w='100%'
                        onMouseDown={ onMouseDown[ 0 ] }
                        pointerEvents={ isDisabled ? 'none' : 'initial' }
                    >
                        { tab[ 0 ] }
                    </Tabs.Trigger>
                </Center>
                <Center flex='1'>
                    <Tabs.Trigger value='1' w='100%' onMouseDown={ onMouseDown[ 1 ] }>{ tab[ 1 ] }</Tabs.Trigger>
                </Center>
            </Tabs.List>
            <Tabs.Content value='0' p='1rem 0'>
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
                                color='ink.muted'
                                borderColor='ink.muted'
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
            </Tabs.Content>
            <Tabs.Content value='1' p='1rem 0'>
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
                                color='ink.muted'
                                borderColor='ink.muted'
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
            </Tabs.Content>
        </Tabs.Root>
    )
}

export const TagTemplate = ({ children, ...props }) => {
    return (
        <Tag.Root
            bg='tip.bg'
            color='tip.fg'
            minH='6'
            px='2'
            borderRadius='md'
            fontSize='sm'
            fontWeight='medium'
            lineHeight='1.2'
            mb='12px'
            { ...props }
        >
            { /* Children go straight into the root: v3's Tag.Label clamps to one
                 line, which would cut the long all-day hint short on phones */ }
            { children }
        </Tag.Root>
    )
}

export default CustomTabs
