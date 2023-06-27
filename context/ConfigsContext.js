import { createContext, useContext } from "react"
import { configsInitial } from '@/lib/initialValues'

export const ConfigsContext = createContext(configsInitial)

export const ConfigsProvider = ({ children }) => {
    const configs = useContext(ConfigsContext)
    return (
        <ConfigsContext.Provider value={ configs }>
            { children }
        </ConfigsContext.Provider>
    )
}

export const useConfigs = () => useContext(ConfigsContext)