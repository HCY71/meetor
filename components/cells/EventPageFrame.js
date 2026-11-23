import { HStack, VStack } from '@chakra-ui/react'

export const eventTitleSize = { base: '1.75rem', md: '2.25rem' }

const EventPageFrame = ({ title, metadata, actions, children, loading }) => (
    <VStack aria-busy={ loading || undefined } gap='3' w='520px' maxW='100%' mt={ { md: '-24px' } }>
        <HStack as='header' aria-hidden={ loading || undefined } w='100%' align='flex-start' gap='3'>
            <VStack flex='1' minW='0' align='stretch' gap='1'>
                { title }
                { metadata }
            </VStack>
            <HStack gap='1.5' flexShrink={ 0 }>
                { actions }
            </HStack>
        </HStack>
        { children }
    </VStack>
)

export default EventPageFrame
