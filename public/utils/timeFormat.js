import { format, parseISO, formatDistance } from "date-fns"
import { zhTW } from "date-fns/locale"

const displayTime = (value, usePM) => {
    const hour = Math.floor(value)
    const minute = (value % 1) * 60
    const ampm = hour < 12 ? 'AM' : 'PM'
    const hour12 = hour % 12 || 12
    const minuteString = minute === 0 ? '' : `:${minute}`
    const minuteString24H = minute === 0 ? ':00' : `:${minute}`

    const hourString = hour.toString()

    if (!usePM) return (hourString.length === 1 ? "0" + hourString + minuteString24H : hourString + minuteString24H)
    return `${hour12}${minuteString}${ampm}`
}

const displayDay = (date, lang) => {
    return format(parseISO(date), 'eee', { locale: lang === 'zh-tw' ? zhTW : null })
}

const checkWeekStart = (days, startFrom) => {
    if (startFrom === 0) return days
    const daysStartFromMon = [ days[ 1 ], ...days.slice(2, 7), days[ 0 ] ]
    return daysStartFromMon
}

const getMonthAndDate = (date, lang) => {
    return format(parseISO(date), 'MMM d', { locale: lang === 'zh-tw' ? zhTW : null })
}

const getTimeDistance = (event, currentDate, lang) => {
    return formatDistance(parseISO(event.created_at), currentDate.date, { locale: lang === 'zh-tw' ? zhTW : null })
}

const getFullDateAndTime = (date, type, lang) => {
    if (type === 'dates') return format(parseISO(date), 'yyyy-MM-dd')
    else return translateDay(date.slice(0, date.lastIndexOf('-')), lang)
}

const translateDay = (d, lang) => {
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

export { displayTime, getMonthAndDate, getTimeDistance, displayDay, checkWeekStart, getFullDateAndTime, translateDay }