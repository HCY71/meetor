import {
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalBody,
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import { colors } from '@/public/theme'

const CustomModal = ({ controls, context, button, ...props }) => {
    const { colorMode } = useColorMode()

    return (
        <>
            <Modal blockScrollOnMount={ false } isOpen={ controls.isOpen } onClose={ controls.onClose } size={ { base: 'xs', md: 'lg' } } { ...props }>
                <ModalOverlay />
                <ModalContent
                    p={ { base: '.5rem', md: '1rem' } }
                    bg={ colors[ colorMode ].bg.primary }
                    boxShadow='rgba(255, 255, 255, 0.7) 0px 0px 76.9166px, rgba(255, 255, 255, 0.4) 0px 0px 26.3055px, rgba(255, 255, 255, 0.3) 0px 0px 13.1528px, rgb(255, 255, 255) 0px 0px 3.75793px, rgb(255, 255, 255) 0px 0px 1.87897px;'
                    border='solid 1px rgba(255,255,255,0.8)'
                >
                    <ModalHeader
                        fontSize={ { base: '1.5rem', md: '2.5rem' } }
                        fontWeight='bold'
                        textAlign='center'
                    >
                        { context.header }
                    </ModalHeader>
                    <ModalBody fontSize={ { base: '1rem', md: '1.125rem' } }>
                        { context.body }
                    </ModalBody>
                    <ModalFooter>
                        { button }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CustomModal