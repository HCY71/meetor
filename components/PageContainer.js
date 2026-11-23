import { Flex } from "@chakra-ui/react"
import { Toaster } from "react-hot-toast"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Content from "./Content"
import Footer from "./Footer"
import PageSkeleton from "./cells/PageSkeleton"
import { useLang } from "@/context/LangContext"

const PageContainer = ({ children }) => {
    const { isLoading } = useLang()
    const pathname = usePathname()
    return (
        <Flex direction='column' minH='100vh' css={ { '@supports (min-height: 100svh)': { minHeight: '100svh' } } }>
            { !isLoading && <Toaster /> }
            <Navbar loading={ isLoading } />
            <Content>
                { isLoading ? <PageSkeleton pathname={ pathname } /> : children }
            </Content>
            <Footer loading={ isLoading } />
        </Flex>
    )
}

export default PageContainer
