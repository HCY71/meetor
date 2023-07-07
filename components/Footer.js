import { HStack, Text, useColorMode } from "@chakra-ui/react"
import DonateButton from "./atoms/DonateButton"
import { colors } from "@/public/theme"
import { useLang } from "@/context/LangContext"

const Footer = () => {
    const { colorMode } = useColorMode()
    const { context } = useLang()
    return (
        <HStack
            borderTop={ colors[ colorMode ].border.nav }
            bg={ colors[ colorMode ].bg.nav.primary }
            backdropFilter='saturate(200%) blur(6px)'
            zIndex={ 1 }
            p={ { base: '4px 20px', md: '12px 40px' } }
            transition='.2s'
            justify='center'
            spacing={ 2 }
            fontSize={ { base: '.75rem', md: '1rem' } }
            mt='20px'
        >
            <Text opacity={ .9 } color={ colors[ colorMode ].font.default }>{ context.global.footer.title }</Text>
            <DonateButton />
        </HStack >
    )
}

export default Footer