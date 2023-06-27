import {
    HStack,
    Text
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import SideBar from './SideBar'
import { colors } from '@/public/theme'
import { useColorMode } from '@chakra-ui/react'

const Navbar = () => {
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
                Meet Me
            </Text>
            <SideBar />
        </HStack>
    )
}

export default Navbar