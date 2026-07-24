import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Center,
  Text,
  Grid,
  GridItem,
  VStack,
  HStack,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  useColorMode,
} from "@chakra-ui/react";
import {
  getMonthAndDate,
  displayTime,
  displayDay,
  getFullDateAndTime,
  adjustDatesToLocal,
  adjustDaysToLocal,
  combineDateAndTime,
  combineDaysAndTime,
  UTCTimeToLocalTime,
  translateDay,
  reorderSunDay,
  getUTCOffsetDifference,
  getLocalRange,
  getTimesFromRange,
  convertDaysToIndex,
} from "@/public/utils/timeFormat";
import CustomTag from "../atoms/CustomTag";
import CustomButton from "../atoms/CustomButton";

import { colors } from "@/public/theme";

import useSupabase from "@/hooks/useSupabase";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useParams } from "next/navigation";
import { useConfigs } from "@/context/ConfigsContext";
import { useLang } from "@/context/LangContext";
import { useEvent } from "@/context/EventContext";
import { useTimezone } from "@/context/TimezoneContext";
import { downloadObjectAsJson } from "@/lib/download";

import { format, addMinutes } from "date-fns";
import { tz } from "@date-fns/tz";

const buildLocalTimes = (event, timezone, weekStartsOn) => {
  const timezoneDifference = getUTCOffsetDifference(event.timezone, timezone);
  const localTimezoneOffset = getUTCOffsetDifference("UTC", timezone);
  const { localRange, dayChangeIndex, isRangeRearranged } = getLocalRange(
    event.range,
    timezoneDifference,
  );

  let dates = event.dates;
  let days = event.days;
  let times = [];
  let dataWithTime = [];

  if (
    event.timezone !== timezone &&
    dayChangeIndex !== 0 &&
    !event.allDay
  ) {
    const adjustedRangeTimes = getTimesFromRange(localRange);

    if (isRangeRearranged) {
      times = getTimesFromRange([0, 24]);
      adjustedRangeTimes.shift();
      adjustedRangeTimes.pop();
      adjustedRangeTimes.pop();
      times = times.filter((time) => !adjustedRangeTimes.includes(time));
    } else {
      times = adjustedRangeTimes;
    }

    if (event.type === "dates") {
      dates = adjustDatesToLocal(
        event.dates,
        dayChangeIndex,
        isRangeRearranged,
      );
      dataWithTime = times.flatMap((time, rowIndex) =>
        dates.map((date, columnIndex) => ({
          rowIndex,
          columnIndex,
          data: combineDateAndTime(
            date,
            time,
            timezone,
            event.allDay,
            localTimezoneOffset,
          ),
        })),
      );
    } else {
      const hasLegacyDays = isNaN(parseInt(event.days[0]));
      const normalizedDays = hasLegacyDays
        ? event.days.map((day) => convertDaysToIndex(day))
        : event.days;

      days = reorderSunDay(
        adjustDaysToLocal(
          normalizedDays,
          dayChangeIndex,
          isRangeRearranged,
        ),
        weekStartsOn,
      );
      dataWithTime = times.flatMap((time, rowIndex) =>
        days.map((day, columnIndex) => ({
          rowIndex,
          columnIndex,
          data: combineDaysAndTime(
            day,
            time,
            timezone,
            event.allDay,
            localTimezoneOffset,
          ),
        })),
      );
    }
  } else {
    times = getTimesFromRange(localRange, event.allDay);

    if (event.type === "dates") {
      dataWithTime = times.flatMap((time, rowIndex) =>
        event.dates.map((date, columnIndex) => ({
          rowIndex,
          columnIndex,
          data: combineDateAndTime(
            date,
            time,
            timezone,
            event.allDay,
            localTimezoneOffset,
          ),
        })),
      );
    } else {
      const hasLegacyDays = isNaN(parseInt(event.days[0]));
      days = hasLegacyDays
        ? event.days
            .map((day) => convertDaysToIndex(day))
            .sort((firstDay, secondDay) => firstDay - secondDay)
        : event.days;
      days = reorderSunDay(days, weekStartsOn);
      dataWithTime = times.flatMap((time, rowIndex) =>
        days.map((day, columnIndex) => ({
          rowIndex,
          columnIndex,
          data: combineDaysAndTime(
            day,
            time,
            timezone,
            event.allDay,
            localTimezoneOffset,
          ),
        })),
      );
    }
  }

  return {
    dates,
    days,
    range: localRange,
    times,
    dataWithTime: event.allDay
      ? dataWithTime
      : dataWithTime.filter((cell) => cell.rowIndex < times.length - 1),
  };
};

