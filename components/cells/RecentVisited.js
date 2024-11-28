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
    const [ recent, setRecent ] = useLocalStorage('meetor_recent', [])
    const { currentDate } = useDate()
    const { context } = useLang()
    const { configs } = useConfigs()
    const { colorMode } = useColorMode()

    if (!recent || !recent.length) return

    return (
        <VStack
            bg={ colors[ colorMode ].bg.nav.invert }
            borderRadius='md' p={ 5 }
            color={ colors[ colorMode ].font.invert }
            w='100%'
            maxW={ { base: '100%', md: '520px' } }
            fontSize={ { base: '1rem', md: '1.25rem' } }
            mt={ { base: '1rem', md: '1.5rem' } }
        >
            <HStack alignSelf='flex-start'>
                <Center fontWeight='bold' >{ context.home.recent }</Center>
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
            { recent && [ ...recent ].reverse().map(r => (
                <Link href={ `/events/${r.id}` } className="next-link-custom" key={ r.id }>
                    <HStack justify='space-between' p={ { base: '0 8px', md: '0 16px' } } >
                        <Center fontWeight='bold'>{ r.name }</Center>
                        <Center fontSize={ { base: '.75rem', md: '.875rem' } } textAlign={ 'right' }> { context.event.createdAt + getTimeDistance(r, currentDate, configs.lang) + context.event.ago } </Center>
                    </HStack>
                </Link>
            )) }
        </VStack>
    )
}

export default RecentVisited