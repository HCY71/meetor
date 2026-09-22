import {
    Box,
    HStack,
    Center,
} from '@chakra-ui/react'
import { MenuIconComposition } from './SideBar'
import SideBar from './SideBar'
import { useRouter } from 'next/navigation'

const Navbar = ({ loading }) => {
    if (loading) return (
        <Template>
            <Center
                bg='transparent'
                userSelect='none'
                cursor='pointer'
                h='100%'
                w='36px'
            >
                <MenuIconComposition
                    w={ '100%' }
                    transform={ 'translate3d(0, -100%, 0) rotate(0deg)' }
                />
                <MenuIconComposition
                    w={ '67%' }
                    transform={ 'translate3d(25%, 100%, 0) rotate(0deg)' }
                />
            </Center>
        </Template>
    )
    return (
        <Template>
            <SideBar />
        </Template>
    )
}


// One backdrop-filter can only apply a single radius, so it stops dead at the
// edge of the bar and needs a rule to hide the seam. Each layer here is masked
// to a band nearer the top, so the passes accumulate upward and the blur thins
// out to clear pixels on its own. The percentages are read from the bottom
// because the mask runs to top.
//
// Three layers rather than more: each one is a separate backdrop-filter pass on
// every scroll frame, and a fourth was not worth the cost.
const BLUR_LAYERS = [
    { radius: 4, clearUntil: 0, opaqueFrom: 33 },
    { radius: 10, clearUntil: 33, opaqueFrom: 66 },
    { radius: 24, clearUntil: 66, opaqueFrom: 100 },
]

const ProgressiveBlur = () => {
    return (
        <Box
            pos='fixed'
            top='0'
            left='0'
            w='100%'
            h={ { base: '85px', md: '115px' } }
            zIndex={ 9 }
            pointerEvents='none'
        >
            { BLUR_LAYERS.map(({ radius, clearUntil, opaqueFrom }) => {
                const mask = `linear-gradient(to top, transparent ${clearUntil}%, #000 ${opaqueFrom}%)`
                return (
                    <Box
                        key={ radius }
                        pos='absolute'
                        inset='0'
                        css={ {
                            backdropFilter: `blur(${radius}px)`,
                            WebkitBackdropFilter: `blur(${radius}px)`,
                            maskImage: mask,
                            WebkitMaskImage: mask,
                        } }
                    />
                )
            }) }
            { /* Tint sits above the blur so the bar keeps enough contrast for
                 its own text, and stops well before the bottom so the ramp
                 stays visible rather than turning into a solid band */ }
            <Box
                pos='absolute'
                inset='0'
                css={ {
                    background: 'linear-gradient(to bottom, var(--chakra-colors-bg-veil), transparent 70%)',
                } }
            />
        </Box>
    )
}

const Template = ({ children }) => {
    const router = useRouter()
    const goHome = () => {
        router.push('/')
    }
    return (
        <>
            <ProgressiveBlur />
            <HStack
                w='100%'
                pos='fixed'
                top='0'
                h={ { base: '60px', md: '80px' } }
                justifyContent='space-between'
                zIndex={ 10 }
                transition='.2s'
                p={ { base: '0 12px', md: '0 40px' } }
            >
                <Center
                    fontWeight='bold'
                    fontSize={ '20px' }
                    onClick={ goHome }
                    cursor='pointer'
                    h='100%'
                >
                    Meetor
                </Center>
                { children }
            </HStack>
        </>
    )
}
export default Navbar