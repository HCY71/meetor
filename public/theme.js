import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

// Chakra v3 ships a different gray scale from v2, so every value below is the
// literal v2 colour rather than a palette reference. Pointing at v3's gray.600
// would quietly shift every grey on the site.
const FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

// The single source of truth for colour in the app. Every token carries its own
// light and dark value, and Chakra compiles each one to a CSS variable that
// swaps on the .dark class next-themes writes on <html>. Components reference
// tokens by name (color='ink.muted') and never read the colour mode to pick a
// value.
//
// Values are keyed _light and _dark rather than base and _dark on purpose. The
// defaults these override are keyed _light, and the two merge side by side, so
// a base value would lose to Chakra's own _light one.
const semanticColors = {
    // Chakra's own defaults for body text and unlabelled borders. v2 left
    // these at gray.800 and gray.200, and v3's replacements are darker, so
    // they are pinned back rather than left to drift.
    fg: {
        DEFAULT: { value: { _light: '#1A202C', _dark: 'rgba(255, 255, 255, 0.92)' } },
        error: { value: { _light: '#E53E3E', _dark: '#FC8181' } },
    },
    border: {
        DEFAULT: { value: { _light: '#E2E8F0', _dark: 'rgba(255, 255, 255, 0.16)' } },
        error: { value: { _light: '#E53E3E', _dark: '#FC8181' } },

        // Borders come in three weights: faint for a rule that should barely
        // register, subtle for chrome and inputs, and strong for the timetable
        // grid, where the rule has to stay readable against a filled cell.
        // Anything that wants the full-contrast outline uses ink.primary.
        faint: { value: { _light: '#EDF2F7', _dark: 'rgba(255, 255, 255, 0.08)' } },
        subtle: { value: { _light: '#E2E8F0', _dark: 'rgba(255, 255, 255, 0.16)' } },
        strong: { value: { _light: 'rgba(0, 0, 0, 0.80)', _dark: 'rgba(255, 255, 255, 0.80)' } },

        // Rim that pairs with the shadows.glow effect. It stays white in both
        // modes because the glow it outlines is white in both modes.
        glow: { value: 'rgba(255, 255, 255, 0.80)' },
    },

    // Ink is the one colour that flips end to end with the mode. The same
    // value is text, the fill of primary buttons, tags and step markers, and
    // the outline of ghost controls, so it carries no fg/bg/border prefix.
    ink: {
        primary: { value: { _light: '#000000', _dark: '#FFFFFF' } },
        inverted: { value: { _light: '#FFFFFF', _dark: '#000000' } },
        hover: { value: { _light: '#1A202C', _dark: '#EDF2F7' } },
        muted: { value: { _light: '#4A5568', _dark: '#CBD5E0' } },
        subtle: { value: { _light: '#A0AEC0', _dark: '#718096' } },
    },

    // Surfaces, from the page backdrop up to the blurred nav. DEFAULT is the
    // one Chakra paints on <html>, so it matches the canvas.
    bg: {
        DEFAULT: { value: { _light: '#FFFFFF', _dark: '#020408' } },
        canvas: { value: { _light: '#FFFFFF', _dark: '#020408' } },
        surface: { value: { _light: '#FFFFFF', _dark: '#171923' } },
        track: { value: { _light: '#EDF2F7', _dark: '#1A202C' } },
        veil: { value: { _light: 'hsla(0, 0%, 100%, .75)', _dark: 'rgba(2, 4, 8, .75)' } },
    },

    // The orange hint tags. v2 drew these from its orange palette, whose hues
    // v3 no longer ships.
    tip: {
        fg: { value: { _light: '#7B341E', _dark: '#FBD38D' } },
        bg: { value: { _light: '#FEEBC8', _dark: 'rgba(251, 211, 141, 0.16)' } },
    },

    accent: { value: { _light: '#F6E05E', _dark: '#ECC94B' } },

    // The two ends of the loading skeleton's fade
    skeleton: {
        start: { value: { _light: '#EDF2F7', _dark: '#1A202C' } },
        end: { value: { _light: '#A0AEC0', _dark: '#4A5568' } },
    },
}