const buildSelectableTimeSet = (event, weekStartsOn) => {
  if (event.allDay && event.type === "dates") {
    return new Set(event.dates.map((date) => new Date(date).toISOString()));
  }

  if (event.allDay) {
    return new Set(
      event.days.map((day) => {
        return isNaN(parseInt(day)) ? convertDaysToIndex(day) : day;
      }),
    );
  }

  const eventTimezoneOffset = getUTCOffsetDifference("UTC", event.timezone);
  const eventTimes = getTimesFromRange(event.range);
  const eventDays = reorderSunDay(event.days, weekStartsOn);
  const selectableTimes = eventTimes.flatMap((time) => {
    if (event.type === "dates") {
      return event.dates.map((date) =>
        combineDateAndTime(
          date,
          time,
          event.timezone,
          false,
          eventTimezoneOffset,
        ),
      );
    }

    return eventDays.map((day) =>
      combineDaysAndTime(
        day,
        time,
        event.timezone,
        false,
        eventTimezoneOffset,
      ),
    );
  });

  return new Set(selectableTimes);
};

const parseLegacyDateData = (date, event, timezone) => {
  try {
    if (event.allDay && !date.includes("Z")) {
      const offsetMatch = date.match(/(.*?)([+-]\d{1,2}(\.\d+)?$)/);
      if (offsetMatch) return undefined;

      const timezoneDifference = getUTCOffsetDifference("UTC", timezone);
      return new Date(
        addMinutes(new Date(date), timezoneDifference * 60),
      ).toISOString();
    }

    return new Date(date).toISOString();
  } catch {
    const [dateTime, offset] = date.split(/([+-]\d{1,2}(\.\d+)?$)/);
    return new Date(
      addMinutes(new Date(dateTime), Math.abs(parseFloat(offset)) * 60, {
        in: tz(timezone),
      }),
    ).toISOString();
  }
};

const parseLegacyDayData = (dayAndTime, event) => {
  const hasLegacyDay = isNaN(parseInt(dayAndTime));

  if (hasLegacyDay && event.allDay) {
    return convertDaysToIndex(dayAndTime);
  }

  if (!hasLegacyDay) return dayAndTime;

  const [day, time] = dayAndTime.split("-");
  const timezoneDifference = getUTCOffsetDifference("UTC", event.timezone);

  if (time - timezoneDifference < 0) {
    if (convertDaysToIndex(day) === 0) {
      return `6-${time - timezoneDifference + 24}`;
    }
    return `${convertDaysToIndex(day) - 1}-${time - timezoneDifference + 24}`;
  }

  if (time - timezoneDifference >= 24) {
    if (convertDaysToIndex(day) === 6) {
      return `0-${time - timezoneDifference - 24}`;
    }
    return `${convertDaysToIndex(day) + 1}-${time - timezoneDifference - 24}`;
  }

  return `${convertDaysToIndex(day)}-${time - timezoneDifference}`;
};

const buildSelectionPreview = (dragSelection, cellMatrix) => {
  if (!dragSelection) return null;

  const nextSelection = new Set(dragSelection.baseSelection);
  const minimumRow = Math.min(
    dragSelection.start.rowIndex,
    dragSelection.end.rowIndex,
  );
  const maximumRow = Math.max(
    dragSelection.start.rowIndex,
    dragSelection.end.rowIndex,
  );
  const minimumColumn = Math.min(
    dragSelection.start.columnIndex,
    dragSelection.end.columnIndex,
  );
  const maximumColumn = Math.max(
    dragSelection.start.columnIndex,
    dragSelection.end.columnIndex,
  );

  for (let rowIndex = minimumRow; rowIndex <= maximumRow; rowIndex += 1) {
    for (
      let columnIndex = minimumColumn;
      columnIndex <= maximumColumn;
      columnIndex += 1
    ) {
      const cell = cellMatrix[rowIndex]?.[columnIndex];
      if (!cell) continue;

      if (dragSelection.mode === "add" && cell.isSelectable) {
        nextSelection.add(cell.id);
      } else if (dragSelection.mode === "remove") {
        nextSelection.delete(cell.id);
      }
    }
  }

  return nextSelection;
};

const areSetsEqual = (firstSet, secondSet) => {
  if (firstSet.size !== secondSet.size) return false;

  for (const entry of firstSet) {
    if (!secondSet.has(entry)) return false;
  }

  return true;
};

