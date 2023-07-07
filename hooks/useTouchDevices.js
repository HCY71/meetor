import { useState, useEffect } from "react"

export const useTouchDevices = () => {
    const [ isTouch, setIsTouch ] = useState(false)
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0))
    }
    useEffect(() => {
        isTouchDevice() ? setIsTouch(true) : setIsTouch(false)
    }, [])
    return { isTouch }
}
