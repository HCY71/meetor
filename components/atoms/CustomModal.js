import {
    Center,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalBody,
} from '@chakra-ui/react'
import CustomButton from './CustomButton'
import { useLang } from '@/context/LangContext'

const CustomModal = ({ controls }) => {
    const { context } = useLang()
    const handleClose = () => {
        controls.onClose()
        window.location.reload()
    }
    const handleDonate = () => {
        console.log('donate')
    }
    return (
        <>
            <Modal blockScrollOnMount={ false } isOpen={ controls.isOpen } onClose={ handleClose }>
                <ModalOverlay />
                <ModalContent
                    p='1rem'
                >
                    <ModalHeader
                        fontSize={ '2.5rem' }
                        fontWeight='bold'
                        textAlign='center'
                    >
                        { context.global.donateAlert.title }</ModalHeader>
                    <ModalBody fontSize='18px' mb='1rem'>
                        { context.global.donateAlert.content }
                    </ModalBody>
                    <ModalFooter>
                        <CustomButton colorScheme='blue' mr={ 3 } onClick={ handleClose } ghost>
                            { context.global.button.close }
                        </CustomButton>
                        <CustomButton onClick={ handleDonate }>
                            { context.global.button.donate }
                        </CustomButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CustomModal