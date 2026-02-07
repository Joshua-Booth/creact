import * as React from "react";

import type { DateRange, DayButton } from "react-day-picker";
import preview from "@/storybook/preview";
import { addDays } from "date-fns";
import { Clock2Icon } from "lucide-react";
import { action } from "storybook/actions";
import { expect, fn, userEvent } from "storybook/test";

import { Button } from "../button";
import { Card, CardContent, CardFooter } from "../card";
import { Field, FieldGroup, FieldLabel } from "../field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Calendar, CalendarDayButton } from "./calendar";

/**
 * A date field component that allows users to enter and edit date.
 */
const meta = preview.meta({
  title: "ui/Calendar",
  component: Calendar,
  argTypes: {
    mode: {
      table: {
        disable: true,
      },
    },
    disabled: {
      control: "boolean",
    },
    numberOfMonths: {
      control: "number",
      description: "Number of months to display",
    },
    showOutsideDays: {
      control: "boolean",
      description: "Show days that fall outside the current month",
    },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
      description: "Layout of the caption for navigation",
    },
    showWeekNumber: {
      control: "boolean",
      description: "Show week numbers",
    },
  },
  args: {
    mode: "single",
    selected: new Date(),
    onSelect: action("onDayClick"),
    className: "rounded-md border w-fit",
    disabled: false,
    numberOfMonths: 1,
    showOutsideDays: true,
  },
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * Basic calendar with single date selection.
 */
export const Default = meta.story({});

/**
 * Use the `multiple` mode to select multiple dates.
 */
export const Multiple = meta.story({
  args: {
    min: 1,
    selected: [new Date(), addDays(new Date(), 2), addDays(new Date(), 8)],
    mode: "multiple",
  },
});

/**
 * Use the `range` mode to select a range of dates with multiple months displayed.
 */
export const Range = meta.story({
  args: {
    selected: {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
    mode: "range",
    numberOfMonths: 2,
  },
});

/**
 * Use `captionLayout="dropdown"` to enable month and year dropdown selectors.
 */
export const Caption = meta.story({
  args: {
    captionLayout: "dropdown",
  },
});

/**
 * Calendar with preset date buttons for quick selection.
 */
export const WithPresets = meta.story({
  render: function WithPresetsStory(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      () => new Date(new Date().getFullYear(), 1, 12)
    );
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    return (
      <Card className="mx-auto w-72" size="sm">
        <CardContent>
          <Calendar
            {...args}
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            className="p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {[
            { label: "Today", value: 0 },
            { label: "Tomorrow", value: 1 },
            { label: "In 3 days", value: 3 },
            { label: "In a week", value: 7 },
            { label: "In 2 weeks", value: 14 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value);
                setDate(newDate);
                setCurrentMonth(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                );
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    );
  },
});

/**
 * Calendar with start and end time inputs for date-time selection.
 */
export const WithTime = meta.story({
  render: function WithTimeStory(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 12)
    );

    return (
      <Card size="sm" className="mx-auto w-fit">
        <CardContent>
          <Calendar
            {...args}
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-0"
          />
        </CardContent>
        <CardFooter className="bg-card border-t">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-from"
                  type="time"
                  step="1"
                  defaultValue="10:30:00"
                  className="appearance-none
                    [&::-webkit-calendar-picker-indicator]:hidden
                    [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="time-to">End Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-to"
                  type="time"
                  step="1"
                  defaultValue="12:30:00"
                  className="appearance-none
                    [&::-webkit-calendar-picker-indicator]:hidden
                    [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    );
  },
});

/**
 * Use the `disabled` prop with custom modifiers to show booked or unavailable dates.
 */
export const Disabled = meta.story({
  render: function DisabledStory(args) {
    const [date, setDate] = React.useState<Date | undefined>(
      () => new Date(new Date().getFullYear(), 0, 6)
    );
    const bookedDates = Array.from(
      { length: 15 },
      (_, i) => new Date(new Date().getFullYear(), 0, 12 + i)
    );

    return (
      <Calendar
        {...args}
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        disabled={bookedDates}
        modifiers={{ booked: bookedDates }}
        modifiersClassNames={{
          booked: "[&>button]:line-through opacity-100",
        }}
        className="rounded-md border"
      />
    );
  },
});

function CustomDayButton({
  children,
  modifiers,
  day,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

  return (
    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
      {children}
      {!modifiers.outside && (
        <span className="text-[10px]">{isWeekend ? "$120" : "$100"}</span>
      )}
    </CalendarDayButton>
  );
}

/**
 * Calendar with custom day content showing additional information like pricing.
 */
export const CustomDays = meta.story({
  render: function CustomDaysStory(args) {
    const [range, setRange] = React.useState<DateRange | undefined>(() => ({
      from: new Date(new Date().getFullYear(), 11, 8),
      to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
    }));

    return (
      <Calendar
        {...args}
        mode="range"
        defaultMonth={range?.from}
        selected={range}
        onSelect={setRange}
        captionLayout="dropdown"
        className="rounded-md border [--cell-size:--spacing(10)]
          md:[--cell-size:--spacing(12)]"
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "long" }),
        }}
        components={{
          DayButton: CustomDayButton,
        }}
      />
    );
  },
  parameters: {
    a11y: {
      // Custom day content with small text has color contrast issues by design
      disable: true,
    },
  },
});

