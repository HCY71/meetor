'use client'
import { Box, Image, Divider, Link } from "@chakra-ui/react"
import { useLang } from "@/context/LangContext"
import { useColorMode } from "@chakra-ui/react"
import { colors } from "@/public/theme"

import { GAclickEvent } from '@/public/utils/GA'

const page = () => {
    const { context } = useLang()
    const { colorMode } = useColorMode()
    return (
        <Box maxW='520px'>
            <Image src="./banner.png" w='100%' alt="meetor alt image" />
            <BodyText mt='5'>{ context.about.description }</BodyText>
            <H2>{ context.about.meetorOverview }</H2>
            <BodyText>{ context.about.meetorOverviewDescription }</BodyText>
            <H1>How to Use Meetor</H1>
            <Box display='flex' flexDir='column' gap='6'>
                { context.about.meetorSteps.map((step, i) => (
                    <Box key={ i }>
                        <ListItem num={ '0' + (i + 1) }>{ step.title }</ListItem>
                        <BodyText mt='1' mx='1' whiteSpace='pre-line'>{ step.content }</BodyText>
                        <Image src={ step.image } mt='2' maxW='100%' alt={ 'step' + (i + 1) + ' description' } borderRadius='8px' />
                    </Box>
                )) }
            </Box>
            <Divider mt='10' bg={ colors[ colorMode ].border.dim } />
            <H1>About Author</H1>
            <Box display='flex' mt='5' gap={ { base: '8', md: '10' } }>
                <Box>
                    <Image src="./man.png" alt="profile picture" w={ '120px' } h='auto' />
                </Box>
                <Box>
                    <Box display='flex' flexDir={ { base: 'column', md: 'row' } } gap='2' alignItems={ { base: 'start', md: 'end' } }>
                        <H2 lineHeight={ { base: .5, md: '1.15' } }>Erkin Hsu</H2>
                        <BodyText textAlign='left'>A Frontend Developer</BodyText>
                    </Box>
                    <Link href="mailto:contact@erkin-portfolio.com" fontWeight='bold' rel="noopener noreferrer" target="_blank" mt='2' display='block'>contact@erkin-portfolio.com</Link>
                    <Box display='flex' gap='3' mt='5' alignSelf='end'>
                        <Link href="https://github.com/HCY71" rel="noopener noreferrer" target="_blank" _hover={ { textDecor: 'none', transform: 'scale(1.03)' } } transition='.2s' onClick={ () => GAclickEvent('about_page', 'github') }>
                            <Box fontWeight='bold' border='solid 1px' borderColor={ colors[ colorMode ].bg.invert } fontSize='14px' p='6px 12px' borderRadius='5px' className="link-button">Github <Box as={ 'span' } transition='.2s' display='inline-block'>➚</Box></Box>
                        </Link>
                        <Link href="https://erkin-portfolio.com" rel="noopener noreferrer" target="_blank" _hover={ { textDecor: 'none', transform: 'scale(1.03)' } } transition='.2s' onClick={ () => GAclickEvent('about_page', 'website') }>
                            <Box fontWeight='bold' border='solid 1px' borderColor={ colors[ colorMode ].bg.invert } fontSize='14px' p='6px 12px' borderRadius='5px' className="link-button">Website <Box as={ 'span' } transition='.2s' display='inline-block'>➚</Box></Box>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const BodyText = ({ children, ...props }) => {
    const { colorMode } = useColorMode()
    return (
        <Box color={ colors[ colorMode ].font.dim } { ...props }>{ children }</Box>
    )
}
const H1 = ({ children, ...props }) => {
    return (
        <Box as='h1' fontSize={ { base: '4xl' } } lineHeight='2' fontWeight='extrabold' { ...props }>{ children }</Box>
    )
}
const H2 = ({ children, ...props }) => {
    return (
        <Box as='h2' fontSize={ { base: '3xl' } } lineHeight='1.2' mt='12px' fontWeight='extrabold' { ...props }>{ children }</Box>
    )
}

const ListItem = ({ num, children }) => {
    return (
        <Box display='flex' fontFamily='mono' gap='2' fontWeight='bold' alignItems='end'>
            <Box as="span" fontSize='4xl' lineHeight='1.2'>{ num }</Box>
            <Box fontSize='2xl'>{ children }</Box>
        </Box>
    )
}

export default page