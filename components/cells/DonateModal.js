import CustomModal from "../atoms/CustomModal"
import CustomButton from '../atoms/CustomButton'
import DonateButton from '../atoms/DonateButton'

import { useLang } from "@/context/LangContext"

const DonateModal = ({ controls }) => {
    const { context } = useLang()
    const handleClose = () => {
        controls.onClose()
        window.location.reload()
    }
    return (
        <CustomModal
            controls={ { ...controls, onClose: handleClose } }
            context={ {
                header: context.global.donateAlert.title,
                body: context.global.donateAlert.content
            } }
            button={
                <>
                    <CustomButton colorScheme='blue' mr={ 3 } onClick={ handleClose } ghost>
                        { context.global.button.close }
                    </CustomButton>
                    <DonateButton isModal />
                </>
            }
        />
    )
}

export default DonateModal