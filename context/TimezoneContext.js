import { createContext, useContext, useState } from "react"
// Create TimezoneContext
const TimezoneContext = createContext()
// Custom hook for using TimezoneContext
export const useTimezone = () => useContext(TimezoneContext)
// Timezone Provider Component
export const TimezoneProvider = ({ children }) => {
    // Initialize timezone with browser's default
    const [ timezone, setTimezone ] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

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