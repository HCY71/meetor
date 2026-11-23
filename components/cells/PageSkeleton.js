import { Center, Grid, HStack, Skeleton, SkeletonCircle, VStack } from '@chakra-ui/react'
import EventPageFrame, { eventTitleSize } from './EventPageFrame'

export const EventCountSkeleton = () => <Skeleton aria-hidden w='12rem' maxW='100%' h='6' />

const SkeletonStep = ({ labelWidth, children, ...props }) => (
    <VStack w='100%' align='stretch' { ...props }>
        <HStack gap='2'>
            <SkeletonCircle size='30px' />
            <Skeleton w={ labelWidth } h='4' />
        </HStack>
        { children }
    </VStack>
)

const SkeletonTabs = () => (
    <Grid w='100%' templateColumns='repeat(2, minmax(0, 1fr))' gap='1.5'>
        <Skeleton h='50px' borderRadius='md' />
        <Skeleton h='50px' borderRadius='md' />
    </Grid>
)

const SkeletonGrid = ({ columns, rows, cellHeight }) => (
    <Grid w='100%' templateColumns={ `repeat(${columns}, minmax(0, 1fr))` } gap='0.5'>
        { Array.from({ length: columns * rows }, (_, index) => (
            <Skeleton key={ index } h={ cellHeight } />
        )) }
    </Grid>
)

const HomePageSkeleton = () => (
    <VStack aria-busy='true' w='100%' gap='2'>
        <VStack aria-hidden w='100%' gap={ { base: '3', md: '5' } }>
            <VStack w='100%' gap='0'>
                <VStack w='100%' gap='0' fontSize={ { base: '2.75rem', md: '4rem' } }>
                    <Center w='100%' h='1.15em'><Skeleton w='4.5em' maxW='90%' h='0.75em' /></Center>
                    <Center w='100%' h='1.15em'><Skeleton w='4.55em' maxW='90%' h='0.75em' /></Center>
                </VStack>
                <VStack
                    w='100%'
                    maxW='52ch'
                    mt={ { base: '8px', md: '20px' } }
                    fontSize={ { base: '14px', md: '16px' } }
                    gap='0'
                >
                    <Center w='100%' h='1.5em'><Skeleton w='92%' h='0.75em' /></Center>
                    <Center w='100%' h='1.5em'><Skeleton w='87%' h='0.75em' /></Center>
                    <Center w='100%' h='1.5em' hideFrom='md'><Skeleton w='55%' h='0.75em' /></Center>
                </VStack>
            </VStack>
            <EventCountSkeleton />
        </VStack>

        <VStack aria-hidden w='520px' maxW='100%' mt={ { base: '5', md: '10' } } gap={ { base: '5', md: '10' } }>
            <SkeletonStep labelWidth='40%'>
                <Skeleton w='100%' h='12' />
            </SkeletonStep>
            <SkeletonStep labelWidth='32%'>
                <SkeletonTabs />
                <VStack w='100%' align='stretch' py='4'>
                    <Skeleton w='43%' h='6' />
                    <Center h={ { base: '6', md: '9' } }><Skeleton w='36%' h='4' /></Center>
                    <SkeletonGrid columns={ 7 } rows={ 1 } cellHeight='4' />
                    <SkeletonGrid columns={ 7 } rows={ 5 } cellHeight='52px' />
                </VStack>
            </SkeletonStep>
            <SkeletonStep labelWidth='50%'>
                <Skeleton alignSelf='center' w='81%' h='3.5' borderRadius='full' />
            </SkeletonStep>
            <SkeletonStep labelWidth='25%' mt={ { base: '5', md: '10' } }>
                <Skeleton w='100%' h='12' />
            </SkeletonStep>
            <Skeleton w='5.5rem' h='9' mt='10' />
        </VStack>
    </VStack>
)

export const EventPageSkeleton = () => (
    <EventPageFrame
        loading
        title={
            <Center justifyContent='flex-start' fontSize={ eventTitleSize } h='1.2em'>
                <Skeleton w='76%' h='0.8em' />
            </Center>
        }
        metadata={
            <Center justifyContent='flex-start' fontSize='sm' h='1.5em'>
                <Skeleton w='8rem' maxW='100%' h='0.75em' />
            </Center>
        }
        actions={ <><SkeletonCircle size='10' /><SkeletonCircle size='10' /></> }
    >
        <SkeletonStep aria-hidden labelWidth='38%' mt='3' gap='1.5'>
            <HStack w='100%' gap='2'>
                <Skeleton flex='1' h='9' />
                <Skeleton w='5.5rem' h='9' />
            </HStack>
        </SkeletonStep>
        <SkeletonStep aria-hidden labelWidth='36%' gap='1.5'>
            <SkeletonTabs />
            <VStack w='100%' align='stretch' gap='2' py='2'>
                <HStack w='100%' minH='8' justify='space-between' gap='2'>
                    <Skeleton w='42%' h='8' />
                    <Skeleton w='29%' h='6' />
                </HStack>
                <HStack w='100%' minH='6' justify='space-between' gap='2'>
                    <Skeleton w='22%' h='3' />
                    <Skeleton w='25%' h='3' />
                </HStack>
                <SkeletonGrid columns={ 4 } rows={ 1 } cellHeight='5' />
                <SkeletonGrid columns={ 4 } rows={ 6 } cellHeight={ { base: '28px', md: '30px' } } />
            </VStack>
        </SkeletonStep>
    </EventPageFrame>
)

const PageSkeleton = ({ pathname }) => {
    if (pathname === '/') return <HomePageSkeleton />
    if (pathname?.startsWith('/events/')) return <EventPageSkeleton />

    return (
        <VStack aria-busy='true' w='520px' maxW='100%' gap='4'>
            <Skeleton aria-hidden w='65%' h='10' />
            <Skeleton aria-hidden w='100%' h='4' />
            <Skeleton aria-hidden w='85%' h='4' />
        </VStack>
    )
}

export default PageSkeleton
