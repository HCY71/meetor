import {
    HStack,
    Center,
} from '@chakra-ui/react'
import { MenuIconComposition } from './SideBar'
import SideBar from './SideBar'
import { useRouter } from 'next/navigation'
import { colors } from '@/public/theme'
import { useColorMode } from '@chakra-ui/react'

const Navbar = ({ loading }) => {
    if (loading) return (
        <Template>
            <Center
                bg='transparent'
                userSelect='none'
                cursor='pointer'
                w='120px'
                h='80px'
            >
                <MenuIconComposition
                    w={ '35%' }
                    transform={ 'translate(0, -90%)' }
                />
                <MenuIconComposition
                    w={ '20%' }
                    transform={ 'translate(30%, 90%)' }
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


const Template = ({ children }) => {
    const { colorMode } = useColorMode()
    const router = useRouter()
    const goHome = () => {
        router.push('/')
    }
    return (
        <HStack
            w='100%'
            pos='fixed'
            top='0'
            h={ { base: '60px', md: '80px' } }
            justifyContent='space-between'
            borderBottom={ colors[ colorMode ].border.nav }
            bg={ colors[ colorMode ].bg.nav.primary }
            backdropFilter='saturate(200%) blur(6px)'
            zIndex={ 1 }
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
    )
}
export default Navbar