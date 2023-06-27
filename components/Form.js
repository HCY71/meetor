import {
    VStack,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    FormErrorMessage,
    FormControl,
    useColorMode
} from "@chakra-ui/react"

import Step from "./cells/Step"
import Submit from "./atoms/Submit"
import Days from "./cells/Days"
import Dates from "./cells/Dates"
import CustomTabs from "./cells/Tabs"
import CustomInput from "./atoms/CustomInput"
import { useFormikContext, Formik } from "formik"

import { displayTime } from "@/public/utils/timeFormat"
import { formData } from "@/lib/initialValues"
import useSupabase from "@/hooks/useSupabase"
import { toast } from "react-hot-toast"
import { uid } from "uid"
import { colors } from "@/public/theme"

const Form = () => {
    const { POST } = useSupabase()

    const handleSubmit = (value) => {
        if (value.type === 'dates') {
            value.dates = value.dates.map(date => date.slice(0, date.indexOf('+')))
        }
        value.id = uid()
        toast.promise(
            POST('events', value),
            {
                loading: 'Loading...',
                success: 'Here we go.',
                error: 'Something went wrong.',
            }
        )
    }
    return (
        <Formik
            initialValues={ formData.initialValues }
            validationSchema={ formData.validationSchema }
            onSubmit={ handleSubmit }
        >
            { ({ handleSubmit }) => (
                <form onSubmit={ handleSubmit }>
                    <Steps />
                </form>
            ) }
        </Formik>
    )
}



const Steps = () => {
    return (
        <VStack w='520px' mt='10' spacing={ 10 }>
            <First />
            <Second />
            <Third />
            <Submit mt={ 10 } />
        </VStack>
    )
}

const First = () => {
    const { errors, touched, handleChange } = useFormikContext()
    return (
        <Step step={ 1 } title='Give your event a name.'>
            <FormControl isInvalid={ errors.name && touched.name }>
                <CustomInput
                    id={ 'name' }
                    placeholder={ 'A very important meeting.' }
                    onChange={ handleChange }
                />
                <FormErrorMessage>
                    { errors.name }
                </FormErrorMessage>
            </FormControl>
        </Step>
    )
}
const Second = () => {
    const { setFieldValue } = useFormikContext()

    return (
        <Step step={ 2 } title='Choose your dates.'>
            <CustomTabs
                onMouseDown={ [ () => setFieldValue('type', 'dates'), () => setFieldValue('type', 'days') ] }
                tab={ [ 'Dates', 'Days' ] }
                panel={ [ <Dates />, <Days /> ] }
            />
        </Step >
    )
}

const Third = () => {
    const { values, errors, touched, setFieldValue } = useFormikContext()
    const { colorMode } = useColorMode()
    return (
        <Step step={ 3 } title='Set a time range.'>
            <FormControl isInvalid={ errors.range && touched.range }>
                <RangeSlider
                    id='range'
                    aria-label={ [ 'min', 'max' ] }
                    defaultValue={ values.range }
                    min={ 0 }
                    max={ 24 }
                    step={ 1 }
                    onChange={ (val) => setFieldValue('range', val) }
                >
                    <RangeSliderTrack bg={ colors[ colorMode ].border.sliderTrack } h='12px' borderRadius='md'>
                        <RangeSliderFilledTrack bg={ colors[ colorMode ].bg.invert } />
                    </RangeSliderTrack>
                    <SliderThumb index={ 0 } value={ values.range[ 0 ] } />
                    <SliderThumb index={ 1 } value={ values.range[ 1 ] } />
                </RangeSlider>
                <FormErrorMessage mt={ 8 }>
                    { errors.range }
                </FormErrorMessage>
            </FormControl>
        </Step>
    )
}

const SliderThumb = ({ index, value }) => {
    const { colorMode } = useColorMode()
    return (
        <RangeSliderThumb
            boxSize={ 8 }
            index={ index }
            border='solid 1px'
            borderColor={ colors[ colorMode ].border.sliderTrack }
            _after={ {
                content: `"${displayTime(value)}"`,
                position: 'absolute',
                bottom: '-30px',
                textAlign: 'center',
                width: '100px',
                fontWeight: 'medium',
            } }
        />
    )
}

export default Form