/**
 * Calendar displaying week numbers alongside the days.
 */
export const WeekNumbers = meta.story({
  args: {
    showWeekNumber: true,
  },
  parameters: {
    a11y: {
      // react-day-picker has a known issue with scope attribute on week numbers
      disable: true,
    },
  },
});

/**
 * Calendar with timezone detection to prevent date offset issues.
 */
export const WithTimezone = meta.story({
  name: "With Timezone",
  render: function WithTimezoneStory(args) {
    const [date, setDate] = React.useState<Date | undefined>();
    const [timeZone] = React.useState(
      () => Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        timeZone={timeZone}
        className="rounded-md border"
      />
    );
  },
});

// --- Tests ---

Default.test(
  "when using the calendar navigation, should change months",
  {
    args: {
      captionLayout: "label",
      defaultMonth: new Date(2000, 8),
    },
  },
  async ({ canvas }) => {
    const title = await canvas.findByText(/2000/i);
    const startTitle = title.textContent;
    const backBtn = await canvas.findByRole("button", {
      name: /previous/i,
    });
    const nextBtn = await canvas.findByRole("button", {
      name: /next/i,
    });
    const steps = 6;
    for (let i = 0; i < steps / 2; i++) {
      await userEvent.click(backBtn);
      await expect(title).not.toHaveTextContent(startTitle);
    }
    for (let i = 0; i < steps; i++) {
      await userEvent.click(nextBtn);
      if (i == steps / 2 - 1) {
        await expect(title).toHaveTextContent(startTitle);
        continue;
      }
      await expect(title).not.toHaveTextContent(startTitle);
    }
  }
);

Default.test(
  "when clicking a date, should trigger onSelect",
  {
    args: {
      defaultMonth: new Date(2000, 0),
      selected: undefined,
      onSelect: fn(),
      showOutsideDays: false,
    },
  },
  async ({ args, canvas }) => {
    const onSelect = (args as unknown as { onSelect: ReturnType<typeof fn> })
      .onSelect;
    const dayText = await canvas.findByText("15");
    const dayButton = dayText.closest("button") ?? dayText;
    await userEvent.click(dayButton);
    await expect(onSelect).toHaveBeenCalledTimes(1);
  }
);

Range.test(
  "when selecting start and end dates, should trigger onSelect for each",
  {
    args: {
      defaultMonth: new Date(2000, 0),
      selected: undefined,
      onSelect: fn(),
      numberOfMonths: 1,
      showOutsideDays: false,
    },
  },
  async ({ args, canvas }) => {
    const onSelect = (args as unknown as { onSelect: ReturnType<typeof fn> })
      .onSelect;
    const startText = await canvas.findByText("10");
    const startButton = startText.closest("button") ?? startText;
    await userEvent.click(startButton);
    await expect(onSelect).toHaveBeenCalledTimes(1);

    const endText = await canvas.findByText("20");
    const endButton = endText.closest("button") ?? endText;
    await userEvent.click(endButton);
    await expect(onSelect).toHaveBeenCalledTimes(2);
  }
);

Default.test(
  "when clicking a disabled date, should not trigger onSelect",
  {
    args: {
      defaultMonth: new Date(2000, 0),
      selected: undefined,
      onSelect: fn(),
      showOutsideDays: false,
      disabled: [new Date(2000, 0, 15)],
    },
  },
  async ({ args, canvas }) => {
    const onSelect = (args as unknown as { onSelect: ReturnType<typeof fn> })
      .onSelect;
    const enabledText = await canvas.findByText("10");
    const enabledButton = enabledText.closest("button") ?? enabledText;
    await userEvent.click(enabledButton);
    await expect(onSelect).toHaveBeenCalledTimes(1);

    const disabledText = await canvas.findByText("15");
    const disabledButton = disabledText.closest("button") ?? disabledText;
    await userEvent.click(disabledButton, { pointerEventsCheck: 0 });
    await expect(onSelect).toHaveBeenCalledTimes(1);
  }
);
