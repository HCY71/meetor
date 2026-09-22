import { Icon } from "@chakra-ui/react"
import { FiShare, FiLink } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

import { useLang } from "@/context/LangContext"

const CopyLink = () => {
    const link = window.location.href
    const { context } = useLang()
    const copyLink = () => {
        navigator.clipboard.writeText(link)
        toast.success(context.global.toast.linkCopied)
    }
    return (
        <Template as={ FiLink } onClick={ copyLink } />
    )
}
const Share = () => {
    const link = window.location.href
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
    return (
        <Icon
            as={ as }
            onClick={ onClick }
            fontSize='2rem'
            borderRadius='50%'
            borderWidth='2px'
            borderStyle='solid'
            borderColor='ink.primary'
            w='52px'
            h='52px'
            p={ 3 }
            cursor='pointer'
            transition='.2s'
            _hover={ {
                bg: 'ink.primary',
                color: 'ink.inverted'
            } }
            _active={ {
                transform: 'scale(.95)'
            } }
        />
    )
}

export { CopyLink, Share }
