import {
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    Tag,
    Center,
    HStack,
    useColorMode
} from '@chakra-ui/react'
import { toast } from 'react-hot-toast'
import { useLang } from '@/context/LangContext'

const CustomTabs = ({ onMouseDown = [ null, null ], tab, panel, isDisabled = false, inputRef = null, tips = [], ...props }) => {
    const { context } = useLang()
    const handleDisable = () => {
        toast(context.global.toast.nameFirst, {
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
            <TabList as={ HStack } spacing={ { base: 1, md: 2 } }>
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
            <TabPanels >
                <TabPanel p='1rem 0'>
                    { tips[ 0 ] && <TagTemplate>{ `💡 ${tips[ 0 ]}` }</TagTemplate> }
                    { panel[ 0 ] }
                </TabPanel>
                <TabPanel p='1rem 0'>
                    { tips[ 1 ] && <TagTemplate>{ `💡 ${tips[ 1 ]}` }</TagTemplate> }
                    { panel[ 1 ] }
                </TabPanel>
            </TabPanels>
        </Tabs >
    )
}

export const TagTemplate = ({ children, ...props }) => {
    return (
        <Tag
            colorScheme='orange'
            mb='12px'
            { ...props }
        >
            { children }
        </Tag>
    )
}

export default CustomTabs