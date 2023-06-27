import { format, parseISO, formatDistance } from "date-fns"

const displayTime = (value) => {
    const hour = Math.floor(value)
    const minute = (value % 1) * 60
    const ampm = hour < 12 ? 'AM' : 'PM'
    const hour12 = hour % 12 || 12
    const minuteString = minute === 0 ? '' : `:${minute}`
    return `${hour12}${minuteString}${ampm}`
}

const displayDay = (date) => {
    return format(parseISO(date), 'eee')
}

const getMonthAndDate = (date) => {
    return format(parseISO(date), 'MMM d')
}

const getTimeDistance = (event, currentDate) => {
    return formatDistance(parseISO(event.created_at), currentDate.date)
}

export { displayTime, getMonthAndDate, getTimeDistance, displayDay }