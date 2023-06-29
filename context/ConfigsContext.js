import { createContext, useContext, useState } from "react"
import { configsInitial } from '@/lib/initialValues'
import useLocalStorage from "@/hooks/useLocalStorage"

export const ConfigsContext = createContext(configsInitial)

export const ConfigsProvider = ({ children }) => {
    const [ configs, setConfigs ] = useLocalStorage('configs', configsInitial)

    return (
        <ConfigsContext.Provider value={ { configs: typeof (configs) === 'object' ? configs : JSON.parse(configs), setConfigs } }>
            { children }
        </ConfigsContext.Provider>
    )
}

export const useConfigs = () => useContext(ConfigsContext)