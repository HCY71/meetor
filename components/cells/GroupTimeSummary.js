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
    <Box
      as="ul"
      display="grid"
      gridTemplateColumns="repeat(3, minmax(0, 1fr))"
      gap="1.5"
      listStyleType="none"
      m="0"
      p="0"
    >
      {slots.map(({ cell, day, time, count }) => (
        <Box as="li" key={cell.id}>
          <Flex
            as="button"
            type="button"
            aria-label={`${day}, ${time}, ${labels.availableCount
              .replace("{count}", count)
              .replace("{total}", participantCount)}`}
            aria-current={highlightedSlotId === cell.id ? "location" : undefined}
            direction={{ base: "column", sm: "row" }}
            align={{ base: "flex-start", sm: "center" }}
            justify="space-between"
            gap={{ base: "0.5", sm: "1.5" }}
            w="100%"
            h="100%"
            minH="11"
            py="1.5"
            px="1.5"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="md"
            textAlign="start"
            fontSize="xs"
            lineHeight="short"
            fontWeight="medium"
            fontVariantNumeric="tabular-nums"
            cursor="pointer"
            transitionProperty="background-color, border-color"
            transitionDuration="fast"
            _motionReduce={{ transition: "none" }}
            _hover={{ bg: "bg.track", borderColor: "ink.subtle" }}
            _active={{ bg: "bg.track", borderColor: "ink.muted" }}
            focusVisibleRing="inside"
            onClick={() => onJump(cell)}
          >
            <Flex as="span" direction="column" gap="0.5" minW="0" overflowWrap="anywhere">
              <Text as="span">{day}</Text>
              <Text as="span" color="ink.muted">
                {time}
              </Text>
            </Flex>
            <Text as="span" flexShrink="0" fontWeight="semibold">
              {count}/{participantCount}
            </Text>
          </Flex>
        </Box>
      ))}
    </Box>
  </Box>
);

export default GroupTimeSummary;
