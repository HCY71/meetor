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

export default function Home() {
  const { context } = useLang()
  const [ name, setName ] = useLocalStorage('name', '')
  const [ recent ] = useLocalStorage('recent', [])

  useEffect(() => {
    if (name) setName()
  }, [ name ])
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
        <Subtitle>
          13,210 { context.home.subheader }
        </Subtitle>
      </VStack >
      <RecentVisited />
      <Form />
    </>
  )
}
