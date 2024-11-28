'use client'
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initValue = null) => {
    const [ value, setValue ] = useState(() => {
        const value = typeof (window) !== 'undefined' ? localStorage.getItem(key) : null

        if (value === null || value === undefined) return initValue
        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    })

    useEffect(() => {
        let value = localStorage.getItem(key)
        try {
            value = JSON.parse(value)
            if (typeof (value) === "number") value = value.toString()
        } catch {
            value = value
        }
        if (value) setValue(value)
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