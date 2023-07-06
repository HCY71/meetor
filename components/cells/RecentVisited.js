import { VStack, HStack, Center } from "@chakra-ui/react"
import Link from "next/link"
import { useLang } from "@/context/LangContext"
import { useConfigs } from "@/context/ConfigsContext"
import { useColorMode } from "@chakra-ui/react"
import useLocalStorage from "@/hooks/useLocalStorage"
import useDate from "@/hooks/useDate"
import { getTimeDistance } from "@/public/utils/timeFormat"
import { colors } from "@/public/theme"

const RecentVisited = () => {
    const [ recent, setRecent ] = useLocalStorage('recent', [])
    const { currentDate } = useDate()
    const { context } = useLang()
    const { configs } = useConfigs()
    const { colorMode } = useColorMode()

    if (!recent || !recent.length) return

    return (
        <VStack bg={ colors[ colorMode ].bg.nav.invert } borderRadius='md' p={ 5 } color={ colors[ colorMode ].font.invert } w='520px'>
            <HStack alignSelf='flex-start'>
                <Center fontWeight='bold' fontSize='20px' >{ context.home.recent }</Center>
                <Center
                    fontSize='0.75rem'
                    fontWeight='medium'
                    color={ colors[ colorMode ].font.invert }
                    borderColor={ colors[ colorMode ].bg.invert }
                    cursor='pointer'
                    p={ 1 }
                    border='solid 1px'
                    borderRadius='md'
                    onClick={ () => setRecent() }
                >
                    { context.home.clear }
                </Center>
            </HStack>
            { recent && (typeof (recent) === 'object') ? recent : JSON.parse(recent).reverse().map(r => (
                <Link href={ `/${process.env.NEXT_PUBLIC_DOMAIN}/events/${r.id}` } className="next-link-custom" key={ r.id }>
                    <HStack justify='space-between' p={ '0 16px' } >
                        <Center fontWeight='bold' fontSize='20px'>{ r.name }</Center>
                        <Center fontSize='14px'> { context.event.createdAt + getTimeDistance(r, currentDate, configs.lang) + context.event.ago } </Center>
                    </HStack>
                </Link>
            )) }
        </VStack>
    )
}

export default RecentVisited