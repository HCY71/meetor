import {
    format,
    formatISO,
    formatDistance,
    compareDesc,
    compareAsc,
    addDays,
    subDays,
    setDay,
    getDay,
    addMinutes,
    getMinutes,
    getHours
} from "date-fns"
import { tzOffset, tz } from "@date-fns/tz"
import { zhTW } from "date-fns/locale"

const displayTime = (value, usePM) => {

    // if value is a string, convert it to a number 500 -> 5, 530 -> 5.5
    if (typeof value === 'string') {
        value = parseInt(value)

        const timeHour = Math.floor(value / 100)
        const timeMinutes = value % 100
        value = timeMinutes === 30 ? timeHour + 0.5 : timeHour
    }

    const hour = Math.floor(value)
    const minute = (value % 1) * 60

    const ampm = hour < 12 ? 'AM' : (hour === 24 ? 'AM' : 'PM')
    const hour12 = hour % 12 || 12
    const minuteString = minute === 0 ? '' : `:${minute}`
    const minuteString24H = minute === 0 ? ':00' : `:${minute}`

    const hourString = hour.toString()

    if (!usePM) return (hourString.length === 1 ? "0" + hourString + minuteString24H : hourString + minuteString24H)
    return `${hour12}${minuteString}${ampm}`
}

const displayDay = (date, lang) => {
    return format(formatISO(date), 'eee', { locale: lang === 'zh-tw' ? zhTW : null })
}

const checkWeekStart = (days, startFrom) => {
    if (startFrom === 0) return days
    const daysStartFromMon = [ days[ 1 ], ...days.slice(2, 7), days[ 0 ] ]
    return daysStartFromMon
}

const getMonthAndDate = (date, lang) => {
    return format(formatISO(date), 'MMM d', { locale: lang === 'zh-tw' ? zhTW : null })
}

const getTimeDistance = (event, currentDate, lang) => {
    return formatDistance(formatISO(event.created_at), currentDate.date, { locale: lang === 'zh-tw' ? zhTW : null })
}

const getFullDateAndTime = (date, type, lang) => {
    // TODO: tidy this
    if (type === 'dates') return format(date, 'yyyy-MM-dd')
    else if (lang === 'zh-tw') return '週' + translateDay(date.toString().split('-')[ 0 ], lang)
    else return translateDay(date.toString().split('-')[ 0 ], lang)
}

const translateDay = (d, lang) => {

    // fallback to old data
    if (typeof parseInt(d) === NaN) {
        const days = {
            'MON': '一',
            'TUE': '二',
            'WED': '三',
            'THU': '四',
            'FRI': '五',
            'SAT': '六',
            'SUN': '日'
        }
        if (lang === 'en') return Object.keys(days).find(key => days[ key ] === d) || d
        return days[ d ] || d
    }

    const daysEn = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
    const daysZh = [ '日', '一', '二', '三', '四', '五', '六' ]
    return lang === 'zh-tw' ? daysZh[ d ] : daysEn[ d ]
}

const reorderSunDay = (days, startsOn) => {
    // fallback to old data
    if (typeof parseInt(days[ 0 ]) === NaN) {
        if (days[ 0 ] === 'SUN' || days[ 0 ] === '日') {
            if (startsOn === 0) return days
            else if (startsOn === 1 && days[ 1 ]) return [ ...days.slice(1, days.length), days[ 0 ] ]
        }
        else return days
    }

    if (days[ 0 ] == 0) {
        if (startsOn === 0) return days
        else if (startsOn === 1 && days[ 1 ]) return [ ...days.slice(1, days.length), days[ 0 ] ]
    }
    else return days
}

const isDateInRange = (startDate, endDate, date) => {
    const startAndEnd = [ formatISO(startDate), formatISO(endDate) ].sort(compareAsc)
    const result = compareDesc(startAndEnd[ 0 ], formatISO(date)) === 1 && compareDesc(formatISO(date), startAndEnd[ 1 ]) === 1
    return result
}
const getUTCOffsetDifference = (tzEvent, tzLocal) => {
    const date = new Date().toISOString()
    // not sure why, but the package handle date only in the format below
    // that's why I'm using another variable to store the date
    const currentDate = new Date(date)

    const offset1 = tzOffset(tzEvent, currentDate)
    const offset2 = tzOffset(tzLocal, currentDate)

    return (offset2 - offset1) / 60
}
const getLocalRange = (range, delta) => {
    let dayChangeIndex = 0
    const localRange = range.map(r => (r + delta)).map(r => {
        if (r < 0) dayChangeIndex = -1
        else if (r > 24) dayChangeIndex = 1
        return r < 0 ? r + 24 : (r === 24 ? r : r % 24)
    })

    const copyOfLocalRange = [ ...localRange ]
    localRange.sort((a, b) => a - b)
    const isRangeRearranged = copyOfLocalRange[ 0 ] !== localRange[ 0 ]

    return { localRange, dayChangeIndex, isRangeRearranged }
}

