/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- Recharts has poor TypeScript types */
import * as React from "react";

import preview from "@/storybook/preview";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { expect, fireEvent, userEvent } from "storybook/test";

import type { ChartConfig } from "./chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

// --- Helpers ---

const multiSeriesData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const multiSeriesConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const multiSeriesTotals = {
  desktop: multiSeriesData.reduce((acc, curr) => acc + curr.desktop, 0),
  mobile: multiSeriesData.reduce((acc, curr) => acc + curr.mobile, 0),
};

const singleSeriesData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const totalVisitors = singleSeriesData.reduce(
  (acc, curr) => acc + curr.visitors,
  0
);

const singleSeriesConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

/**
 * Beautiful charts. Built using Recharts. Copy and paste into your apps.
 */
const meta = preview.meta({
  title: "ui/Chart",
  component: ChartContainer,
  argTypes: {},
  args: {
    children: <div />,
    className: "min-h-[200px] w-full",
    // Suppress ResponsiveContainer warnings in Storybook (SSR/test environment)
    width: 320,
    aspect: 1.6,
  },
});

// --- Stories ---

/**
 * A basic bar chart with two data series — the simplest starting point.
 */
export const Default = meta.story({
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={multiSeriesData}>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
});

/**
 * A minimal bar chart with `CartesianGrid` for better readability — no axes.
 */
export const BarGrid = meta.story({
  name: "Bar Grid",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
});

/**
 * A bar chart with `CartesianGrid` and an `XAxis` for month labels.
 */
export const BarAxis = meta.story({
  name: "Bar Axis",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
});

/**
 * A bar chart with `ChartTooltip` for displaying values on hover.
 */
export const BarTooltip = meta.story({
  name: "Bar Tooltip",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
});

/**
 * A bar chart with `ChartLegend` for displaying series labels.
 */
export const BarLegend = meta.story({
  name: "Bar Legend",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
});

/**
 * The `ChartTooltipContent` component supports three `indicator` styles:
 * `dot`, `line`, and `dashed`.
 */
export const TooltipIndicators = meta.story({
  name: "Tooltip Indicators",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["dot", "line", "dashed"] as const).map((indicator) => (
        <div key={indicator}>
          <p
            className="text-muted-foreground mb-2 text-sm font-medium
              capitalize"
          >
            {indicator}
          </p>
          <ChartContainer {...args}>
            <BarChart accessibilityLayer data={multiSeriesData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator={indicator} />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      ))}
    </div>
  ),
});

/**
 * An interactive bar chart with selectable datasets. Click the header
 * buttons to switch between Desktop and Mobile data.
 */
export const Interactive = meta.story({
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => {
    const [activeChart, setActiveChart] = React.useState<"desktop" | "mobile">(
      "desktop"
    );

    return (
      <div>
        <div className="flex">
          {(["desktop", "mobile"] as const).map((key) => (
            <button
              key={key}
              type="button"
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col
                items-center justify-center gap-1 border-t px-6 py-4 text-left
                even:border-l"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">
                {multiSeriesConfig[key].label}
              </span>
              <span className="text-foreground text-lg leading-none font-bold">
                {multiSeriesTotals[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
        <ChartContainer {...args}>
          <BarChart accessibilityLayer data={multiSeriesData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>
    );
  },
});

/**
 * Combine multiple Area components to create a stacked area chart.
 */
export const StackedArea = meta.story({
  name: "Stacked Area",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <AreaChart
        accessibilityLayer
        data={multiSeriesData}
        margin={{
          top: 0,
          right: 12,
          bottom: 0,
          left: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="mobile"
          type="natural"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  ),
});

/**
 * Combine multiple Bar components to create a stacked bar chart.
 */
export const StackedBar = meta.story({
  name: "Stacked Bar",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          stackId="a"
          fill="var(--color-desktop)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="mobile"
          stackId="a"
          fill="var(--color-mobile)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  ),
});

/**
 * Combine multiple Line components to create a multi-line chart.
 */
export const LineStory = meta.story({
  name: "Line",
  args: {
    config: multiSeriesConfig,
  },
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart
        accessibilityLayer
        data={multiSeriesData}
        margin={{
          top: 0,
          right: 12,
          bottom: 0,
          left: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="natural"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
});

/**
 * Combine Pie and Label components to create a doughnut chart with a
 * center label showing the total.
 */
export const Doughnut = meta.story({
  args: {
    config: singleSeriesConfig,
  },
  render: (args) => {
    return (
      <ChartContainer {...args}>
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={singleSeriesData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={48}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 24}
                        className="fill-muted-foreground"
                      >
                        Visitors
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    );
  },
});

// --- Tests ---

BarTooltip.test(
  "when hovering the chart, should display tooltip content",
  async ({ canvas, canvasElement, step }) => {
    await step("move mouse over the chart area", async () => {
      const wrapper = canvasElement.querySelector(".recharts-wrapper");
      await expect(wrapper).toBeTruthy();
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        void fireEvent.mouseMove(wrapper, {
          clientX: rect.left + rect.width * 0.5,
          clientY: rect.top + rect.height * 0.5,
        });
      }
    });

    await step("verify tooltip displays series label", async () => {
      const label = await canvas.findByText("Desktop");
      await expect(label).toBeVisible();
    });
  }
);

Interactive.test(
  "when clicking a dataset toggle, should switch the active chart",
  async ({ canvas, step }) => {
    const desktopButton = await canvas.findByRole("button", {
      name: /desktop/i,
    });
    const mobileButton = await canvas.findByRole("button", {
      name: /mobile/i,
    });

    await step("desktop toggle is active by default", async () => {
      await expect(desktopButton).toHaveAttribute("data-active", "true");
      await expect(mobileButton).toHaveAttribute("data-active", "false");
    });

    await step("click Mobile toggle", async () => {
      await userEvent.click(mobileButton);
      await expect(mobileButton).toHaveAttribute("data-active", "true");
      await expect(desktopButton).toHaveAttribute("data-active", "false");
    });

    await step("click Desktop toggle to switch back", async () => {
      await userEvent.click(desktopButton);
      await expect(desktopButton).toHaveAttribute("data-active", "true");
      await expect(mobileButton).toHaveAttribute("data-active", "false");
    });
  }
);
