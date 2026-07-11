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
  const { data, isLoading, error, GET_EVENT_TOTAL } = useSupabase()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { colorMode } = useColorMode()

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
