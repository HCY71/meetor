import { useState, useEffect, useCallback } from 'react'
import { format, getDay, getMonth, addDays, addMonths, startOfMonth } from 'date-fns'

import { zhTW } from 'date-fns/locale'
import { useConfigs } from '@/context/ConfigsContext'

const useDate = () => {
    const [ locale, setLocale ] = useState(null)
    const [ today, setToday ] = useState({})
    const [ currentDate, setCurrentDate ] = useState({})
    const { configs } = useConfigs()

    const generateCalendar = useCallback((today, addOn, startOn) => {
        const startOfWeekday = getDay(startOfMonth(today))
        const result = addDays(today, addOn - startOfWeekday + startOn)
        return result
    }, [])
    const isCurrentMonth = (date) => {
        return getMonth(date) === currentDate.month
    }
    const nextMonth = () => {
        setCurrentDate(month => {
            const current = addMonths(month.date, 1)
            return {
                date: current,
                month: getMonth(current),
                startOfMonth: startOfMonth(current),
                monthAndYear: format(current, 'MMMM yyyy', { locale: locale }),
            }
        })
    }
    const prevMonth = () => {
        setCurrentDate(month => {
            const current = addMonths(month.date, -1)
            return {
                date: current,
                month: getMonth(current),
                startOfMonth: startOfMonth(current),
                monthAndYear: format(current, 'MMMM yyyy', { locale: locale }),
            }
        })
    }
    const goBack = () => {
        const date = new Date()
        setCurrentDate({
            date: date,
            month: getMonth(date),
            startOfMonth: startOfMonth(date),
            monthAndYear: format(date, 'MMMM yyyy', { locale: locale }),
        })
    }
    useEffect(() => {
        const date = new Date()
        setToday({
            day: getDay(date),
        })
        setCurrentDate({
            date: date,
            month: getMonth(date),
            startOfMonth: startOfMonth(date),
            monthAndYear: format(date, 'MMMM yyyy', { locale: locale }),
        })
    }, [ locale ])

    useEffect(() => {
        if (configs.lang === 'zh-tw') setLocale(zhTW)
        else setLocale(null)
    }, [ configs.lang ])

    return {
        today, currentDate, generateCalendar, monthControls: { nextMonth, prevMonth, goBack, isCurrentMonth }
    }
}

export default useDate