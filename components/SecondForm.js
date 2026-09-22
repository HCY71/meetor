import {
    HStack,
    VStack,
    Center,
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
import SubHeader from "./atoms/SubHeader"
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
                                placeholder={ context.event.input.placeholder }
                                onChange={ handleChange }
                                ref={ inputRef }
                            />
                            <Submit />
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
        >
            <CustomTabs
                tab={ [ context.global.panel.yourTime, context.global.panel.groupTime ] }
                panel={ [
                    <TimeTable key='personal-time' />,
                    <TimeTable key='group-time' readOnly isRealtimeEnabled={ tabIndex === 1 } />
                ] }
                tips={ [ context.global.tips.dragSelect, isTouch ? context.global.tips.tapToShow : context.global.tips.hoverToShow, context.global.tips.forMore ] }
                inputRef={ inputRef }
                isDisabled={ name ? false : true }
                index={ tabIndex }
                onChange={ handleTabsChange }
                timezoneConfigs={ timezoneConfigs }
                event={ event }
            />
            { name }
        </Step>
    )
}

const LoggedIn = () => {
    const [ name, setName ] = useLocalStorage('meetor_name')
    const { context } = useLang()
    const handleLogout = () => setName()
    return (
        <VStack>
            <SubHeader>
                { context.event.hello + (name || " ") }
            </SubHeader>
            <HStack
                fontSize={ { base: '1rem', md: '1.5rem' } }
                fontWeight='500'
                lineHeight='1.5'
                textAlign='center'
                color='ink.primary'
                gap={ 4 }
            >
                <Center>
                    { context.event.go }
                </Center>
                <CustomButton onClick={ handleLogout }>
                    { context.global.button.logout }
                </CustomButton>
            </HStack>
        </VStack>
    )
}

export default SecondForm
