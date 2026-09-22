import { forwardRef } from "react";
import { Button } from "@chakra-ui/react";

const CustomButton = forwardRef(({ children, ghost, ...props }, ref) => {
  if (ghost)
    return (
      <Button
        bg={"transparent"}
        color="ink.primary"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="ink.primary"
        _hover={{
          transform: "scale(1.02)",
        }}
        _active={{
          transform: "scale(.97)",
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  return (
    <Button
      bg="ink.primary"
      color="ink.inverted"
      // v3's solid variant carries a transparent 1px border so it lines
      // up with outlined buttons; v2's did not, and the extra 2px widens
      // every filled button
      borderWidth="0"
      _hover={{
        bg: "ink.hover",
        transform: "scale(1.02)",
      }}
      _active={{
        transform: "scale(.98)",
      }}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  );
});

CustomButton.displayName = "CustomButton";

export default CustomButton;
