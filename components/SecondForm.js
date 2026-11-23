import {
    HStack,
    Box,
    Text,
    Field,
    useDisclosure,
} from "@chakra-ui/react"
import { useRef, useState, useEffect } from "react"
import Step from "./cells/Step"
import CustomTabs from "./cells/Tabs"
import TimeTable from "./cells/TimeTable"
import CustomInput from "./atoms/CustomInput"
import Submit from "./atoms/Submit"
import CustomButton from "./atoms/CustomButton"
import DonateModal from "./cells/DonateModal"

import { Formik } from "formik"
import { secondFormData } from "@/lib/initialValues"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useLang } from "@/context/LangContext"
import { useTimezone } from "@/context/TimezoneContext"
import { TimezoneProvider } from "@/context/TimezoneContext"
import { useTouchDevices } from "@/hooks/useTouchDevices"
import { useEvent } from "@/context/EventContext"

const SecondForm = () => {
    const { open, onOpen, onClose } = useDisclosure()

    return (
        <TimezoneProvider>
            <DonateModal controls={ { isOpen: open, onClose } } />
            <Steps openModal={ onOpen } />
        </TimezoneProvider>
    )
}

const Steps = ({ openModal }) => {
    const inputRef = useRef(null)
    const [ name ] = useLocalStorage('meetor_name')
    return (
        <>
            { name ? <LoggedIn /> : <First inputRef={ inputRef } openModal={ openModal } /> }
            <Second inputRef={ inputRef } />
        </>
    )
}

const First = ({ inputRef, openModal }) => {
    const [ _, setName ] = useLocalStorage('meetor_name')
    const { context } = useLang()
    const handleSubmit = (value) => {
        openModal()
        setName(value.name.trim())
    }

    return (
        <Step
            step={ 1 }
            title={ context.event.input.name }
            mt='3'
            gap='1.5'
        >
            <Formik
                initialValues={ secondFormData.initialValues }
                validationSchema={ secondFormData.validationSchema }
                onSubmit={ handleSubmit }
            >
                { ({ errors, touched, handleChange, handleSubmit }) => (
                    <Field.Root invalid={ Boolean(errors.name && touched.name) }>
                        <HStack as='form' w='100%' onSubmit={ handleSubmit }>
                            <CustomInput
                                id='name'
                                aria-label={ context.event.input.name }
                                placeholder={ context.event.input.placeholder }
                                onChange={ handleChange }
                                ref={ inputRef }
                                size='md'
                                h='9'
                            />
                            <Submit size='md' h='9' flexShrink={ 0 } />
                        </HStack>
                        <Field.ErrorText>
                            { errors.name }
                        </Field.ErrorText>
                    </Field.Root>
                ) }
            </Formik>
        </Step>
    )
}

const Second = ({ inputRef }) => {
    const [ name ] = useLocalStorage('meetor_name')
    const [ tabIndex, setTabIndex ] = useState(() => name ? 0 : 1)
    const { context } = useLang()
    const timezoneConfigs = useTimezone()
    const event = useEvent()

    const { isTouch } = useTouchDevices()
    useEffect(() => {
        if (name) setTabIndex(0)
    }, [ name ])
    const handleTabsChange = (index) => {
        setTabIndex(index)
    }
    return (
        <Step
            step={ 2 }
            title={ context.event.input.checkTime }
            isDisable={ name ? true : false }
            gap='1.5'
        >
            <CustomTabs
                tab={ [ context.global.panel.yourTime, context.global.panel.groupTime ] }
                sharedPanel={ <TimeTable user={ name } readOnly={ tabIndex === 1 } onShowGroup={ () => setTabIndex(1) } /> }
                tips={ [ context.global.tips.dragSelect, isTouch ? context.global.tips.tapToShow : context.global.tips.hoverToShow ] }
                inputRef={ inputRef }
                isDisabled={ name ? false : true }
                index={ tabIndex }
                onChange={ handleTabsChange }
                timezoneConfigs={ timezoneConfigs }
                event={ event }
            />
        </Step>
    )
}

const LoggedIn = () => {
    const [ name, setName ] = useLocalStorage('meetor_name')
    const { context } = useLang()
    const handleLogout = () => setName()
    return (
        <HStack w='100%' justify='space-between' gap='2'>
            <Box flex='1' minW='0' fontSize='sm' overflowWrap='anywhere'>
                <Text as='span' fontWeight='semibold'>{ context.event.hello + name }</Text>
                { ' ' }
                <Text as='span' color='ink.muted'>{ context.event.go }</Text>
            </Box>
            <CustomButton ghost size='sm' h='8' px='2.5' fontSize='xs' flexShrink={ 0 } onClick={ handleLogout }>
                { context.global.button.logout }
            </CustomButton>
        </HStack>
    )
}

export default SecondForm
