import CustomButton from "./CustomButton"
import { useLang } from "@/context/LangContext"

const Submit = ({ ...props }) => {
    const { context } = useLang()
    return (
        <CustomButton type="submit" { ...props }>
            { context.global.button.submit }
        </CustomButton>
    )
}

export default Submit