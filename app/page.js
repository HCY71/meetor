'use client'
import { useEffect } from 'react'
import {
  VStack,
} from '@chakra-ui/react'
import Form from '../components/Form'
import Header from '../components/atoms/Header'
import Subtitle from '../components/atoms/Subtitle'
import { useLang } from '@/context/LangContext'

import useLocalStorage from '@/hooks/useLocalStorage'

export default function Home() {
  const { context } = useLang()
  const [ name, setName ] = useLocalStorage('name', '')

  useEffect(() => {
    if (name) setName()
  }, [ name ])
  return (
    <>
      <VStack spacing={ 5 }>
        <VStack
          className='max-width'
          spacing='0'
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
      </VStack>
      <Form />
    </>
  )
}
