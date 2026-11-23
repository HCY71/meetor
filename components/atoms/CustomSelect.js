import { useMemo } from "react"
import { createListCollection, Portal, Select } from "@chakra-ui/react"
import { timezoneNames } from "@/public/utils/timezoneNames"

const timezones = createListCollection({ items: timezoneNames })

const CustomSelect = ({ id, label, value, onChange, size = 'lg' }) => {
    const collection = useMemo(() => {
        // The browser or an existing event may use a timezone alias outside the list.
        if (!value || timezones.has(value)) return timezones
        return createListCollection({ items: [ value, ...timezoneNames ] })
    }, [ value ])
    const isCompact = size === 'sm'

    return (
        <Select.Root
            ids={ { trigger: id } }
            collection={ collection }
            value={ value ? [ value ] : [] }
            onValueChange={ ({ value: [ timezone ] }) => onChange(timezone) }
            size={ size }
            minW='0'
            positioning={ { sameWidth: true, gutter: 4 } }
            lazyMount
            unmountOnExit
        >
            <Select.Control>
                <Select.Trigger
                    aria-label={ label }
                    minH={ isCompact ? '8' : undefined }
                    px={ isCompact ? '3' : undefined }
                    fontSize={ isCompact ? 'xs' : 'md' }
                    fontWeight='medium'
                    borderColor='border.subtle'
                    cursor='pointer'
                    _hover={ { bg: 'bg.track' } }
                    _expanded={ { borderColor: 'ink.muted' } }
                    focusVisibleRing='outside'
                    focusRingColor='ink.primary'
                >
                    <Select.ValueText maxW='none' overflowWrap='anywhere' />
                    <Select.Indicator color='ink.muted' flexShrink={ 0 } />
                </Select.Trigger>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content
                        aria-label={ label }
                        maxH='min(16rem, var(--available-height, 16rem))'
                        overscrollBehavior='contain'
                        bg='bg.surface'
                        borderWidth='1px'
                        borderColor='border.subtle'
                        borderRadius='md'
                        boxShadow='menu'
                        p='1'
                        _motionReduce={ { animation: 'none' } }
                    >
                        { collection.items.map((timezone) => (
                            <Select.Item
                                key={ timezone }
                                item={ timezone }
                                minH='8'
                                px='2'
                                cursor='pointer'
                                borderRadius='sm'
                                _highlighted={ { bg: 'bg.track' } }
                                _selected={ { fontWeight: 'semibold' } }
                            >
                                <Select.ItemText minW='0' overflowWrap='anywhere'>{ timezone }</Select.ItemText>
                                <Select.ItemIndicator flexShrink={ 0 } />
                            </Select.Item>
                        )) }
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

export default CustomSelect
