import {
    HStack,
    VStack,
    Center,
    FormControl,
    FormErrorMessage,
    useDisclosure,
    useColorMode
} from "@chakra-ui/react"
import { useRef } from "react"
import Step from "./cells/Step"
import CustomTabs from "./cells/Tabs"
import TimeTable from "./cells/TimeTable"
import CustomInput from "./atoms/CustomInput"
import Submit from "./atoms/Submit"
import CustomButton from "./atoms/CustomButton"
import SubHeader from "./atoms/SubHeader"
import CustomModal from "./atoms/CustomModal"

import { Formik } from "formik"
import { secondFormData } from "@/lib/initialValues"
import useLocalStorage from "@/hooks/useLocalStorage"
import { colors } from "@/public/theme"

const SecondForm = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <CustomModal controls={ { isOpen, onClose } } />
            <Steps openModal={ onOpen } />
        </>
    )
}

const Steps = ({ openModal }) => {
    const inputRef = useRef(null)
    const [ name ] = useLocalStorage('name')
    return (
        <>
            { name ? <LoggedIn /> : <First inputRef={ inputRef } openModal={ openModal } /> }
            <Second inputRef={ inputRef } />
        </>
    )
}

const First = ({ inputRef, openModal }) => {
    const [ name, setName ] = useLocalStorage('name')
    const handleSubmit = (value) => {
        openModal()
        setName(value.name)
    }
    return (
        <Step
            step={ 1 }
            title={ 'Enter your name.' }
        >
            <Formik
                initialValues={ secondFormData.initialValues }
                validationSchema={ secondFormData.validationSchema }
                onSubmit={ handleSubmit }
            >
                { ({ errors, touched, handleChange, handleSubmit }) => (
                    <FormControl isInvalid={ errors.name && touched.name }>
                        <HStack as='form' w='100%' onSubmit={ handleSubmit }>
                            <CustomInput
                                id='name'
                                placeholder='Enter your name'
                                onChange={ handleChange }
                                ref={ inputRef }
                            />
                            <Submit>
                                Submit
                            </Submit>
                        </HStack>
                        <FormErrorMessage>
                            { errors.name }
                        </FormErrorMessage>
                    </FormControl>
                ) }
            </Formik>
        </Step>
    )
}

const Second = ({ inputRef }) => {
    const [ name ] = useLocalStorage('name')

    return (
        <Step
            step={ 2 }
            title={ 'Check your time.' }
            isDisable={ name ? true : false }
        >
            <CustomTabs
                tab={ [ 'Your Time', 'Group Time' ] }
                panel={ [
                    <TimeTable />,
                    <TimeTable readOnly />
                ] }
                inputRef={ inputRef }
                isDisabled={ name ? false : true }
                defaultIndex={ 1 }
            />
        </Step>
    )
}

const LoggedIn = () => {
    const [ name, setName ] = useLocalStorage('name')
    const handleLogout = () => setName()
    const { colorMode } = useColorMode()
    return (
        <VStack>
            <SubHeader>
                Hi👋, { name }
            </SubHeader>
            <HStack
                fontSize='1.5rem'
                fontWeight='500'
                lineHeight='1.5'
                textAlign='center'
                color={ colors[ colorMode ].font.primary }
                spacing={ 4 }
            >
                <Center>
                    Start to check your time.
                </Center>
                <CustomButton onClick={ handleLogout }>
                    Log out
                </CustomButton>
            </HStack>
        </VStack>
    )
}

export default SecondForm