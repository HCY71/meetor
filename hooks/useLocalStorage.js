'use client'
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initValue = null) => {
    const [ value, setValue ] = useState(initValue)

    useEffect(() => {
        const currentValue = localStorage.getItem(key)
        if (currentValue) setValue(currentValue)
    }, [])

    const setLocalStorage = (value) => {
        if (value) {
            localStorage.setItem(key, typeof (value) === 'object' ? JSON.stringify(value) : value)
            setValue(value)
        }
        else {
            localStorage.removeItem(key)
            setValue(null)
            window.location.reload()
        }
    }
    return [ value, setLocalStorage ]
}

export default useLocalStorage