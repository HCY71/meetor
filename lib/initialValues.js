import * as Yup from 'yup'
Yup.addMethod(Yup.array, 'unique', function (message, mapper = a => a) {
    return this.test('unique', message, function (list) {
        return list.length === new Set(list.map(mapper)).size
    })
})
const formData = {
    initialValues: {
        name: "",
        type: "dates",
        days: [],
        dates: [],
        allDay: false,
        range: [ 8, 17 ],
        timezone: 'America/New_York',
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required('Give it a name.'),
        type: Yup.string().required('Required'),
        allDay: Yup.boolean(),
        days: Yup.array().when(
            'type', {
            is: 'days',
            then: (schema) => schema.min(1, 'Choose at least a day.'),
        }),
        dates: Yup.array().when(
            'type', {
            is: 'dates',
            then: (schema) => schema.min(1, 'Choose at least a day.'),
        }),
        range: Yup.array().of(Yup.number()).required('Choose a time range.')
            .test('range', 'The start time and the end time should not be the same.', range => range[ 0 ] != range[ 1 ]),
        timezone: Yup.string(),
    })
}

const secondFormData = {
    initialValues: {
        name: ''
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required('We missed your name.')
    })
}

const configsInitial = {
    // useSystemColorMode: true,
    lang: 'en',
    weekStartsOn: 0,
    usePM: true,
}

export { formData, secondFormData, configsInitial }