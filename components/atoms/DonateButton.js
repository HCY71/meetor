import Link from "next/link";
import CustomButton from "./CustomButton";
import { useLang } from "@/context/LangContext";

import { GAclickEvent } from "@/public/utils/GA";

const DonateButton = ({ isModal }) => {
  const { context } = useLang();
  return (
    <Link
      href="https://ko-fi.com/erkinhsu"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        GAclickEvent(isModal ? "popup" : "footer", "buy_me_a_coffee")
      }
    >
      <CustomButton
        // the footer pairs it with a line of small print; the modal gives it room
        size={isModal ? "md" : "compact"}
        boxShadow="glow"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.glow"
      >
        {context.global.button.donate + " ➚"}
      </CustomButton>
    </Link>
  );
};

export default DonateButton;
