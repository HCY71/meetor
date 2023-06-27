import {
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Center,
    HStack,
    useColorMode
} from '@chakra-ui/react'
import { toast } from 'react-hot-toast'

const CustomTabs = ({ onMouseDown = [ null, null ], tab, panel, isDisabled = false, inputRef = null, ...props }) => {
    const handleDisable = () => {
        toast('Fill your name first.', {
            icon: '😵‍💫',
        })
        inputRef.current.focus()
    }
    const { colorMode } = useColorMode()
    return (
        <Tabs
            variant={ colorMode === 'light' ? 'black' : 'white' }
            w='100%'
            isFitted

            { ...props }
        >
            <TabList as={ HStack } spacing={ 2 }>
                <Center
                    onClick={ isDisabled ? handleDisable : null }
                    pointerEvents={ isDisabled ? 'initial' : 'none' }
                    cursor={ isDisabled ? 'not-allowed' : 'none' }
                    flex='1'
                >
                    <Tab
                        onMouseDown={ onMouseDown[ 0 ] }
                        pointerEvents={ isDisabled ? 'none' : 'initial' }
                    >
                        { tab[ 0 ] }
                    </Tab>
                </Center>
                <Center flex='1'>
                    <Tab onMouseDown={ onMouseDown[ 1 ] }>{ tab[ 1 ] }</Tab>
                </Center>
            </TabList>
            <TabPanels>
                <TabPanel p='1rem 0'>
                    { panel[ 0 ] }
                </TabPanel>
                <TabPanel p='1rem 0'>
                    { panel[ 1 ] }
                </TabPanel>
            </TabPanels>
        </Tabs >
    )
}

export default CustomTabs