const getCellElement = (target, gridElement) => {
  if (!(target instanceof Element)) return null;

  const cellElement = target.closest("[data-time-cell]");
  if (!cellElement || !gridElement.contains(cellElement)) return null;
  return cellElement;
};

const getCellElementFromPoint = (pointerEvent, gridElement) => {
  const target = document.elementFromPoint(
    pointerEvent.clientX,
    pointerEvent.clientY,
  );
  return getCellElement(target, gridElement);
};

const getCellCoordinates = (cellElement) => ({
  id: cellElement.dataset.timeCell,
  rowIndex: Number(cellElement.dataset.timeRow),
  columnIndex: Number(cellElement.dataset.timeColumn),
  isSelectable: cellElement.dataset.isSelectable === "true",
});

// position of a cell relative to the grid, used to anchor the group popover
// without turning the cell itself into a popover trigger (which remounts it)
const getCellOffsetWithinGrid = (cellElement, gridElement) => {
  const gridRect = gridElement.getBoundingClientRect();
  const cellRect = cellElement.getBoundingClientRect();
  return {
    left: cellRect.left - gridRect.left,
    top: cellRect.top - gridRect.top,
    width: cellRect.width,
    height: cellRect.height,
  };
};

const generateAvailabilityColor = (percent, isDarkMode) => {
  if (isNaN(percent)) return "transparent";
  if (isDarkMode) {
    return `hsla(47, 81%, ${61 * percent}%, ${percent * 0.8 + 20})`;
  }
  return `hsla(51, 89%, ${100 - 33 * percent}%, ${percent * 0.8 + 20})`;
};

