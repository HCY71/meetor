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
import DonateButton from './DonateButton'
import { useLang } from '@/context/LangContext'
import { useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

const CustomModal = ({ controls }) => {
    const { context } = useLang()
    const { colorMode } = useColorMode()
    const handleClose = () => {
        controls.onClose()
        window.location.reload()
    }
    return (
        <>
            <Modal blockScrollOnMount={ false } isOpen={ controls.isOpen } onClose={ handleClose } size={ { base: 'xs', md: 'lg' } }>
                <ModalOverlay />
                <ModalContent
                    p='1rem'
                    bg={ colors[ colorMode ].bg.primary }
                    boxShadow='rgba(255, 255, 255, 0.7) 0px 0px 76.9166px, rgba(255, 255, 255, 0.4) 0px 0px 26.3055px, rgba(255, 255, 255, 0.3) 0px 0px 13.1528px, rgb(255, 255, 255) 0px 0px 3.75793px, rgb(255, 255, 255) 0px 0px 1.87897px;'
                    border='solid 1px rgba(255,255,255,0.8)'
                >
                    <ModalHeader
                        fontSize={ { base: '1.5rem', md: '2.5rem' } }
                        fontWeight='bold'
                        textAlign='center'
                    >
                        { context.global.donateAlert.title }
                    </ModalHeader>
                    <ModalBody fontSize={ { base: '1rem', md: '1.125rem' } }>
                        { context.global.donateAlert.content }
                    </ModalBody>
                    <ModalFooter>
                        <CustomButton colorScheme='blue' mr={ 3 } onClick={ handleClose } ghost>
                            { context.global.button.close }
                        </CustomButton>
                        <DonateButton isModal />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CustomModal