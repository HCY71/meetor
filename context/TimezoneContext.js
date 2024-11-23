import { createContext, useContext } from "react"
import useLocalStorage from "@/hooks/useLocalStorage"

const initialValue = Intl.DateTimeFormat().resolvedOptions().timeZone
// Create TimezoneContext
const TimezoneContext = createContext(initialValue)
// Custom hook for using TimezoneContext
export const useTimezone = () => useContext(TimezoneContext)
// Timezone Provider Component
export const TimezoneProvider = ({ children }) => {
    // Initialize timezone with browser's default
    const [ timezone, setTimezone ] = useLocalStorage('meetor_timezone', initialValue)

    // Update timezone and save to local storage
    const updateTimezone = (newTimezone) => {
        setTimezone(newTimezone)
    }

    return (
        <TimezoneContext.Provider value={ { timezone, updateTimezone } }>
            { children }
        </TimezoneContext.Provider>
    )
}