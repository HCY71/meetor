import {
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalBody,
} from '@chakra-ui/react'

const CustomModal = ({ controls, context, button, ...props }) => {
    return (
        <>
            <Modal blockScrollOnMount={ false } isOpen={ controls.isOpen } onClose={ controls.onClose } size={ { base: 'xs', md: 'lg' } } { ...props }>
                <ModalOverlay />
                <ModalContent
                    p={ { base: '.5rem', md: '1rem' } }
                    bg='bg.canvas'
                    boxShadow='glow'
                    borderWidth='1px'
                    borderStyle='solid'
                    borderColor='border.glow'
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
