import CustomModal from "../atoms/CustomModal"
import CustomButton from '../atoms/CustomButton'

import { useLang } from "@/context/LangContext"
import useLocalStorage from "@/hooks/useLocalStorage"

import { addDays, isAfter } from 'date-fns'

const UpdateModal = ({ controls }) => {
    const { context } = useLang()
    const [ _, setIsUpdateRead ] = useLocalStorage('meetor_update_timezone_read')

    const handleClose = () => {
        controls.onClose()
        setIsUpdateRead(true)
    }

    const isOutdated = isAfter(new Date(), addDays('2024/11/24', 45))

    return (
        <CustomModal
            isOpen={ isOutdated ? false : controls.isOpen }
            controls={ { ...controls, onClose: handleClose } }
            context={ {
                header: context.global.updates.timezone.title,
                body: context.global.updates.timezone.content
            } }
            button={
                <>
                    <CustomButton colorScheme='blue' mr={ 3 } onClick={ handleClose } ghost>
                        { context.global.updates.close }
                    </CustomButton>
                </>
            }
        />
    )
}

export default UpdateModal