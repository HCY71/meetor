import { createContext, useContext } from "react"
import { configsInitial } from '@/lib/initialValues'
import useLocalStorage from "@/hooks/useLocalStorage"

export const ConfigsContext = createContext(configsInitial)

export const ConfigsProvider = ({ children }) => {
    const [ configs, setConfigs ] = useLocalStorage('meetor_configs', configsInitial)

    return (
        <ConfigsContext.Provider value={ { configs, setConfigs } }>
            { children }
        </ConfigsContext.Provider>
    )
}

export const useConfigs = () => useContext(ConfigsContext)