import { Center } from "@chakra-ui/react"
import { Toaster } from "react-hot-toast"
import Navbar from "./Navbar"
import Content from "./Content"
import { useLang } from "@/context/LangContext"

const PageContainer = ({ children }) => {
    const { isLoading } = useLang()
    if (isLoading) return (
        <>
            <Navbar loading />
            <Content>
                <Center>
                    Loading...
                </Center>
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
        </>
    )
}

export default PageContainer