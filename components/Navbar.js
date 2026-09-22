import {
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


const Template = ({ children }) => {
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
            borderBottomWidth='1px'
            borderBottomStyle='solid'
            borderBottomColor='border.subtle'
            bg='bg.veil'
            backdropFilter='saturate(100%) blur(8px)'
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
    )
}
export default Navbar