import { Switch } from "@chakra-ui/react"

const ChakraSwitch = ({ ...props }) => {
    return (
        <Switch.Root { ...props }>
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    )
}

export default ChakraSwitch
