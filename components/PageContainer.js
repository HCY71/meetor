import { Toaster } from "react-hot-toast"
import Navbar from "./Navbar"
import Content from "./Content"
import { useLang } from "@/context/LangContext"

const PageContainer = ({ children }) => {
    const { isLoading, error } = useLang()
    if (isLoading) return (
        <>
            Loading...
        </>
    )
    if (error) return (
        <>
            { console.log(error) }
            WHAT?
        </>
    )
    return (
        <>
            <Toaster />
            <Navbar />
            <Content>
                { children }
            </Content>
        </>
    )
}

export default PageContainer