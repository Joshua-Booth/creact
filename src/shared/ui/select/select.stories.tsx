import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import {
  AppleIcon,
  CherryIcon,
  CitrusIcon,
  GrapeIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../field";
import { Switch } from "../switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * Displays a list of options for the user to pick from—triggered by a button.
 */
const meta: Meta<typeof Select> = {
  title: "ui/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    onValueChange: fn(),
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Select a fruit" className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent aria-label="Fruit options">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the select.
 */
export const Default: Story = {};

export const ShouldSelectOption: Story = {
  name: "when an option is selected, should be checked",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const select = await canvasBody.findByRole("combobox");

    await step("open and select item", async () => {
      await userEvent.click(select);
      await userEvent.click(
        await canvasBody.findByRole("option", { name: /banana/i })
      );
      await expect(select).toHaveTextContent(/banana/i);
    });

    await step("verify the selected option", async () => {
      await userEvent.click(select);
      await expect(
        await canvasBody.findByRole("option", { name: /banana/i })
      ).toHaveAttribute("data-selected");
      await userEvent.click(
        await canvasBody.findByRole("option", { name: /banana/i })
      );
    });
  },
};

/**
 * Use SelectGroup, SelectLabel, and SelectSeparator to organize items.
 */
export const Groups: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Select a food" className="w-48">
        <SelectValue placeholder="Select a food" />
      </SelectTrigger>
      <SelectContent aria-label="Food options">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="aubergine">Aubergine</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="carrot" disabled>
            Carrot
          </SelectItem>
          <SelectItem value="courgette">Courgette</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Meat</SelectLabel>
          <SelectItem value="beef">Beef</SelectItem>
          <SelectItem value="chicken">Chicken</SelectItem>
          <SelectItem value="lamb">Lamb</SelectItem>
          <SelectItem value="pork">Pork</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * A scrollable select with many items grouped by region.
 */
export const Scrollable: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Select a timezone" className="w-72">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      {/* cspell:disable -- timezone abbreviations */}
      <SelectContent aria-label="Timezone options">
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          <SelectItem value="west">
            Western European Summer Time (WEST)
          </SelectItem>
          <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
          <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="ist_indonesia">
            Indonesia Central Standard Time (WITA)
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="awst">
            Australian Western Standard Time (AWST)
          </SelectItem>
          <SelectItem value="acst">
            Australian Central Standard Time (ACST)
          </SelectItem>
          <SelectItem value="aest">
            Australian Eastern Standard Time (AEST)
          </SelectItem>
          <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
          <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="art">Argentina Time (ART)</SelectItem>
          <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
          <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
          <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
        </SelectGroup>
      </SelectContent>
      {/* cspell:enable */}
    </Select>
  ),
};

/**
 * Use the `disabled` prop to disable the select, preventing user interaction.
 * Individual items can also be disabled.
 */
export const Disabled: Story = {
  render: (args) => (
    <Select {...args} disabled>
      <SelectTrigger aria-label="Select a fruit" className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent aria-label="Fruit options">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Select integrated within a Field component.
 */
export const WithField: Story = {
  name: "Field",
  render: (args) => (
    <Field className="w-64">
      <FieldLabel>Email</FieldLabel>
      <Select {...args} defaultValue="m@example.com">
        <SelectTrigger>
          <SelectValue placeholder="Select a verified email to display" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="m@example.com">m@example.com</SelectItem>
          <SelectItem value="m@google.com">m@google.com</SelectItem>
          <SelectItem value="m@support.com">m@support.com</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>
        You can manage email addresses in your email settings.
      </FieldDescription>
    </Field>
  ),
};

/**
 * An invalid select displaying an error state with FieldError.
 */
export const Invalid: Story = {
  render: (args) => (
    <Field data-invalid className="w-64">
      <FieldLabel>Email</FieldLabel>
      <Select {...args}>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Select a verified email to display" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="m@example.com">m@example.com</SelectItem>
          <SelectItem value="m@google.com">m@google.com</SelectItem>
          <SelectItem value="m@support.com">m@support.com</SelectItem>
        </SelectContent>
      </Select>
      <FieldError>Please select an email to display.</FieldError>
    </Field>
  ),
};

/**
 * Toggle popup alignment with the trigger using `alignItemWithTrigger`.
 */
export const AlignItemWithTrigger: Story = {
  render: function Render(args) {
    const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(true);

    return (
      <div className="flex flex-col gap-6">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>Align Item with Trigger</FieldLabel>
            <FieldDescription>
              When enabled, the selected item aligns with the trigger.
            </FieldDescription>
          </FieldContent>
          <Switch
            checked={alignItemWithTrigger}
            onCheckedChange={setAlignItemWithTrigger}
          />
        </Field>

        <div className="flex justify-center">
          <Select {...args} defaultValue="banana">
            <SelectTrigger aria-label="Select a fruit" className="w-48">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};

/**
 * Select items with icons displayed alongside the text.
 */
export const WithIcons: Story = {
  render: (args) => (
    <Select {...args} defaultValue="light">
      <SelectTrigger aria-label="Select a theme" className="w-48">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent aria-label="Theme options">
        <SelectGroup>
          <SelectLabel>Theme</SelectLabel>
          <SelectItem value="light">
            <SunIcon />
            Light
          </SelectItem>
          <SelectItem value="dark">
            <MoonIcon />
            Dark
          </SelectItem>
          <SelectItem value="system">
            <MonitorIcon />
            System
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">
            <AppleIcon />
            Apple
          </SelectItem>
          <SelectItem value="cherry">
            <CherryIcon />
            Cherry
          </SelectItem>
          <SelectItem value="grape">
            <GrapeIcon />
            Grape
          </SelectItem>
          <SelectItem value="citrus">
            <CitrusIcon />
            Citrus
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
