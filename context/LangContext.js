import { createContext, useContext } from "react"
import { useConfigs } from "./ConfigsContext"
import useSWR from 'swr'
import { swrFetcher } from "@/public/utils/swrFetcher"

export const LangContext = createContext('en')

export const LangProvider = ({ children }) => {
    const { configs } = useConfigs()
    const { data, isLoading } = useSWR(`/api/static?lang=${configs.lang}`, swrFetcher)

    return (
        <LangContext.Provider value={ { context: data?.content, isLoading } }>
            { children }
        </LangContext.Provider>
    )
}

export const useLang = () => useContext(LangContext)