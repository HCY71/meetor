import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react"
import Link from "next/link"
import CustomButton from "@/components/atoms/CustomButton"
import { useLang } from "@/context/LangContext"
import { useConfigs } from "@/context/ConfigsContext"
import useLocalStorage from "@/hooks/useLocalStorage"
import useDate from "@/hooks/useDate"
import { getTimeDistance } from "@/public/utils/timeFormat"

const RecentVisited = () => {
    const [ recent, setRecent ] = useLocalStorage('meetor_recent', [])
    const { currentDate } = useDate()
    const { context } = useLang()
    const { configs } = useConfigs()

    if (!Array.isArray(recent) || recent.length === 0) return null

    return (
        <VStack
            as='section'
            aria-labelledby='recent-events-heading'
            align='stretch'
            gap='3'
            bg='bg.surface'
            borderWidth='1px'
            borderColor='border.subtle'
            borderRadius='md'
            p='4'
            w='100%'
            maxW='520px'
            mt={ { base: '1rem', md: '1.5rem' } }
        >
            <HStack justify='space-between' gap='2'>
                <Text as='h2' id='recent-events-heading' fontSize={ { base: 'md', md: 'lg' } } fontWeight='bold'>
                    { context.home.recent }
                </Text>
                <CustomButton
                    ghost
                    type='button'
                    size='xs'
                    h='6'
                    px='2'
                    flexShrink={ 0 }
                    fontWeight='medium'
                    color='ink.muted'
                    borderColor='border.subtle'
                    borderRadius='sm'
                    focusRingColor='ink.primary'
                    _hover={ { color: 'ink.primary', borderColor: 'ink.subtle' } }
                    onClick={ () => setRecent([]) }
                >
                    { context.home.clear }
                </CustomButton>
            </HStack>
            <Grid as='ul' gap='2' listStyle='none' m='0' p='0'>
                { [ ...recent ].reverse().map((event) => (
                    <Box as='li' key={ event.id }>
                        <Grid
                            asChild
                            templateColumns={ { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' } }
                            alignContent='center'
                            alignItems='baseline'
                            rowGap='0.5'
                            columnGap='3'
                            minH='6'
                            borderRadius='md'
                            focusVisibleRing='outside'
                            focusRingColor='ink.primary'
                        >
                            <Link href={ `/events/${event.id}` } className='group'>
                                <Text
                                    as='span'
                                    fontSize='sm'
                                    fontWeight='semibold'
                                    overflowWrap='anywhere'
                                    textUnderlineOffset='2px'
                                    _groupHover={ { textDecoration: 'underline' } }
                                >
                                    { event.name }
                                </Text>
                                <Text as='span' fontSize='xs' color='ink.muted'>
                                    { context.event.createdAt + getTimeDistance(event, currentDate, configs.lang) + context.event.ago }
                                </Text>
                            </Link>
                        </Grid>
                    </Box>
                )) }
            </Grid>
        </VStack>
    )
}

export default RecentVisited
