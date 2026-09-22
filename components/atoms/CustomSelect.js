import { forwardRef } from "react"
import { NativeSelect } from "@chakra-ui/react"
import { timezoneNames } from "@/public/utils/timezoneNames"

// Width and size belong to the root, which carries the dropdown indicator
// alongside the field; everything else styles the field itself.
const CustomSelect = forwardRef(({ id, placeholder, onChange, size = 'lg', width, ...props }, ref) => {
    return (
        <NativeSelect.Root size={ size } width={ width }>
            <NativeSelect.Field
                id={ id }
                placeholder={ placeholder }
                onChange={ onChange }
                focusRingColor='ink.primary'
                fontWeight='medium'
                fontSize='1rem'
                borderColor='border.subtle'
                // The explicit border colour above outranks the recipe's focus colour,
                // so the focused state is restated here: v2 turned the border ink and
                // doubled it with a 1px ring, on any focus rather than only keyboard focus
                _focus={ {
                    borderColor: 'ink.primary',
                    boxShadow: '0 0 0 1px var(--chakra-colors-ink-primary)',
                } }
                ref={ ref }
                { ...props }
            >
                { timezoneNames.map((tz) => (
                    <option value={ tz } key={ tz }>{ tz }</option>
                )) }
            </NativeSelect.Field>
            <NativeSelect.Indicator />
        </NativeSelect.Root>
    )
})

CustomSelect.displayName = 'CustomSelect'


export default CustomSelect
