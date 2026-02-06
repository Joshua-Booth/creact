import * as React from "react";

import type { DateRange, DayButton } from "react-day-picker";
import preview from "@/storybook/preview";
import { addDays, format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { action } from "storybook/actions";
import { expect, userEvent } from "storybook/test";

import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
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
 * Basic calendar with dropdown navigation for month/year selection.
 */
export const Basic = meta.story({
  args: {
    captionLayout: "dropdown",
  },
});

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
 * Use the `disabled` prop to disable specific dates.
 */
export const Disabled = meta.story({
  args: {
    disabled: [
      addDays(new Date(), 1),
      addDays(new Date(), 2),
      addDays(new Date(), 3),
      addDays(new Date(), 5),
    ],
  },
});

// --- Tests ---

Basic.test(
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

/**
 * Use `startMonth` and `endMonth` props to limit the date range that can be navigated.
 */
export const Limited = meta.story({
  args: {
    startMonth: new Date(2024, 0),
    endMonth: new Date(2024, 11),
    defaultMonth: new Date(2024, 5),
  },
});

/**
 * Calendar with dropdown selectors for month and year navigation.
 */
export const Caption = meta.story({
  args: {
    captionLayout: "dropdown",
    startMonth: new Date(2020, 0),
    endMonth: new Date(2030, 11),
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

function CalendarWithPresets() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date());

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        }
      />
      <PopoverContent className="flex w-auto flex-col gap-2 p-2">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), Number.parseInt(value as string)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * A calendar with preset date options in a popover.
 */
export const WithPresets = meta.story({
  render: () => <CalendarWithPresets />,
  parameters: {
    docs: {
      source: {
        code: `
function CalendarWithPresets() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        }
      />
      <PopoverContent className="flex w-auto flex-col gap-2 p-2">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), Number.parseInt(value as string)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}
`,
      },
    },
  },
});

function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date());
  const [time, setTime] = React.useState("12:00");

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? (
              <>
                {format(date, "PPP")} at {time}
              </>
            ) : (
              <span>Pick a date and time</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-3"
        />
        <div className="border-t p-3">
          <Label htmlFor="time" className="text-sm font-medium">
            <ClockIcon className="mr-2 inline-block size-4" />
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * A date picker with time input for selecting both date and time.
 */
export const WithTime = meta.story({
  render: () => <CalendarWithTime />,
  parameters: {
    docs: {
      source: {
        code: `
function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState("12:00");

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? (
              <>
                {format(date, "PPP")} at {time}
              </>
            ) : (
              <span>Pick a date and time</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-3"
        />
        <div className="border-t p-3">
          <Label htmlFor="time" className="text-sm font-medium">
            <ClockIcon className="mr-2 inline-block size-4" />
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
`,
      },
    },
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
        <span className="text-muted-foreground text-[10px]">
          {isWeekend ? "$120" : "$100"}
        </span>
      )}
    </CalendarDayButton>
  );
}

function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>(() => ({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  }));

  return (
    <Calendar
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
}

/**
 * Calendar with custom day content showing additional information like pricing.
 */
export const CustomDays = meta.story({
  render: () => <CalendarCustomDays />,
  parameters: {
    a11y: {
      // Custom day content with small text has color contrast issues by design
      disable: true,
    },
    docs: {
      source: {
        code: `
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
        <span className="text-muted-foreground text-[10px]">
          {isWeekend ? "$120" : "$100"}
        </span>
      )}
    </CalendarDayButton>
  );
}

function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  });

  return (
    <Calendar
      mode="range"
      defaultMonth={range?.from}
      selected={range}
      onSelect={setRange}
      captionLayout="dropdown"
      className="rounded-md border [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "long" }),
      }}
      components={{
        DayButton: CustomDayButton,
      }}
    />
  );
}
`,
      },
    },
  },
});

// eslint-disable-next-line sonarjs/function-return-type -- All returns are valid ReactNode types
function formatDateRange(date: DateRange | undefined): React.ReactNode {
  if (!date?.from) {
    return <span>Pick a date</span>;
  }
  if (date.to) {
    return (
      <>
        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
      </>
    );
  }
  return format(date.from, "LLL dd, y");
}

function DatePickerDemo({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => ({
    from: new Date(),
    to: addDays(new Date(), 7),
  }));

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {formatDateRange(date)}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * A full date range picker with popover and two-month calendar view.
 */
export const DatePicker = meta.story({
  render: () => <DatePickerDemo />,
  parameters: {
    docs: {
      source: {
        code: `
function DatePickerDemo() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
`,
      },
    },
  },
});
