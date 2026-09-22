import { extendTheme, defineStyle, defineStyleConfig } from '@chakra-ui/react'
import { tabsAnatomy, switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(tabsAnatomy.keys)

const { definePartsStyle: switchPartStyle, defineMultiStyleConfig: switchStyleConfig } =
    createMultiStyleConfigHelpers(switchAnatomy.keys)

// The single source of truth for colour in the app. Every token carries its own
// light and dark value, and Chakra compiles each one to a CSS variable that
// swaps on the .chakra-ui-dark class. Components reference tokens by name
// (color='ink.muted') and never read the colour mode to pick a value.
//
// Keys are written flat and dotted on purpose: Chakra treats a nested key
// literally named 'default' as a condition rather than a token name, so a
// nested group would silently break the moment it held only that one key.
const semanticTokens = {
    colors: {
        // Ink is the one colour that flips end to end with the mode. The same
        // value is text, the fill of primary buttons, tags and step markers,
        // and the outline of ghost controls, so it carries no fg/bg/border
        // prefix. Three separate tokens used to hold this value and drifted.
        'ink.primary': { _light: 'black', _dark: 'white' },
        'ink.inverted': { _light: 'white', _dark: 'black' },
        'ink.hover': { _light: 'gray.800', _dark: 'gray.100' },
        'ink.muted': { _light: 'gray.600', _dark: 'gray.300' },
        'ink.subtle': { _light: 'gray.400', _dark: 'gray.500' },

        // Surfaces, from the page backdrop up to the blurred nav
        'bg.canvas': { _light: 'white', _dark: '#020408' },
        'bg.surface': { _light: 'white', _dark: 'gray.900' },
        'bg.track': { _light: 'gray.100', _dark: 'gray.800' },
        'bg.veil': { _light: 'hsla(0,0%,100%,.75)', _dark: 'rgba(2,4,8,.75)' },

        // Borders come in three weights: faint for a rule that should barely
        // register, subtle for chrome and inputs, and strong for the timetable
        // grid, where the rule has to stay readable against a filled cell.
        // Anything that wants the full-contrast outline uses ink.primary.
        'border.faint': { _light: 'gray.100', _dark: 'whiteAlpha.200' },
        'border.subtle': { _light: 'gray.200', _dark: 'whiteAlpha.300' },
        'border.strong': { _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' },

        // Rim that pairs with the shadows.glow effect. It stays white in both
        // modes because the glow it outlines is white in both modes.
        'border.glow': { _light: 'whiteAlpha.800', _dark: 'whiteAlpha.800' },

        accent: { _light: 'yellow.300', _dark: 'yellow.400' },
    },
    shadows: {
        glow: {
            _light: 'rgba(255, 255, 255, 0.7) 0px 0px 76.9166px, rgba(255, 255, 255, 0.4) 0px 0px 26.3055px, rgba(255, 255, 255, 0.3) 0px 0px 13.1528px, rgb(255, 255, 255) 0px 0px 3.75793px, rgb(255, 255, 255) 0px 0px 1.87897px',
            _dark: 'rgba(255, 255, 255, 0.7) 0px 0px 76.9166px, rgba(255, 255, 255, 0.4) 0px 0px 26.3055px, rgba(255, 255, 255, 0.3) 0px 0px 13.1528px, rgb(255, 255, 255) 0px 0px 3.75793px, rgb(255, 255, 255) 0px 0px 1.87897px',
        },
        // The dark surface already reads as raised, so it needs no drop shadow
        menu: { _light: '0 8px 32px rgba(0,0,0,0.10)', _dark: 'none' },
        switchTrack: {
            _light: 'inset 0px -1px 4px rgba(0,0,0,0.06)',
            _dark: 'inset 0px -1px 2px rgba(255,255,255,0.1)',
        },
    },
}
// Switch
const switchBaseStyle = switchPartStyle({
    track: {
        bg: 'bg.track',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border.subtle',
        boxShadow: 'switchTrack',
        _checked: {
            bg: 'ink.primary',
        },
    },
    thumb: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border.subtle',
    },
})

const switchTheme = switchStyleConfig({ baseStyle: switchBaseStyle })

// Tabs. The two former 'black' and 'white' variants only differed by which end
// of the mode they painted the selected tab, so the tokens collapse them into
// one. It stays a named variant, and the default, because Chakra's built-in
// 'line' variant would otherwise layer its own 2px underline on top.
const toggleVariant = definePartsStyle({
    tab: {
        bg: 'transparent',
        borderRadius: 'md',
        p: 3,
        color: 'ink.subtle',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border.subtle',
        _selected: {
            bg: 'ink.primary',
            color: 'ink.inverted',
            fontWeight: 'bold',
            borderColor: 'inherit',
            borderBottom: 'none',
        },
    },
    tablist: {
        borderColor: 'inherit',
    },
    tabpanel: {
        borderColor: 'inherit',
        borderBottomRadius: 'lg',
        borderTopRightRadius: 'lg',
    },
})

const tabsTheme = defineMultiStyleConfig({
    variants: { toggle: toggleVariant },
    defaultProps: { variant: 'toggle' },
})

// Chakra's smallest built-in button is 32px, which overpowers a button that
// only sits alongside a line of footer text.
const buttonTheme = defineStyleConfig({
    sizes: {
        compact: defineStyle({
            h: '30px',
            minW: '30px',
            fontSize: '0.875rem',
            px: 3,
        }),
    },
})

const theme = extendTheme({
    config: {
        disableTransitionOnChange: false,
        initialColorMode: 'system',
        useSystemColorMode: false,
    },
    semanticTokens,
    styles: {
        global: {
            body: {
                bg: 'bg.canvas',
            },
        },
    },
    components: {
        Tabs: tabsTheme,
        Switch: switchTheme,
        Button: buttonTheme,
    },
})

export default theme
