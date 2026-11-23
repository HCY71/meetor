import { Icon } from "@chakra-ui/react"
import { FiShare, FiLink } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

import { useLang } from "@/context/LangContext"
import CustomButton from "./CustomButton"

const copyCurrentLink = async (messages) => {
    try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success(messages.linkCopied)
    } catch {
        toast.error(messages.error)
    }
}

const CopyLink = () => {
    const { context } = useLang()
    return (
        <ShareAction icon={ FiLink } label={ context.event.copyLink } onClick={ () => copyCurrentLink(context.global.toast) } />
    )
}

const Share = ({ eventName }) => {
    const { context } = useLang()
    const shareLink = async () => {
        if (!navigator.share) {
            await copyCurrentLink(context.global.toast)
            return
        }
        try {
            await navigator.share({ title: eventName, url: window.location.href })
        } catch (error) {
            if (error.name !== "AbortError") toast.error(context.global.toast.error)
        }
    }
    return (
        <ShareAction icon={ FiShare } label={ context.event.share } onClick={ shareLink } />
    )
}

const ShareAction = ({ icon, label, onClick }) => (
    <CustomButton
        ghost
        type='button'
        size='sm'
        boxSize='10'
        minW='10'
        p='0'
        borderRadius='full'
        aria-label={ label }
        title={ label }
        _hover={ { bg: 'ink.primary', color: 'ink.inverted' } }
        _active={ { _motionSafe: { transform: 'scale(.95)' } } }
        onClick={ onClick }
    >
        <Icon as={ icon } boxSize='5' aria-hidden />
    </CustomButton>
)

export { CopyLink, Share }