const semanticShadows = {
    glow: { value: 'rgba(255, 255, 255, 0.7) 0px 0px 76.9166px, rgba(255, 255, 255, 0.4) 0px 0px 26.3055px, rgba(255, 255, 255, 0.3) 0px 0px 13.1528px, rgb(255, 255, 255) 0px 0px 3.75793px, rgb(255, 255, 255) 0px 0px 1.87897px' },
    // The dark surface already reads as raised, so it needs no drop shadow
    menu: { value: { _light: '0 8px 32px rgba(0, 0, 0, 0.10)', _dark: 'none' } },
    switchTrack: { value: { _light: 'inset 0px -1px 4px rgba(0, 0, 0, 0.06)', _dark: 'inset 0px -1px 2px rgba(255, 255, 255, 0.1)' } },
    // v2's "base" shadow, which the range slider thumbs were drawn with
    thumb: { value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
    // The timetable popover asks for lg; v3's lg is a softer, tinted shadow
    lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
}

const config = defineConfig({
    globalCss: {
        body: {
            bg: 'bg.canvas',
            color: 'fg',
            fontFamily: 'body',
            lineHeight: '1.5',
        },
        '*::placeholder': {
            color: { base: '#718096', _dark: 'rgba(255, 255, 255, 0.24)' },
        },
    },
    theme: {
        // v3 moved lg from 992px to 1024px; the home page caps its width there
        breakpoints: {
            lg: '992px',
        },
        keyframes: {
            'skeleton-fade': {
                from: { background: 'var(--chakra-colors-skeleton-start)' },
                to: { background: 'var(--chakra-colors-skeleton-end)' },
            },
        },
        tokens: {
            fonts: {
                body: { value: FONT_STACK },
                heading: { value: FONT_STACK },
            },
        },
        semanticTokens: {
            colors: semanticColors,
            shadows: semanticShadows,
            // Buttons, inputs and selects round their corners with l2. v3 maps
            // it to 4px; v2 drew the same controls at 6px.
            radii: {
                l2: { value: '{radii.md}' },
            },
        },
        recipes: {
            // v2 set buttons semibold at 16px; v3 drops to medium at 14px. v3
            // also stops buttons shrinking in a flex row, which pushes a pair of
            // full-width toggles out past the edge of the settings menu.
            button: {
                base: {
                    fontWeight: 'semibold',
                    flexShrink: '1',
                },
                variants: {
                    size: {
                        md: {
                            textStyle: 'md',
                        },
                        // v3's smallest useful size is 32px, which overpowers a
                        // button that only sits alongside a line of footer text
                        compact: {
                            h: '30px',
                            minW: '30px',
                            textStyle: 'sm',
                            px: '3',
                            gap: '2',
                        },
                    },
                },
            },
            // v2's skeleton faded between two greys at 70% opacity with 2px
            // corners; v3 pulses a single lighter grey
            skeleton: {
                variants: {
                    loading: {
                        true: {
                            borderRadius: 'xs',
                        },
                    },
                    variant: {
                        pulse: {
                            background: 'skeleton.start',
                            opacity: '0.7',
                            animation: 'skeleton-fade 0.8s linear infinite alternate',
                            // v3's own pulse sets this longhand, which would
                            // otherwise outlast the shorthand above
                            animationDuration: '0.8s',
                        },
                    },
                },
            },
            // v2 links inherited their colour and underlined solidly on hover;
            // v3 tints them and draws a faint, offset underline
            link: {
                variants: {
                    variant: {
                        plain: {
                            color: 'inherit',
                            _hover: {
                                textUnderlineOffset: 'auto',
                                textDecorationColor: 'currentColor',
                            },
                        },
                    },
                },
            },
            // v2's large input was 48px; v3's is 44px
            input: {
                variants: {
                    size: {
                        lg: {
                            h: '12',
                            px: '4',
                        },
                    },
                },
            },
        },
        slotRecipes: {
            // v2's FormControl had no gap and set its error text at 14px with
            // 8px above it; v3's Field spaces its parts and drops to 12px
            field: {
                base: {
                    root: {
                        gap: '0',
                    },
                    errorText: {
                        mt: '2',
                        textStyle: 'sm',
                    },
                },
            },
            nativeSelect: {
                variants: {
                    size: {
                        sm: {
                            field: { h: '8', ps: '3', pe: '8' },
                        },
                        lg: {
                            field: { h: '12', ps: '4', pe: '10' },
                        },
                    },
                },
            },
            // v2 drew the switch as a track padded 2px inside a 1px border, with
            // a full-size thumb. v3 has no padding and shrinks its thumb to 80%,
            // so the geometry is rebuilt on v3's own width and height variables,
            // which its checked-state translate is already derived from.
            switch: {
                base: {
                    control: {
                        boxSizing: 'content-box',
                        p: '2px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'border.subtle',
                        boxShadow: 'switchTrack',
                    },
                    thumb: {
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'border.subtle',
                    },
                },
                variants: {
                    variant: {
                        solid: {
                            control: {
                                bg: 'bg.track',
                                _checked: {
                                    bg: 'ink.primary',
                                },
                            },
                            thumb: {
                                scale: '1',
                                boxShadow: 'none',
                                _checked: {
                                    bg: 'white',
                                },
                            },
                        },
                    },
                    size: {
                        md: {
                            root: {
                                '--switch-width': '1.875rem',
                                '--switch-height': '1rem',
                            },
                        },
                        lg: {
                            root: {
                                '--switch-width': '3rem',
                                '--switch-height': '1.5rem',
                            },
                        },
                    },
                },
            },
            // The two former 'black' and 'white' variants only differed by which
            // end of the mode they painted the selected tab, so the tokens
            // collapse them into one. It stays a named variant, and the default,
            // because Chakra's built-in 'line' variant would otherwise layer its
            // own underline on top.
            tabs: {
                variants: {
                    variant: {
                        toggle: {
                            list: {
                                borderColor: 'inherit',
                            },
                            trigger: {
                                bg: 'transparent',
                                borderRadius: 'md',
                                h: 'auto',
                                minW: '0',
                                p: '3',
                                textStyle: 'md',
                                fontWeight: 'normal',
                                justifyContent: 'center',
                                color: 'ink.subtle',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: 'border.subtle',
                                _selected: {
                                    bg: 'ink.primary',
                                    color: 'ink.inverted',
                                    fontWeight: 'bold',
                                    borderColor: 'inherit',
                                    borderBottomWidth: '0',
                                },
                            },
                            content: {
                                borderColor: 'inherit',
                                borderBottomRadius: 'lg',
                                borderTopRightRadius: 'lg',
                            },
                        },
                    },
                },
                defaultVariants: {
                    variant: 'toggle',
                },
            },
        },
    },
})

const system = createSystem(defaultConfig, config)

export default system