const getTimesFromRange = (range, isAllDay) => {
    if (isAllDay) return [ 'allday' ]
    return Array.from(
        { length: (range[ 1 ] - range[ 0 ]) / .5 + 1 },
        (_, index) => range[ 0 ] + index * .5
    )
}
const adjustDatesToLocal = (eventDates, dayChangeIndex, isRangeRearranged) => {
    const adjustFn = dayChangeIndex === -1 ? subDays : addDays

    const allDates = isRangeRearranged ?
        [
            ...eventDates.map(d => new Date(d).toISOString()),
            ...eventDates.map(d => adjustFn(new Date(d), 1).toISOString())
        ] :
        [ ...eventDates.map(d => adjustFn(new Date(d), 1).toISOString()) ]

    const uniqueDates = [ ...new Set(allDates.sort((a, b) => new Date(a) - new Date(b))) ]

    return uniqueDates
}
const adjustDaysToLocal = (eventDays, dayChangeIndex, isRangeRearranged) => {
    const adjustFn = dayChangeIndex === -1 ? subDays : addDays

    const allDays = isRangeRearranged ?
        [
            ...eventDays.map(d => parseInt(d)),
            ...eventDays.map(d => getDay(adjustFn(setDay(new Date('1999-11-24'), parseInt(d)), 1)))
        ] :
        [ ...eventDays.map(d => getDay(adjustFn(setDay(new Date('1999-11-24'), parseInt(d)), 1))) ]

    const uniqueDays = [ ...new Set(allDays.sort((a, b) => a - b)) ]
    return uniqueDays
}

const combineDateAndTime = (date, time, timezone, isAllDay) => {
    // if it's all day, ignore time
    if (isAllDay) return new Date(date).toISOString()
    const delta = getUTCOffsetDifference('UTC', timezone)
    return addMinutes(date, time * 60 - delta * 60).toISOString()
}
const combineDaysAndTime = (day, time, timezone, isAllDay) => {
    // if it's all day, ignore time
    if (isAllDay) return day

    // FIXME:
    // fallback to old data
    if (isNaN(parseInt(day))) {
        day = convertDaysToIndex(day)
    }

    const delta = getUTCOffsetDifference('UTC', timezone)
    const fullDate = addMinutes(setDay(new Date('1999-11-24'), parseInt(day)), time * 60 - delta * 60).toISOString()

    return getDay(fullDate, { in: tz('UTC') }) + '-' + (getHours(fullDate, { in: tz('UTC') }) + getMinutes(fullDate, { in: tz('UTC') }) / 60)
}
const UTCTimeToLocalTime = (UTCTime, timezone) => {
    const delta = getUTCOffsetDifference('UTC', timezone)
    const fullDate = addMinutes(setDay(new Date('1999-11-24'), 0), UTCTime * 60 + delta * 60).toISOString()

    return getHours(fullDate, { in: tz('UTC') }) + getMinutes(fullDate, { in: tz('UTC') }) / 60
}
const isDateSelectable = (truthTable, date) => {
    return truthTable.includes(date)
}

// Functions for fallback to old data
const convertDaysToIndex = (day) => {
    const daysContext = [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', '日', '一', '二', '三', '四', '五', '六' ]
    return daysContext.indexOf(day) % 7
}

export {
    displayTime,
    getMonthAndDate,
    getUTCOffsetDifference,
    getLocalRange,
    getTimesFromRange,
    getTimeDistance,
    adjustDatesToLocal,
    adjustDaysToLocal,
    combineDateAndTime,
    combineDaysAndTime,
    UTCTimeToLocalTime,
    displayDay,
    checkWeekStart,
    getFullDateAndTime,
    translateDay,
    isDateInRange,
    isDateSelectable,
    reorderSunDay,
    convertDaysToIndex
}