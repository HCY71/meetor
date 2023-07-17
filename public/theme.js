import { extendTheme } from '@chakra-ui/react'
import { tabsAnatomy, switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(tabsAnatomy.keys)

const { definePartsStyle: switchPartStyle, defineMultiStyleConfig: switchStyleConfig } =
    createMultiStyleConfigHelpers(switchAnatomy.keys)

const colors = {
    light: {
        font: {
            header: '#0f172a',
            subHeader: '#0f172a',
            subtitle: 'gray.600',
            primary: 'black',
            highlight: 'yellow.300',
            invert: 'white',
            dim: 'gray.600',
            dimMore: 'gray.400'
        },
        bg: {
            primary: 'white',
            invert: 'black',
            button: {
                hover: 'gray.800',
                active: 'gray.900'
            },
            timetableSelected: 'yellow.300',
            timetableSelectedAlpha: 'rgba(255,124,0, .3)',
            nav: {
                primary: 'hsla(0,0%,100%,.8)',
                invert: 'rgba(2,4,8,.9)'
            }
        },
        border: {
            nav: 'solid 1px rgba(229, 231, 235, 1)',
            button: 'solid 2px black',
            buttonGhost: 'solid 1px black',
            focus: 'black',
            table: 'solid 1px rgba(0,0,0,0.8)',
            table2: 'dotted 1px black',
            sliderTrack: 'gray.100',
            dim: 'gray.600',
            dimMore: 'gray.400'
        },
    },
    dark: {
        font: {
            header: 'white',
            subHeader: 'white',
            subtitle: 'gray.300',
            primary: 'white',
            highlight: 'yellow.400',
            invert: 'black',
            dim: 'gray.300',
            dimMore: 'gray.500'
        },
        bg: {
            primary: '#020408',
            invert: 'white',
            button: {
                hover: 'gray.100',
                active: 'whiteAlpha.900'
            },
            timetableSelected: 'yellow.400',
            timetableSelectedAlpha: 'rgba(255,124,0, .3)',
            nav: {
                invert: 'hsla(0,0%,100%,.8)',
                primary: 'rgba(2,4,8,.9)'
            }
        },
        border: {
            nav: 'solid 2px rgba(100, 100, 100, .4)',
            button: 'solid 2px white',
            buttonGhost: 'solid 1px white',
            focus: 'white',
            table: 'solid 1px rgba(255,255,255,0.8)',
            table2: 'dotted 1px white',
            sliderTrack: 'gray.800',
            dim: 'gray.600',
        },

    }
}

// Switch
const darkSwitch = switchPartStyle({
    track: {
        bg: 'gray.800',
        border: 'solid 1px',
        borderColor: 'gray.600',
        _checked: {
            bg: 'white'
        }
    },
    thumb: {
        border: 'solid 1px',
        borderColor: 'gray.500',
    }
})
const lightSwitch = switchPartStyle({
    track: {
        bg: 'gray.100',
        border: 'solid 1px',
        borderColor: 'gray.200',
        _checked: {
            bg: 'black'
        }
    },
})

// Tabs
const blackVariant = definePartsStyle(() => {
    return {
        tab: {
            bg: 'transparent',
            borderRadius: 'md',
            p: 3,
            color: 'gray.400',
            border: 'solid 1px',
            borderColor: 'gray.200',
            _selected: {
                bg: 'black',
                color: 'white',
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
    }
})
const whiteVariant = definePartsStyle(() => {
    return {
        tab: {
            bg: 'transparent',
            borderRadius: 'md',
            p: 3,
            color: 'gray.400',
            border: 'solid 1px',
            borderColor: 'gray.200',
            _selected: {
                bg: 'white',
                color: 'black',
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
    }
})
const variants = {
    black: blackVariant,
    white: whiteVariant,
}
const tabsTheme = defineMultiStyleConfig({ variants })

const switchVariants = {
    dark: darkSwitch,
    light: lightSwitch
}

const switchTheme = switchStyleConfig({ variants: switchVariants })

const theme = extendTheme({
    config: {
        disableTransitionOnChange: false,
        initialColorMode: 'system',
        useSystemColorMode: false,
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode == 'dark' ? '#020408' : 'white',
            },
        }),
    },
    components: {
        Tabs: tabsTheme,
        Switch: switchTheme
    },
})

export default theme
export { colors }
