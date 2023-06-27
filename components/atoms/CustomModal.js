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

const CustomModal = ({ controls }) => {
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
                    >This Could Be an Ad</ModalHeader>
                    <ModalBody fontSize='18px' mb='1rem'>
                        But since we care about your experience, its
                        <b> not</b>.
                        Consider
                        <b> donate </b>
                        to support us.
                    </ModalBody>
                    <ModalFooter>
                        <CustomButton colorScheme='blue' mr={ 3 } onClick={ handleClose } ghost>
                            Close
                        </CustomButton>
                        <CustomButton onClick={ handleDonate }>
                            Donate
                        </CustomButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CustomModal