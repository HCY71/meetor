import {
    Box,
    Tabs,
    Tag,
    Center,
    HStack,
} from '@chakra-ui/react'
import { useId } from 'react'
import CustomSelect from '../atoms/CustomSelect'
import { toast } from 'react-hot-toast'
import { useLang } from '@/context/LangContext'

const CustomTabs = ({
    onMouseDown = [],
    tab,
    panel,
    sharedPanel,
    isDisabled = false,
    inputRef,
    tips = [],
    timezoneConfigs,
    index,
    onChange,
    event,
}) => {
    const { context } = useLang()
    const id = useId()
    const sharedPanelId = `${id}-panel`
    const triggerId = (value) => `${id}-tab-${value}`

    const handleDisable = () => {
        toast(context.global.toast.nameFirst, { icon: '😵‍💫' })
        inputRef?.current?.focus()
    }

    return (
        <Tabs.Root
            w='100%'
            fitted
            lazyMount
            ids={ sharedPanel ? { trigger: triggerId, content: () => sharedPanelId } : undefined }
            value={ index === undefined ? undefined : String(index) }
            defaultValue={ index === undefined ? '0' : undefined }
            onValueChange={ ({ value }) => onChange?.(Number(value)) }
        >
            <Tabs.List display='flex' gap='1.5'>
                <Center
                    onClick={ isDisabled ? handleDisable : undefined }
                    cursor={ isDisabled ? 'not-allowed' : undefined }
                    flex='1'
                >
                    <Tabs.Trigger
                        value='0'
                        disabled={ isDisabled }
                        w='100%'
                        onMouseDown={ onMouseDown[0] }
                        pointerEvents={ isDisabled ? 'none' : undefined }
                    >
                        { tab[0] }
                    </Tabs.Trigger>
                </Center>
                <Center flex='1'>
                    <Tabs.Trigger value='1' w='100%' onMouseDown={ onMouseDown[1] }>
                        { tab[1] }
                    </Tabs.Trigger>
                </Center>
            </Tabs.List>
            { sharedPanel ? (
                <Box id={ sharedPanelId } role='tabpanel' aria-labelledby={ triggerId(index) } py='2'>
                    <ScheduleControls tips={ tips } index={ index } timezoneConfigs={ timezoneConfigs } event={ event } />
                    { sharedPanel }
                </Box>
            ) : panel.map((content, value) => (
                <Tabs.Content key={ value } value={ String(value) } p='1rem 0'>
                    <HStack>
                        { tips[value] && <TagTemplate>{ `💡 ${tips[value]}` }</TagTemplate> }
                    </HStack>
                    { content }
                </Tabs.Content>
            )) }
        </Tabs.Root>
    )
}

const ScheduleControls = ({ tips, index, timezoneConfigs, event }) => {
    const { context } = useLang()
    return (
        <HStack mb='2' gap='2' flexWrap='wrap' alignItems='center'>
            { !event.allDay && (
                <HStack gap='2' flex='1 1 170px' minW='0'>
                    <CustomSelect
                        id='timezone'
                        label={ context.home.input.timezone }
                        value={ timezoneConfigs.timezone }
                        size='sm'
                        onChange={ timezoneConfigs.updateTimezone }
                    />
                    <Center
                        as='button'
                        type='button'
                        flexShrink={ 0 }
                        fontSize='xs'
                        fontWeight='medium'
                        color='ink.muted'
                        borderColor='ink.muted'
                        cursor='pointer'
                        px='2'
                        minH='8'
                        borderWidth='1px'
                        borderRadius='md'
                        onClick={ () => timezoneConfigs.updateTimezone(event.timezone) }
                        display={ event.timezone === timezoneConfigs.timezone ? 'none' : 'flex' }
                    >
                        { context.home.input.timezoneReset }
                    </Center>
                </HStack>
            ) }
            <Box display='grid' flex='1 1 200px' minW='0'>
                { tips.map((tip, value) => (
                    <HStack
                        key={ value }
                        gridArea='1 / 1'
                        gap='1'
                        flexWrap='wrap'
                        justifyContent='flex-end'
                        visibility={ index === value ? 'visible' : 'hidden' }
                        aria-hidden={ index !== value }
                    >
                        { tip && <TagTemplate mb='0' py='1' fontSize='xs'>{ `💡 ${tip}` }</TagTemplate> }
                    </HStack>
                )) }
            </Box>
        </HStack>
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
