import * as React from "react";

import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/shared/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.use(ChartContext);

  /* v8 ignore start -- Defensive guard: unreachable when used within <ChartContainer /> */
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  /* v8 ignore stop */

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  width,
  aspect,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  /** Width for ResponsiveContainer. Set in test/SSR environments to prevent warnings. */
  width?: number;
  /** Aspect ratio (width/height) for ResponsiveContainer. Set in test/SSR environments to prevent warnings. */
  aspect?: number;
}) {
  const uniqueId = React.useId();
  // eslint-disable-next-line unicorn/prefer-string-replace-all -- Project targets ES2020, replaceAll requires ES2021
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  const contextValue = React.useMemo(() => ({ config }), [config]);

  return (
    <ChartContext value={contextValue}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          `[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground
          [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50
          [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border
          [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border
          [&_.recharts-radial-bar-background-sector]:fill-muted
          [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted
          [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex
          aspect-video justify-center text-xs
          [&_.recharts-dot[stroke='#fff']]:stroke-transparent
          [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden
          [&_.recharts-sector[stroke='#fff']]:stroke-transparent
          [&_.recharts-surface]:outline-hidden`,
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width={width} aspect={aspect}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme !== undefined || config.color !== undefined
  );

  /* v8 ignore start -- Empty config early return, only triggers with no theme config */
  if (colorConfig.length === 0) {
    return null;
  }
  /* v8 ignore stop */

  /* eslint-disable @eslint-react/dom/no-dangerously-set-innerhtml -- CSS injection for chart theming is intentional and safe */
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color;
    /* v8 ignore start -- Null color branch only with incomplete config */
    return color ? `  --color-${key}: ${color};` : null;
    /* v8 ignore stop */
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
  /* eslint-enable @eslint-react/dom/no-dangerously-set-innerhtml -- re-enable after injecting chart CSS variables */
};

const ChartTooltip = RechartsPrimitive.Tooltip;

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/strict-boolean-expressions -- Recharts payload objects are typed as any */
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<ValueType, NameType>,
    "accessibilityLayer"
  >) {
  const { config } = useChart();

  /* v8 ignore start -- Recharts tooltip label computation with many conditional branches */
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = String(labelKey ?? item?.dataKey ?? item?.name ?? "value");
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);
  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        `border-border/50 bg-background grid min-w-32 items-start gap-1.5
        rounded-lg border px-2.5 py-1.5 text-xs shadow-xl`,
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = String(nameKey ?? item.name ?? item.dataKey ?? "value");
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;

            return (
              <div
                key={key}
                className={cn(
                  `[&>svg]:text-muted-foreground flex w-full flex-wrap
                  items-stretch gap-2 [&>svg]:size-2.5`,
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            `border-border shrink-0 rounded-[2px]
                              bg-(--color-bg)`,
                            {
                              "size-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span
                          className="text-foreground font-mono font-medium
                            tabular-nums"
                        >
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
  /* v8 ignore stop */
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/strict-boolean-expressions -- re-enable after Recharts untyped tooltip rendering */

const ChartLegend = RechartsPrimitive.Legend;

/* v8 ignore start -- Recharts legend rendering with conditional branches */
/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions -- Recharts LegendProps payload is typed with DataKey<any> */
function ChartLegendContent({
  className,
  hideIcon = false,
  nameKey,
  payload,
  verticalAlign,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                `[&>svg]:text-muted-foreground flex items-center gap-1.5
                [&>svg]:size-3`
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}
/* eslint-enable @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions -- re-enable after Recharts untyped legend rendering */
/* v8 ignore stop */

/* v8 ignore start -- Recharts internal payload lookup, triggered by tooltip/legend callbacks */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}
/* v8 ignore stop */

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
