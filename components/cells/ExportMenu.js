import { Menu, Portal, Text } from "@chakra-ui/react";
import CustomButton from "../atoms/CustomButton";
import { useLang } from "@/context/LangContext";

const ExportMenu = ({ onExportCsv, onExportJson }) => {
  const { context } = useLang();
  const options = context.event.exportOptions;

  return (
    <Menu.Root
      positioning={{ placement: "right-start", gutter: 8 }}
      onSelect={({ value }) => {
        if (value === "csv") onExportCsv();
        if (value === "json") onExportJson();
      }}
      lazyMount
      unmountOnExit
    >
      <Menu.Trigger asChild>
        <CustomButton ghost flexShrink={0}>{context.event.export}</CustomButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            aria-label={context.event.export}
            w="240px"
            p="1"
            bg="bg.canvas"
            color="fg"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="md"
            boxShadow="lg"
          >
            {[
              { value: "csv", title: options.csv, description: options.csvDescription },
              { value: "json", title: options.json, description: options.jsonDescription },
            ].map(({ value, title, description }) => (
              <Menu.Item
                key={value}
                value={value}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                gap="1"
                px="3"
                py="2"
                borderRadius="sm"
                cursor="pointer"
                _highlighted={{ bg: "bg.track" }}
              >
                <Text fontSize="sm" fontWeight="semibold">{title}</Text>
                <Text fontSize="xs" fontWeight="normal" color="ink.muted">{description}</Text>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ExportMenu;
