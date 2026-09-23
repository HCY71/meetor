import { useRef } from "react"
import CustomModal from "../atoms/CustomModal"
import CustomButton from '../atoms/CustomButton'
import DonateButton from '../atoms/DonateButton'

import { useLang } from "@/context/LangContext"

const DonateModal = ({ controls }) => {
    const { context } = useLang()
    // Open on the donate button rather than Later, the dialog's whole point
    const donateButtonRef = useRef(null)
    const handleClose = () => {
        controls.onClose()
        window.location.reload()
    }
    return (
        <CustomModal
            controls={ { ...controls, onClose: handleClose } }
            initialFocusRef={ donateButtonRef }
            context={ {
                header: context.global.donateAlert.title,
                body: context.global.donateAlert.content
            } }
            button={
                <>
                    <CustomButton mr={ 3 } onClick={ handleClose } ghost>
                        { context.global.button.close }
                    </CustomButton>
                    <DonateButton isModal ref={ donateButtonRef } />
                </>
            }
        />
    )
}

export default DonateModal