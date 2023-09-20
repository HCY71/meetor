import Link from "next/link"
import CustomButton from "./CustomButton"
import { useLang } from "@/context/LangContext"

import { GAclickEvent } from "@/public/utils/GA"

const DonateButton = ({ isModal }) => {
    const { context } = useLang()
    return (
        <Link href='https://portaly.cc/erkinhsu' target="_blank" rel="noopener noreferrer" onClick={ () => GAclickEvent(isModal ? 'popup' : 'footer', 'buy_me_a_coffee') }>
            <CustomButton
                boxShadow='rgba(255, 255, 255, 0.7) 0px 0px 76.9166px, rgba(255, 255, 255, 0.4) 0px 0px 26.3055px, rgba(255, 255, 255, 0.3) 0px 0px 13.1528px, rgb(255, 255, 255) 0px 0px 3.75793px, rgb(255, 255, 255) 0px 0px 1.87897px;'
                border='solid 1px rgba(255,255,255,0.8)'
            >
                { context.global.button.donate + ' ➚' }
            </CustomButton>
        </Link>
    )
}

export default DonateButton