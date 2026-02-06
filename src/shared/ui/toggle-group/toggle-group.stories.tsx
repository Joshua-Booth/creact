import preview from "@/storybook/preview";
import { Bold, Italic, Underline } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

/**
 * A set of two-state buttons that can be toggled on or off.
 */
const meta = preview.meta({
  title: "ui/ToggleGroup",
  component: ToggleGroup,
  argTypes: {},
  args: {
    variant: "default",
    size: "default",
    disabled: false,
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the toggle group.
 */
export const Default = meta.story();

/**
 * Use the `outline` variant to emphasizing the individuality of each button
 * while keeping them visually cohesive.
 */
export const Outline = meta.story({
  args: {
    variant: "outline",
    multiple: true,
  },
});

/**
 * Use the `size` prop to control the dimensions of the toggle group items.
 */
export const Size = meta.story({
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup size="sm" variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="lg" variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
});

/**
 * Use the `spacing` prop to add gaps between toggle group items.
 */
export const Spacing = meta.story({
  args: {
    variant: "outline",
    spacing: 2,
    multiple: true,
  },
});

/**
 * Use `orientation="vertical"` to stack toggle items in a column layout.
 */
export const Vertical = meta.story({
  args: {
    orientation: "vertical",
    spacing: 1,
    multiple: true,
  },
});

/**
 * Add the `disabled` prop to a button to prevent interactions.
 */
export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

// --- Tests ---

Default.test(
  "when clicking items, should toggle their pressed state",
  async ({ canvas, step }) => {
    const buttons = await canvas.findAllByRole("button");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- findAllByRole throws if no elements found
    const first = buttons[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- findAllByRole throws if no elements found
    const second = buttons[1]!;

    await step("click first item to press it", async () => {
      await userEvent.click(first);
      await expect(first).toHaveAttribute("aria-pressed", "true");
    });

    await step("click second item, first deselects", async () => {
      await userEvent.click(second);
      await expect(first).toHaveAttribute("aria-pressed", "false");
      await expect(second).toHaveAttribute("aria-pressed", "true");
    });

    await step("click second again to deselect it", async () => {
      await userEvent.click(second);
      await expect(second).toHaveAttribute("aria-pressed", "false");
    });
  }
);

Disabled.test(
  "when group is disabled, should not toggle items",
  async ({ canvas }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- findAllByRole throws if no elements found
    const first = (await canvas.findAllByRole("button"))[0]!;
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(first, { pointerEventsCheck: 0 });
    await expect(first).toHaveAttribute("aria-pressed", "false");
  }
);
