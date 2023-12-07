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
import { useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

export default function Home() {
  const { context } = useLang()
  const [ name, setName ] = useLocalStorage('name', '')
  const [ showCounter, setShowCounter ] = useState(false)
  const { data, isLoading, GET_COUNT } = useSupabase()

  const { colorMode } = useColorMode()

  useEffect(() => {
    if (name) setName()
  }, [ name ])

  useEffect(() => {
    GET_COUNT('events', '*')
  }, [])

  useEffect(() => {
    if (!isLoading && data) setShowCounter(true)
  }, [ isLoading, data ])


  return (
    <>
      <VStack spacing={ { base: 3, md: 5 } }>
        <VStack
          spacing='0'
          maxW={ { base: '100%', lg: '900px' } }
        >
          <Header>
            { context.home.header.first }
          </Header>
          <Header>
            { context.home.header.second }
          </Header>
          <Text fontSize={ { base: '14px', md: '16px' } } mt={ { base: '8px', md: '20px' } } w={ { base: '100%', md: '60%' } } color={ colors[ colorMode ].font.dim } maxW={ { base: '520px', md: 'unset' } }>
            { context.home.description }
          </Text>
        </VStack>
        { (showCounter) ?
          <Subtitle>
            { numberWithCommas(data + 1310) } { context.home.subheader }
          </Subtitle> :
          <Skeleton w={ { base: '60%', md: '30%' } } h={ { base: '24px', md: '32px' } } />
        }
      </VStack >
      <RecentVisited />
      <Form />
    </>
  )
}