const TimeTable = ({ readOnly = false, isRealtimeEnabled = false }) => {
  const event = useEvent();
  const { eventId } = useParams();
  const { POST_USER_TIME, subscribeToEventUsers } = useSupabase();
  const [user] = useLocalStorage("meetor_name");
  const [users, setUsers] = useState(event.users);
  const { timezone, updateTimezone } = useTimezone();
  const { configs } = useConfigs();
  const { context } = useLang();
  const { colorMode } = useColorMode();

  const [selectedTime, setSelectedTime] = useState(() => new Set());
  const selectedTimeRef = useRef(selectedTime);
  const timezoneRef = useRef(timezone);
  const updateTimezoneRef = useRef(updateTimezone);
  const [dragSelection, setDragSelection] = useState(null);
  const dragSelectionRef = useRef(null);
  const activePointerIdRef = useRef(null);
  const capturedGridRef = useRef(null);
  const dragAnimationFrameRef = useRef(null);
  const [activeGroupCellId, setActiveGroupCellId] = useState(null);
  const [groupAnchorRect, setGroupAnchorRect] = useState(null);
  const [focusedCellId, setFocusedCellId] = useState(null);

  timezoneRef.current = timezone;
  updateTimezoneRef.current = updateTimezone;

  const localTimes = useMemo(
    () => buildLocalTimes(event, timezone, configs.weekStartsOn),
    [event, timezone, configs.weekStartsOn],
  );

  const selectableTimeSet = useMemo(
    () => buildSelectableTimeSet(event, configs.weekStartsOn),
    [event, configs.weekStartsOn],
  );

  const gridCells = useMemo(() => {
    const localTimezoneOffset = getUTCOffsetDifference("UTC", timezone);

    return localTimes.dataWithTime.map((timeCell) => {
      const cellLabel = event.allDay
        ? getFullDateAndTime(timeCell.data, event.type, configs.lang)
        : `${getFullDateAndTime(timeCell.data, event.type, configs.lang)}${
            context.global.timeTable.at
          }${displayTime(
            event.type === "dates"
              ? format(timeCell.data, "HHmm", { in: tz(timezone) })
              : UTCTimeToLocalTime(
                  parseFloat(timeCell.data.split("-")[1]),
                  timezone,
                  localTimezoneOffset,
                ),
            configs.usePM,
          )}`;

      return {
        id: timeCell.data,
        rowIndex: timeCell.rowIndex,
        columnIndex: timeCell.columnIndex,
        isSelectable: selectableTimeSet.has(timeCell.data),
        label: cellLabel,
      };
    });
  }, [
    configs.lang,
    configs.usePM,
    context.global.timeTable.at,
    event.allDay,
    event.type,
    localTimes.dataWithTime,
    selectableTimeSet,
    timezone,
  ]);

  const cellMatrix = useMemo(() => {
    const matrix = [];
    gridCells.forEach((cell) => {
      if (!matrix[cell.rowIndex]) matrix[cell.rowIndex] = [];
      matrix[cell.rowIndex][cell.columnIndex] = cell;
    });
    return matrix;
  }, [gridCells]);

  const cellById = useMemo(() => {
    return new Map(gridCells.map((cell) => [cell.id, cell]));
  }, [gridCells]);

  const groupTime = useMemo(() => {
    const availabilityByTime = {};
    if (!readOnly) return availabilityByTime;

    users?.forEach((eventUser) => {
      eventUser.time?.forEach((time) => {
        const normalizedTime =
          event.type === "dates"
            ? parseLegacyDateData(time, event, timezone)
            : parseLegacyDayData(time, event);

        if (normalizedTime === undefined) return;
        if (availabilityByTime[normalizedTime]) {
          availabilityByTime[normalizedTime].push(eventUser.user);
        } else {
          availabilityByTime[normalizedTime] = [eventUser.user];
        }
      });
    });

    return availabilityByTime;
  }, [event, readOnly, timezone, users]);

  const previewSelection = useMemo(() => {
    return buildSelectionPreview(dragSelection, cellMatrix) ?? selectedTime;
  }, [cellMatrix, dragSelection, selectedTime]);

  const activeGroupCell = activeGroupCellId
    ? cellById.get(activeGroupCellId)
    : null;
  const activeGroupAvailability = activeGroupCell
    ? groupTime[activeGroupCell.id]
    : null;

  useEffect(() => {
    if (readOnly) return;

    const userSelectedTime = event.users?.find(
      (eventUser) => eventUser.user === user,
    )?.time;
    if (!userSelectedTime) return;

    const normalizedSelection = userSelectedTime
      .map((time) => {
        return event.type === "dates"
          ? parseLegacyDateData(time, event, timezoneRef.current)
          : parseLegacyDayData(time, event);
      })
      .filter((time) => time !== undefined);
    const nextSelection = new Set(normalizedSelection);
    selectedTimeRef.current = nextSelection;
    setSelectedTime(nextSelection);
  }, [event, readOnly, user]);

  useEffect(() => {
    if (event.allDay) {
      updateTimezoneRef.current(event.timezone);
      return;
    }

    if (!user || !event.users) return;
    const savedTimezone = event.users.find(
      (eventUser) => eventUser.user === user,
    )?.timezone;
    if (savedTimezone) updateTimezoneRef.current(savedTimezone);
  }, [event.allDay, event.timezone, event.users, user]);

  useEffect(() => {
    if (!readOnly || !isRealtimeEnabled) return undefined;
    return subscribeToEventUsers(eventId, setUsers);
  }, [subscribeToEventUsers, readOnly, isRealtimeEnabled, eventId]);

  // close the group tooltip when tapping anywhere outside a time cell (mobile)
  useEffect(() => {
    if (!readOnly || !activeGroupCellId) return undefined;

    const handleOutsidePointer = (pointerEvent) => {
      const isOnCell =
        pointerEvent.target instanceof Element &&
        pointerEvent.target.closest("[data-time-cell]");
      if (!isOnCell) setActiveGroupCellId(null);
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [readOnly, activeGroupCellId]);

  const persistSelection = useCallback(
    (nextSelection) => {
      if (!user) return;
      void POST_USER_TIME(eventId, {
        user,
        time: [...nextSelection],
        timezone,
      });
    },
    [POST_USER_TIME, eventId, timezone, user],
  );

  const commitSelection = useCallback(
    (nextSelection, previousSelection) => {
      selectedTimeRef.current = nextSelection;
      setSelectedTime(nextSelection);

      if (!areSetsEqual(nextSelection, previousSelection)) {
        persistSelection(nextSelection);
      }
    },
    [persistSelection],
  );

  const cancelScheduledDragRender = useCallback(() => {
    if (dragAnimationFrameRef.current === null) return;
    cancelAnimationFrame(dragAnimationFrameRef.current);
    dragAnimationFrameRef.current = null;
  }, []);

  const clearDrag = useCallback(() => {
    cancelScheduledDragRender();
    dragSelectionRef.current = null;
    activePointerIdRef.current = null;
    capturedGridRef.current = null;
    setDragSelection(null);
  }, [cancelScheduledDragRender]);

  const cancelDrag = useCallback(() => {
    const capturedGrid = capturedGridRef.current;
    const activePointerId = activePointerIdRef.current;

    if (
      capturedGrid &&
      activePointerId !== null &&
      capturedGrid.hasPointerCapture(activePointerId)
    ) {
      capturedGrid.releasePointerCapture(activePointerId);
    }

    clearDrag();
  }, [clearDrag]);

  useEffect(() => {
    window.addEventListener("blur", cancelDrag);

    return () => {
      window.removeEventListener("blur", cancelDrag);
      cancelScheduledDragRender();

      const capturedGrid = capturedGridRef.current;
      const activePointerId = activePointerIdRef.current;
      if (
        capturedGrid &&
        activePointerId !== null &&
        capturedGrid.hasPointerCapture(activePointerId)
      ) {
        capturedGrid.releasePointerCapture(activePointerId);
      }
    };
  }, [cancelDrag, cancelScheduledDragRender]);

  const handlePointerDown = useCallback(
    (pointerEvent) => {
      if (readOnly || pointerEvent.button !== 0) return;
      if (activePointerIdRef.current !== null) return;

      const gridElement = pointerEvent.currentTarget;
      const cellElement = getCellElement(pointerEvent.target, gridElement);
      if (!cellElement) return;

      const cell = getCellCoordinates(cellElement);
      if (!cell.isSelectable) return;

      pointerEvent.preventDefault();
      cellElement.focus({ preventScroll: true });
      gridElement.setPointerCapture(pointerEvent.pointerId);
      activePointerIdRef.current = pointerEvent.pointerId;
      capturedGridRef.current = gridElement;

      const baseSelection = new Set(selectedTimeRef.current);
      const nextDragSelection = {
        mode: baseSelection.has(cell.id) ? "remove" : "add",
        baseSelection,
        start: cell,
        end: cell,
      };
      dragSelectionRef.current = nextDragSelection;
      setDragSelection(nextDragSelection);
      setFocusedCellId(cell.id);
    },
    [readOnly],
  );

  const handlePointerMove = useCallback((pointerEvent) => {
    if (pointerEvent.pointerId !== activePointerIdRef.current) return;
    const currentDragSelection = dragSelectionRef.current;
    if (!currentDragSelection) return;

    const cellElement = getCellElementFromPoint(
      pointerEvent,
      pointerEvent.currentTarget,
    );
    if (!cellElement) return;

    const nextEndCell = getCellCoordinates(cellElement);
    if (!nextEndCell.isSelectable) return;
    if (
      currentDragSelection.end.rowIndex === nextEndCell.rowIndex &&
      currentDragSelection.end.columnIndex === nextEndCell.columnIndex
    ) {
      return;
    }

    const nextDragSelection = {
      ...currentDragSelection,
      end: nextEndCell,
    };
    dragSelectionRef.current = nextDragSelection;

    if (dragAnimationFrameRef.current !== null) return;
    dragAnimationFrameRef.current = requestAnimationFrame(() => {
      dragAnimationFrameRef.current = null;
      setDragSelection(dragSelectionRef.current);
    });
  }, []);

  const handlePointerUp = useCallback(
    (pointerEvent) => {
      if (pointerEvent.pointerId !== activePointerIdRef.current) return;
      const completedDragSelection = dragSelectionRef.current;
      if (!completedDragSelection) return;

      const finalSelection = buildSelectionPreview(
        completedDragSelection,
        cellMatrix,
      );
      commitSelection(finalSelection, completedDragSelection.baseSelection);

      if (
        pointerEvent.currentTarget.hasPointerCapture(pointerEvent.pointerId)
      ) {
        pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId);
      }
      clearDrag();
    },
    [cellMatrix, clearDrag, commitSelection],
  );

  const handlePointerCancel = useCallback(
    (pointerEvent) => {
      if (pointerEvent.pointerId !== activePointerIdRef.current) return;
      cancelDrag();
    },
    [cancelDrag],
  );

  const handleLostPointerCapture = useCallback(() => {
    if (activePointerIdRef.current === null) return;
    clearDrag();
  }, [clearDrag]);

  const moveKeyboardFocus = useCallback(
    (keyboardEvent, currentCell, rowChange, columnChange) => {
      let nextRowIndex = currentCell.rowIndex + rowChange;
      let nextColumnIndex = currentCell.columnIndex + columnChange;

      while (cellMatrix[nextRowIndex]?.[nextColumnIndex]) {
        const nextCell = cellMatrix[nextRowIndex][nextColumnIndex];
        if (readOnly || nextCell.isSelectable) {
          const nextCellElement = keyboardEvent.currentTarget.querySelector(
            `[data-time-row="${nextRowIndex}"][data-time-column="${nextColumnIndex}"]`,
          );
          nextCellElement?.focus();
          return;
        }

        nextRowIndex += rowChange;
        nextColumnIndex += columnChange;
      }
    },
    [cellMatrix, readOnly],
  );

  const handleGridKeyDown = useCallback(
    (keyboardEvent) => {
      const cellElement = getCellElement(
        keyboardEvent.target,
        keyboardEvent.currentTarget,
      );
      if (!cellElement) return;

      const currentCell = getCellCoordinates(cellElement);
      const directionByKey = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };
      const direction = directionByKey[keyboardEvent.key];

      if (direction) {
        keyboardEvent.preventDefault();
        moveKeyboardFocus(
          keyboardEvent,
          currentCell,
          direction[0],
          direction[1],
        );
        return;
      }

      if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") return;
      keyboardEvent.preventDefault();

      if (readOnly) {
        setActiveGroupCellId(currentCell.id);
        return;
      }

      if (!currentCell.isSelectable) return;
      const previousSelection = selectedTimeRef.current;
      const nextSelection = new Set(previousSelection);
      if (nextSelection.has(currentCell.id)) {
        nextSelection.delete(currentCell.id);
      } else {
        nextSelection.add(currentCell.id);
      }
      commitSelection(nextSelection, previousSelection);
    },
    [commitSelection, moveKeyboardFocus, readOnly],
  );

  const handleGridFocus = useCallback((focusEvent) => {
    const cellElement = getCellElement(
      focusEvent.target,
      focusEvent.currentTarget,
    );
    if (!cellElement) return;
    setFocusedCellId(cellElement.dataset.timeCell);
  }, []);

  const handleGroupPointerOver = useCallback(
    (pointerEvent) => {
      if (!readOnly || pointerEvent.pointerType === "touch") return;
      const cellElement = getCellElement(
        pointerEvent.target,
        pointerEvent.currentTarget,
      );
      if (!cellElement) return;
      setGroupAnchorRect(
        getCellOffsetWithinGrid(cellElement, pointerEvent.currentTarget),
      );
      setActiveGroupCellId(cellElement.dataset.timeCell);
    },
    [readOnly],
  );

  const handleGroupPointerUp = useCallback(
    (pointerEvent) => {
      if (!readOnly || pointerEvent.pointerType !== "touch") return;
      const cellElement = getCellElement(
        pointerEvent.target,
        pointerEvent.currentTarget,
      );
      if (!cellElement) return;

      const nextCellId = cellElement.dataset.timeCell;
      setGroupAnchorRect(
        getCellOffsetWithinGrid(cellElement, pointerEvent.currentTarget),
      );
      setActiveGroupCellId((currentCellId) => {
        return currentCellId === nextCellId ? null : nextCellId;
      });
    },
    [readOnly],
  );

  const handleGroupPointerLeave = useCallback(
    (pointerEvent) => {
      if (!readOnly || pointerEvent.pointerType === "touch") return;
      setActiveGroupCellId(null);
    },
    [readOnly],
  );

  const columnHeaders =
    event.type === "dates"
      ? localTimes.dates.map((date) => (
          <GridItem
            key={date}
            role="columnheader"
            w="100%"
            minW={{ base: "100px" }}
            mb={event.allDay ? "8px" : { base: 4, md: 2 }}
          >
            <Center>{getMonthAndDate(date, configs.lang)}</Center>
            <Center>{displayDay(date, configs.lang)}</Center>
          </GridItem>
        ))
      : localTimes.days.map((day) => (
          <GridItem
            key={day}
            role="columnheader"
            mb={event.allDay ? "8px" : { base: 4, md: 2 }}
          >
            <Center>{translateDay(day, configs.lang)}</Center>
          </GridItem>
        ));

  const firstFocusableCell = gridCells.find((cell) => {
    return readOnly || cell.isSelectable;
  })?.id;
  const columnCount =
    event.type === "dates" ? localTimes.dates.length : localTimes.days.length;
  const rowCount = event.allDay
    ? 1
    : Math.max(0, ...gridCells.map((cell) => cell.rowIndex + 1));

  const grid = (
    <Grid
      role="grid"
      aria-rowcount={rowCount + 1}
      aria-colcount={columnCount}
      className="time-grid"
      gridTemplateRows={`auto repeat(${rowCount}, auto)`}
      gridTemplateColumns={`repeat(${columnCount}, 1fr)`}
      w="100%"
      h="fit-content"
      pos="relative"
      onPointerDown={readOnly ? undefined : handlePointerDown}
      onPointerMove={readOnly ? undefined : handlePointerMove}
      onPointerUp={readOnly ? handleGroupPointerUp : handlePointerUp}
      onPointerCancel={readOnly ? undefined : handlePointerCancel}
      onLostPointerCapture={readOnly ? undefined : handleLostPointerCapture}
      onPointerOver={readOnly ? handleGroupPointerOver : undefined}
      onPointerLeave={readOnly ? handleGroupPointerLeave : undefined}
      onFocus={handleGridFocus}
      onKeyDown={handleGridKeyDown}
    >
      {columnHeaders}
      {gridCells.map((cell) => {
        const isSelected = readOnly ? false : previewSelection.has(cell.id);
        const availability = groupTime[cell.id];
        return (
          <TimeCell
            key={cell.id}
            id={cell.id}
            rowIndex={cell.rowIndex}
            columnIndex={cell.columnIndex}
            isSelectable={cell.isSelectable}
            isSelected={isSelected}
            isReadOnly={readOnly}
            label={cell.label}
            tabIndex={
              focusedCellId === cell.id ||
              (!focusedCellId && firstFocusableCell === cell.id)
                ? 0
                : -1
            }
            backgroundColor={
              readOnly
                ? generateAvailabilityColor(
                    availability?.length / users?.length,
                    colorMode === "dark",
                  )
                : isSelected
                  ? colors[colorMode].bg.timetableSelected
                  : "transparent"
            }
            opacity={cell.isSelectable ? 1 : 0.1}
            tableBorder={colors[colorMode].border.table}
            alternateTableBorder={colors[colorMode].border.table2}
            shouldAnimateBackground={readOnly}
          />
        );
      })}
      {readOnly && activeGroupCell && groupAnchorRect && (
        <PopoverAnchor>
          <Box
            pos="absolute"
            left={`${groupAnchorRect.left}px`}
            top={`${groupAnchorRect.top}px`}
            w={`${groupAnchorRect.width}px`}
            h={`${groupAnchorRect.height}px`}
            pointerEvents="none"
            aria-hidden
          />
        </PopoverAnchor>
      )}
    </Grid>
  );

  const table = (
    <VStack
      w="100%"
      className="time-table"
      overflowX="auto"
      pos="relative"
      p="0 4px 8px 0px"
      alignItems="flex-start"
      minH="300px"
    >
      {readOnly ? (
        <Popover
          returnFocusOnClose={false}
          isOpen={Boolean(activeGroupCell)}
          onClose={() => setActiveGroupCellId(null)}
          closeOnBlur
          isLazy
          lazyBehavior="unmount"
          autoFocus={false}
          modifiers={[{ name: "preventOverflow", options: { padding: 8 } }]}
        >
          {grid}
          <GroupPopoverContent
            cell={activeGroupCell}
            whoIsAvailable={activeGroupAvailability}
            users={users}
            colorMode={colorMode}
            context={context}
          />
        </Popover>
      ) : (
        grid
      )}
    </VStack>
  );

  return (
    <Center
      fontWeight="bold"
      fontSize="12px"
      margin="0 auto"
      flexDir="column"
      gap={5}
      alignItems="flex-start"
    >
      {event.allDay ? (
        <VStack
          spacing={0}
          pt="0rem"
          pos="absolute"
          left={{ base: "-0px", md: "-50px" }}
          top={event.type === "dates" ? "40px" : "22px"}
          zIndex={1}
        >
          <Center
            h={{ base: "60px", md: "70px" }}
            borderRadius="sm"
            border={{ base: colors[colorMode].border.table, md: "none" }}
            bg={{ base: colors[colorMode].bg.nav.primary, md: "none" }}
            p="2px"
            top="-15px"
            w={{ base: "30px", md: "50px" }}
            textAlign="center"
            whiteSpace="pre-wrap"
          >
            {context.home.input.switch}
          </Center>
        </VStack>
      ) : (
        <TimeLabels
          event={event}
          localTimes={localTimes}
          configs={configs}
          colorMode={colorMode}
        />
      )}

      {table}

      {readOnly && users && (
        <CustomButton
          onClick={() => downloadObjectAsJson(users)}
          zIndex={10}
          ghost
        >
          {context.event.export}
        </CustomButton>
      )}
    </Center>
  );
};

