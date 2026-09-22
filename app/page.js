'use client'
import { useEffect, useState } from 'react'
import { VStack, Skeleton, Text } from '@chakra-ui/react'
import Form from '../components/Form'
import Header from '../components/atoms/Header'
import Subtitle from '../components/atoms/Subtitle'
import RecentVisited from '@/components/cells/RecentVisited'
import { useLang } from '@/context/LangContext'

import useLocalStorage from '@/hooks/useLocalStorage'
import useSupabase from '@/hooks/useSupabase'

import { numberWithCommas } from '@/public/utils/numberFormatter'

export default function Home() {
  const { context } = useLang()
  const [ name, setName ] = useLocalStorage('meetor_name', '')

  const [ showCounter, setShowCounter ] = useState(false)
  const { data, isLoading, error, GET_EVENT_TOTAL } = useSupabase()

  useEffect(() => {
    if (name) setName()
  }, [ name ])

  useEffect(() => {
    const abortController = new AbortController()

    const fetchEventTotal = async () => {
      await GET_EVENT_TOTAL(abortController.signal)
    }
    fetchEventTotal()

    return () => {
      abortController.abort()
    }
  }, [ GET_EVENT_TOTAL ])

  useEffect(() => {
    if (!isLoading && typeof data === 'number') setShowCounter(true)
  }, [ isLoading, data ])

  return (
    <>
      <VStack spacing={ { base: 3, md: 5 } }>
        <VStack
          spacing='0'
          maxW={ { base: '100%', lg: '900px' } }
        >
          <Header>
            { context.home.header }
          </Header>
          <Text fontSize={ { base: '14px', md: '16px' } } mt={ { base: '8px', md: '20px' } } w={ { base: '100%', md: '60%' } } color='ink.muted' maxW={ { base: '520px', md: 'unset' } }>
            { context.home.description }
          </Text>
        </VStack>
        { (showCounter) ?
          <Subtitle>
            { numberWithCommas(data) } { context.home.subheader }
          </Subtitle> :
          // Hide The Counter Row Entirely If The Count Failed, A Skeleton
          // Should Only Show While The Request Is Still In Flight.
          !error && <Skeleton w={ { base: '60%', md: '30%' } } h={ { base: '24px', md: '32px' } } />
        }
      </VStack >

      <RecentVisited />
      <Form />
    </>
  )
}
