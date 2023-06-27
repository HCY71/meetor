'use client'
import {
  VStack,
} from '@chakra-ui/react'
import Form from '../components/Form'
import Header from '../components/atoms/Header'
import Subtitle from '../components/atoms/Subtitle'

export default function Home() {
  return (
    <>
      <VStack spacing={ 5 }>
        <VStack
          className='max-width'
          spacing='0'
        >
          <Header>
            Just Create an Event
          </Header>
          <Header>
            Scheduler and Simply Share It.
          </Header>
        </VStack>
        <Subtitle>
          13,210 events scheduled.
        </Subtitle>
      </VStack>
      <Form />
    </>
  )
}