const TimeLabels = ({ event, localTimes, configs, colorMode }) => {
  return (
    <VStack
      spacing={0}
      pt="0rem"
      pos="absolute"
      left={{ base: "-0px", md: "-48px" }}
      top={
        localTimes.times[0] % 1 === 0 ? { base: "14px", md: "5px" } : "36px"
      }
      zIndex={1}
      alignItems={{ base: "flex-start", md: "center" }}
    >
      <Center h={event.type === "dates" ? "35px" : "20px"} />
      {localTimes.times.map((time, index, allTimes) => {
        const hasBreakpoint =
          index < allTimes.length - 1 && allTimes[index + 1] - time !== 0.5;
        if (time % 1 !== 0) return null;

        return (
          <Center
            key={`${time}-time-column`}
            h={{ base: "60px", md: "70px" }}
            alignItems="flex-start"
          >
            <Center
              borderRadius="sm"
              border={{ base: colors[colorMode].border.table, md: "none" }}
              bg={{ base: colors[colorMode].bg.nav.primary, md: "none" }}
              p="2px"
              top="-10px"
            >
              {displayTime(time, configs.usePM)}
            </Center>
            {hasBreakpoint && (
              <Center
                pos="absolute"
                color={colors[colorMode].font.subtitle}
                top={{ base: "30px", md: "35px" }}
                transform="translateY(-50%)"
              >
                |
              </Center>
            )}
          </Center>
        );
      })}
    </VStack>
  );
};

