import {
    Dialog,
    Portal,
} from '@chakra-ui/react'

// The spacing, width and backdrop below are v2 Modal's defaults written out,
// since v3's Dialog ships different ones and the donate prompt was designed
// against the old proportions.
const CustomModal = ({ controls, context, button }) => {
    return (
        <Dialog.Root
            open={ controls.isOpen }
            onOpenChange={ (details) => {
                if (!details.open) controls.onClose()
            } }
            preventScroll={ false }
            placement='top'
        >
            <Portal>
                <Dialog.Backdrop bg='rgba(0, 0, 0, 0.48)' />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={ { base: '20rem', md: '32rem' } }
                        mt='4rem'
                        p={ { base: '.5rem', md: '1rem' } }
                        bg='bg.canvas'
                        borderRadius='md'
                        boxShadow='glow'
                        borderWidth='1px'
                        borderStyle='solid'
                        borderColor='border.glow'
                    >
                        <Dialog.Header px='6' py='4' justifyContent='center'>
                            <Dialog.Title
                                fontSize={ { base: '1.5rem', md: '2.5rem' } }
                                fontWeight='bold'
                                lineHeight='1.5'
                                textAlign='center'
                            >
                                { context.header }
                            </Dialog.Title>
                        </Dialog.Header>
                        { /* v3 sets the body and footer at a fixed 20px line height; v2
                             let them scale with the text at 1.5 */ }
                        <Dialog.Body px='6' py='2' fontSize={ { base: '1rem', md: '1.125rem' } } lineHeight='1.5'>
                            { context.body }
                        </Dialog.Body>
                        { /* no gap: the close button already carries its own margin */ }
                        <Dialog.Footer px='6' py='4' gap='0' textStyle='md'>
                            { button }
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default CustomModal
