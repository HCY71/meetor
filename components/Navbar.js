import {
    HStack,
    Text,
    Button
} from '@chakra-ui/react'
import { MenuIconComposition } from './SideBar'
import { useRouter } from 'next/navigation'
import SideBar from './SideBar'
import { colors } from '@/public/theme'
import { useColorMode } from '@chakra-ui/react'

const Navbar = ({ loading }) => {
    const { colorMode } = useColorMode()
    const router = useRouter()
    const goHome = () => {
        router.push('/')
    }
    if (loading) return (
        <HStack
            w='100%'
            pos='fixed'
            top='0'
            h='80px'
            p={ { base: 5, md: 10 } }
            justifyContent='space-between'
            borderBottom={ colors[ colorMode ].border.nav }
            bg={ colors[ colorMode ].bg.nav }
            backdropFilter='saturate(200%) blur(6px)'
            zIndex={ 1 }
            transition='.2s'
        >
            <Text fontWeight='bold' onClick={ goHome }>
                Meetor
            </Text>
            <Button
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
            </Button>
        </HStack>
    )
    return (
        <HStack
            w='100%'
            pos='fixed'
            top='0'
            h='80px'
            p={ { base: 5, md: 10 } }
            justifyContent='space-between'
            borderBottom={ colors[ colorMode ].border.nav }
            bg={ colors[ colorMode ].bg.nav }
            backdropFilter='saturate(200%) blur(6px)'
            zIndex={ 1 }
            transition='.2s'
        >
            <Text fontWeight='bold' onClick={ goHome }>
                Meetor
            </Text>
            <SideBar />
        </HStack>
    )
}

export default Navbar