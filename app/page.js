'use client'
import { useEffect, useState } from 'react'
import { VStack, Skeleton, Text } from '@chakra-ui/react'
import Form from '../components/Form'
import Header from '../components/atoms/Header'
import Subtitle from '../components/atoms/Subtitle'
import RecentVisited from '@/components/cells/RecentVisited'
import UpdateModal from '@/components/cells/UpdateModal'
import { useLang } from '@/context/LangContext'
import { useConfigs } from '@/context/ConfigsContext'

import useLocalStorage from '@/hooks/useLocalStorage'
import useSupabase from '@/hooks/useSupabase'

import { numberWithCommas } from '@/public/utils/numberFormatter'
import { useColorMode, useDisclosure } from '@chakra-ui/react'
import { colors } from '@/public/theme'
import { isBefore } from "date-fns"

export default function Home() {
  const { context } = useLang()
  const { configs } = useConfigs()
  const [ name, setName ] = useLocalStorage('meetor_name', '')
  const [ isUpdateReadEn ] = useLocalStorage('meetor_update_timezone_read_en')
  const [ isUpdateReadZh ] = useLocalStorage('meetor_update_timezone_read_zh')

  const [ showCounter, setShowCounter ] = useState(false)
  const { data, isLoading, GET_COUNT } = useSupabase()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { colorMode } = useColorMode()

  useEffect(() => {
    if (name) setName()
  }, [ name ])

  useEffect(() => {
    const fetchData = async () => {
      await GET_COUNT('events', '*')
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!isLoading && data) setShowCounter(true)
  }, [ isLoading, data ])

  useEffect(() => {
    const isOutdated = isBefore(new Date(), new Date('2025/01/30'))
    if (configs.lang === 'en') {
      if (!(isUpdateReadEn) && isOutdated) onOpen()
    } else {
      if (!(isUpdateReadZh) && isOutdated) onOpen()
    }
  }, [])

  return (
    <>
      <UpdateModal controls={ { isOpen, onClose } } />
      <VStack spacing={ { base: 3, md: 5 } }>
        <VStack
          spacing='0'
          maxW={ { base: '100%', lg: '900px' } }
        >
          <Header>
            { context.home.header }
          </Header>
          <Text fontSize={ { base: '14px', md: '16px' } } mt={ { base: '8px', md: '20px' } } w={ { base: '100%', md: '60%' } } color={ colors[ colorMode ].font.dim } maxW={ { base: '520px', md: 'unset' } }>
            { context.home.description }
          </Text>
        </VStack>
        { (showCounter) ?
          <Subtitle>
            { numberWithCommas(data + 1120) } { context.home.subheader }
          </Subtitle> :
          <Skeleton w={ { base: '60%', md: '30%' } } h={ { base: '24px', md: '32px' } } />
        }
      </VStack >

      <RecentVisited />
      <Form />
    </>
  )
}


