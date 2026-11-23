import { Box, HStack, Text } from "@chakra-ui/react"
import DonateButton from "./atoms/DonateButton"
import { useLang } from "@/context/LangContext"

const Footer = ({ loading }) => {
    const { context } = useLang()
    return (
        <HStack
            as='footer'
            visibility={ loading ? 'hidden' : undefined }
            borderTopWidth='1px'
            borderTopStyle='solid'
            borderTopColor='border.faint'
            bg='bg.veil'
            backdropFilter='saturate(120%) blur(8px)'
            zIndex={ 1 }
            p={ { base: '8px 20px', md: '12px 40px' } }
            transition='background-color .2s, border-color .2s'
            justify='center'
            gap={ 2 }
            fontSize={ { base: '.75rem', md: '1rem' } }
            mt='20px'
        >
            { loading ? <Box h='30px' /> : (
                <>
                    <Text opacity={ .9 }>{ context.global.footer.title }</Text>
                    <DonateButton />
                </>
            ) }
        </HStack >
    )
}

export default Footer