const GroupPopoverContent = ({
  cell,
  whoIsAvailable,
  users,
  colorMode,
  context,
}) => {
  if (!cell) return null;

  // match the card border color so the arrow gets the same outline
  const arrowBorderColor =
    colorMode === "light" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)";

  return (
    <PopoverContent
      rootProps={{ style: { pointerEvents: "none" } }}
      w="fit-content"
      maxW="360px"
      bg={colors[colorMode].bg.primary}
      border={colors[colorMode].border.table}
      boxShadow="lg"
      pointerEvents="none"
    >
      <PopoverHeader fontWeight="semibold">
        {users && (
          <HStack spacing={1}>
            <Text fontWeight="bold">
              {whoIsAvailable?.length === users.length
                ? context.global.timeTable.all
                : `${whoIsAvailable?.length ?? 0} / ${users.length}`}
            </Text>
            <Text>{context.global.timeTable.available}</Text>
          </HStack>
        )}
        <Text>{cell.label}</Text>
      </PopoverHeader>
      <PopoverArrow
        bg={colors[colorMode].bg.primary}
        sx={{ "--popper-arrow-shadow-color": arrowBorderColor }}
      />
      <PopoverBody>
        <HStack flexWrap="wrap" spacing="4px">
          {users?.map((eventUser) => (
            <CustomTag
              key={`${eventUser.user}-user-tag`}
              isGhost={!whoIsAvailable?.includes(eventUser.user)}
            >
              {eventUser.user}
            </CustomTag>
          ))}
        </HStack>
      </PopoverBody>
    </PopoverContent>
  );
};

