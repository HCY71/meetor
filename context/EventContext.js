import React, { createContext, useContext } from 'react'

// Create the context
const EventContext = createContext()

// Create a provider component
export const EventProvider = ({ event, children }) => {
    return (
        <EventContext.Provider value={ event }>
            { children }
        </EventContext.Provider>
    )
}

// Custom hook for accessing the event context
export const useEvent = () => useContext(EventContext)