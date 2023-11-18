import { Center } from "@chakra-ui/react"
import { Toaster } from "react-hot-toast"
import Navbar from "./Navbar"
import Content from "./Content"
import Footer from "./Footer"
import PageSkeleton from "./cells/PageSkeleton"
import { useLang } from "@/context/LangContext"

const PageContainer = ({ children }) => {
    const { isLoading } = useLang()
    if (isLoading) return (
        <>
            <Navbar loading />
            <Content>
                <PageSkeleton />
            </Content>
        </>
    )
    return (
        <>
            <Toaster />
            <Navbar />
            <Content>
                { children }
            </Content>
            <Footer />
        </>
    )
}

export default PageContainer