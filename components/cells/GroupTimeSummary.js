import { Box, Flex, Text } from "@chakra-ui/react";

const GroupTimeSummary = ({
  id,
  headingRef,
  slots,
  participantCount,
  highlightedSlotId,
  labels,
  onJump,
}) => (
  <Box as="section" id={id} aria-labelledby={`${id}-heading`} w="100%">
    <Text
      as="h3"
      ref={headingRef}
      id={`${id}-heading`}
      tabIndex={-1}
      fontSize="sm"
      fontWeight="semibold"
      mb="1"
      focusVisibleRing="outside"
    >
      {labels.bestSlots}
    </Text>
    <Box as="ul" listStyleType="none" m="0" p="0">
      {slots.map(({ cell, day, time, count }) => (
        <Box as="li" key={cell.id} borderBottomWidth="1px" borderColor="border.subtle">
          <Flex
            as="button"
            type="button"
            aria-label={`${day}, ${time}, ${labels.availableCount
              .replace("{count}", count)
              .replace("{total}", participantCount)}`}
            aria-current={highlightedSlotId === cell.id ? "location" : undefined}
            align="center"
            justify="space-between"
            gap="3"
            w="100%"
            minH="9"
            py="1.5"
            px="3"
            borderRadius="sm"
            textAlign="start"
            fontSize="sm"
            fontWeight="medium"
            fontVariantNumeric="tabular-nums"
            cursor="pointer"
            _hover={{ bg: "bg.track" }}
            focusVisibleRing="inside"
            onClick={() => onJump(cell)}
          >
            <Flex as="span" flexWrap="wrap" columnGap="2">
              <Text as="span">{day}</Text>
              <Text as="span" color="ink.muted" whiteSpace="nowrap">
                {time}
              </Text>
            </Flex>
            <Text as="span" fontWeight="semibold">
              {count}/{participantCount}
            </Text>
          </Flex>
        </Box>
      ))}
    </Box>
  </Box>
);

export default GroupTimeSummary;
