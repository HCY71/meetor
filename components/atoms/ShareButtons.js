import { Icon, useColorMode } from "@chakra-ui/react"
import { FiShare, FiLink } from 'react-icons/fi'
import { usePathname } from "next/navigation"
import { baseUrl } from "@/public/baseUrl"
import { toast } from 'react-hot-toast'

import { colors } from "@/public/theme"

const CopyLink = () => {
    const path = usePathname()
    const link = baseUrl + path
    const copyLink = () => {
        navigator.clipboard.writeText(link)
        toast.success('Link Copied!')
    }
    return (
        <Template as={ FiLink } onClick={ copyLink } />
    )
}
const Share = () => {
    const path = usePathname()
    const link = baseUrl + path
    const shareData = {
        title: "MeetMe.app",
        text: "Schedule an event with MeetMe.",
        url: link,
    }
    const shareLink = () => {
        navigator.share(shareData)
    }
    return (
        <Template as={ FiShare } onClick={ shareLink } />
    )
}

const Template = ({ as, onClick }) => {
    const { colorMode } = useColorMode()

    return (
        <Icon
            as={ as }
            onClick={ onClick }
            fontSize='2rem'
            borderRadius='50%'
            border={ colors[ colorMode ].border.button }
            w='52px'
            h='52px'
            p={ 3 }
            cursor='pointer'
            transition='.2s'
            _hover={ {
                bg: colors[ colorMode ].bg.invert,
                color: colors[ colorMode ].bg.primary
            } }
            _active={ {
                transform: 'scale(.95)'
            } }
        />
    )
}

export { CopyLink, Share }
