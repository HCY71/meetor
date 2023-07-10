'use client'
import { useEffect } from 'react'
import {
  VStack,
  Center,
} from '@chakra-ui/react'
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
  const [ name, setName ] = useLocalStorage('name', '')
  const { data, isLoading, GET_COUNT } = useSupabase()

  useEffect(() => {
    if (name) setName()
  }, [ name ])

  useEffect(() => {
    GET_COUNT('events', '*')
  }, [])

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
        </VStack>
        { (!isLoading & data) &&
          <Subtitle>
            { numberWithCommas(data + 1310) } { context.home.subheader }
          </Subtitle>
        }
      </VStack >
      <RecentVisited />
      <Form />
    </>
  )
}
