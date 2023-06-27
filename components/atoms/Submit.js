import CustomButton from "./CustomButton"

const Submit = ({ ...props }) => {
    return (
        <CustomButton type="submit" { ...props }>
            Submit
        </CustomButton>
    )
}

export default Submit