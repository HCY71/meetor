import { useEffect } from "react"
import {
    VStack,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    FormErrorMessage,
    FormControl,
    Center,
    useColorMode
} from "@chakra-ui/react"

import Step from "./cells/Step"
import Submit from "./atoms/Submit"
import Days from "./cells/Days"
import Dates from "./cells/Dates"
import CustomTabs from "./cells/Tabs"
import CustomInput from "./atoms/CustomInput"
import { useFormikContext, Formik } from "formik"

import { compareAsc, parseISO, formatISO } from "date-fns"

import { displayTime } from "@/public/utils/timeFormat"
import { formData } from "@/lib/initialValues"
import useSupabase from "@/hooks/useSupabase"
import { toast } from "react-hot-toast"
import { uid } from "uid"
import { colors } from "@/public/theme"
import { useLang } from "@/context/LangContext"
import { useConfigs } from "@/context/ConfigsContext"

const Form = () => {
    const { POST } = useSupabase()
    const { context } = useLang()

    const cleanupValues = (value) => {
        if (value.type === 'dates') {
            // sort
            const datesAfterSort = value.dates.map(d => parseISO(d)).sort(compareAsc).map(d => formatISO(d))

            // remove timezone
            const datesWithoutTimezone = datesAfterSort.map(date => (date.indexOf('+') !== -1) ? date.slice(0, date.indexOf('+')) : date)
            value.id = uid()
            return { ...value, dates: datesWithoutTimezone }
        } else {
            const sorter = {
                "MON": 1,
                "TUE": 2,
                "WED": 3,
                "THU": 4,
                "FRI": 5,
                "SAT": 6,
                "SUN": 0,
                "一": 1,
                "二": 2,
                "三": 3,
                "四": 4,
                "五": 5,
                "六": 6,
                "日": 0
            }
            value.days.sort(function sortByDay(a, b) {
                let day1 = a.toLowerCase()
                let day2 = b.toLowerCase()
                return sorter[ day1 ] - sorter[ day2 ]
            })
            value.id = uid()
            return value
        }
    }
    const handleSubmit = (value) => {
        toast.promise(
            POST('events', cleanupValues(value)),
            {
                loading: context.global.toast.loading,
                success: context.global.toast.success,
                error: context.global.toast.error,
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
                <form onSubmit={ handleSubmit } style={ { 'maxWidth': '100%' } }>
                    <ToastError />
                    <Steps />
                </form>
            ) }
        </Formik>
    )
}

const ToastError = () => {
    const { errors, touched } = useFormikContext()
    const { context } = useLang()
    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }

    useEffect(() => {
        if (!isEmpty(errors) && !isEmpty(touched)) {
            toast(context.global.toast.emptyForm, {
                icon: '😵‍💫'
            })
        }
    }, [ errors, touched ])
    return (
        <>
        </>
    )
}
const Steps = () => {
    return (
        <VStack w='520px' mt={ { base: '5', md: '10' } } spacing={ { base: 5, md: 10 } } maxW='100%'>
            <First />
            <Second />
            <Third />
            <Submit mt={ 10 } />
        </VStack>
    )
}

const First = () => {
    const { errors, touched, handleChange } = useFormikContext()
    const { context } = useLang()
    return (
        <Step step={ 1 } title={ context.home.input.name }>
            <FormControl isInvalid={ errors.name && touched.name }>
                <CustomInput
                    id={ 'name' }
                    placeholder={ context.home.input.placeholder }
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
    const { context } = useLang()
    return (
        <Step step={ 2 } title={ context.home.input.chooseDates } >
            <CustomTabs
                onMouseDown={ [ () => setFieldValue('type', 'dates'), () => setFieldValue('type', 'days') ] }
                tab={ [ context.global.panel.dates, context.global.panel.days ] }
                panel={ [ <Dates />, <Days /> ] }
                tips={ [ context.global.tips.dragSelect, context.global.tips.dragSelect ] }
            />
        </Step >
    )
}

const Third = () => {
    const { values, errors, touched, setFieldValue } = useFormikContext()
    const { colorMode } = useColorMode()
    const { context } = useLang()
    return (
        <Step step={ 3 } title={ context.home.input.chooseRange }>
            <FormControl isInvalid={ errors.range && touched.range }>
                <Center>
                    <RangeSlider
                        id='range'
                        aria-label={ [ 'min', 'max' ] }
                        defaultValue={ values.range }
                        min={ 0 }
                        max={ 24 }
                        step={ 1 }
                        onChange={ (val) => setFieldValue('range', val) }
                        w={ { base: '81%' } }
                    >
                        <RangeSliderTrack bg={ colors[ colorMode ].border.sliderTrack } h='12px' borderRadius='md'>
                            <RangeSliderFilledTrack bg={ colors[ colorMode ].bg.invert } />
                        </RangeSliderTrack>
                        <SliderThumb index={ 0 } value={ values.range[ 0 ] } />
                        <SliderThumb index={ 1 } value={ values.range[ 1 ] } />
                    </RangeSlider>
                </Center>
                <FormErrorMessage mt={ 8 }>
                    { errors.range }
                </FormErrorMessage>
            </FormControl>
        </Step >
    )
}

const SliderThumb = ({ index, value }) => {
    const { colorMode } = useColorMode()
    const { configs } = useConfigs()
    return (
        <RangeSliderThumb
            boxSize={ 8 }
            index={ index }
            border='solid 1px'
            borderColor={ colors[ colorMode ].border.sliderTrack }
            zIndex={ 0 }
            _after={ {
                content: `"${displayTime(value, configs.usePM)}"`,
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