const TimeCell = memo(
  forwardRef(
    (
      {
        id,
        rowIndex,
        columnIndex,
        isSelectable,
        isSelected,
        isReadOnly,
        label,
        backgroundColor,
        tableBorder,
        alternateTableBorder,
        shouldAnimateBackground,
        ...props
      },
      ref,
    ) => {
      return (
        <GridItem
          ref={ref}
          // editable cells disable touch scrolling so drag-select works;
          // read-only cells stay scrollable so the grid can be panned
          className={isReadOnly ? undefined : "no-touch-action"}
          role="gridcell"
          aria-label={label}
          aria-rowindex={rowIndex + 2}
          aria-colindex={columnIndex + 1}
          aria-selected={isReadOnly ? undefined : isSelected}
          aria-disabled={isSelectable ? undefined : true}
          data-time-cell={id}
          data-time-row={rowIndex}
          data-time-column={columnIndex}
          data-is-selectable={isSelectable ? "true" : "false"}
          w="100%"
          minW="100px"
          h={{ base: "30px", md: "35px" }}
          border={tableBorder}
          p="4px 8px"
          borderRadius="sm"
          backgroundColor={backgroundColor}
          transition={
            shouldAnimateBackground ? "background-color .2s ease" : "none"
          }
          borderBottom={
            rowIndex % 2 === 0 ? alternateTableBorder : tableBorder
          }
          borderTop={rowIndex % 2 === 0 ? tableBorder : "none"}
          cursor={
            isReadOnly ? "default" : isSelectable ? "pointer" : "not-allowed"
          }
          {...props}
        />
      );
    },
  ),
);

TimeCell.displayName = "TimeCell";

export default TimeTable;
