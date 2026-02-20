import { useState } from "react";

import preview from "@/storybook/preview";
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

// --- Helpers ---

const fruitItems = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
];

const foodItems = [
  ...fruitItems,
  { value: "aubergine", label: "Aubergine" },
  { value: "broccoli", label: "Broccoli" },
  { value: "carrot", label: "Carrot" },
  { value: "courgette", label: "Courgette" },
  { value: "leek", label: "Leek" },
  { value: "beef", label: "Beef" },
  { value: "chicken", label: "Chicken" },
  { value: "lamb", label: "Lamb" },
  { value: "pork", label: "Pork" },
];

const themeItems = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
  { value: "apple", label: "Apple" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "citrus", label: "Citrus" },
];

/**
 * Displays a list of options for the user to pick from—triggered by a button.
 */
const meta = preview.meta({
  title: "ui/Select",
  component: Select,
  args: {
    onValueChange: fn(),
  },
  render: (args) => (
    <Select {...args} items={fruitItems}>
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
    docs: {
      description: {
        component:
          "Displays a list of options for the user to pick from—triggered by a button. See also [NativeSelect](?path=/docs/ui-nativeselect--docs) and [Combobox](?path=/docs/ui-combobox--docs).\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/select)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the select.
 */
export const Default = meta.story();

// --- Tests ---

Default.test(
  "when an option is selected, should be checked",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const select = await canvasBody.findByRole("combobox");

    await step("open and select item", async () => {
      await userEvent.click(select);
      await userEvent.click(
        await canvasBody.findByRole("option", { name: /Banana/ })
      );
      await expect(select).toHaveTextContent(/Banana/);
    });

    await step("verify the selected option", async () => {
      await userEvent.click(select);
      await expect(
        await canvasBody.findByRole("option", { name: /Banana/ })
      ).toHaveAttribute("data-selected");
      await userEvent.keyboard("{Escape}");
    });
  }
);

/**
 * Use SelectGroup, SelectLabel, and SelectSeparator to organize items.
 */
export const Groups = meta.story({
  render: (args) => (
    <Select {...args} items={foodItems}>
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
});

/**
 * A scrollable select with many items grouped by region.
 */
export const Scrollable = meta.story({
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Select a timezone" className="w-72">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      {/* cspell:disable -- timezone abbreviations */}
      <SelectContent aria-label="Timezone options">
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
          <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="AKST">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="HST">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="CET">Central European Time (CET)</SelectItem>
          <SelectItem value="EET">Eastern European Time (EET)</SelectItem>
          <SelectItem value="WEST">
            Western European Summer Time (WEST)
          </SelectItem>
          <SelectItem value="CAT">Central Africa Time (CAT)</SelectItem>
          <SelectItem value="EAT">East Africa Time (EAT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="MSK">Moscow Time (MSK)</SelectItem>
          <SelectItem value="IST">India Standard Time (IST)</SelectItem>
          <SelectItem value="CST (China)">China Standard Time (CST)</SelectItem>
          <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="KST">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="WITA">
            Indonesia Central Standard Time (WITA)
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="AWST">
            Australian Western Standard Time (AWST)
          </SelectItem>
          <SelectItem value="ACST">
            Australian Central Standard Time (ACST)
          </SelectItem>
          <SelectItem value="AEST">
            Australian Eastern Standard Time (AEST)
          </SelectItem>
          <SelectItem value="NZST">New Zealand Standard Time (NZST)</SelectItem>
          <SelectItem value="FJT">Fiji Time (FJT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="ART">Argentina Time (ART)</SelectItem>
          <SelectItem value="BOT">Bolivia Time (BOT)</SelectItem>
          <SelectItem value="BRT">Brasilia Time (BRT)</SelectItem>
          <SelectItem value="CLT">Chile Standard Time (CLT)</SelectItem>
        </SelectGroup>
      </SelectContent>
      {/* cspell:enable */}
    </Select>
  ),
});

/**
 * Use the `disabled` prop to disable the select, preventing user interaction.
 * Individual items can also be disabled.
 */
export const Disabled = meta.story({
  render: (args) => (
    <Select {...args} items={fruitItems} disabled>
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
});

/**
 * Select integrated within a Field component.
 */
export const WithField = meta.story({
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
});

/**
 * An invalid select displaying an error state with FieldError.
 */
export const Invalid = meta.story({
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
});

/**
 * Toggle popup alignment with the trigger using `alignItemWithTrigger`.
 */
export const AlignItemWithTrigger = meta.story({
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
          <Select {...args} items={fruitItems} defaultValue="banana">
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
});

Default.test(
  "when pressing Escape, should close the dropdown",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const select = await canvasBody.findByRole("combobox");

    await step("open the dropdown", async () => {
      await userEvent.click(select);
      await expect(await canvasBody.findByRole("listbox")).toBeInTheDocument();
    });

    await step("press Escape to close", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(select).toHaveAttribute("aria-expanded", "false");
    });
  }
);

Default.test(
  "when using keyboard navigation, should move through options",
  async ({ canvasElement, step }) => {
    const canvasBody = within(canvasElement.ownerDocument.body);
    const select = await canvasBody.findByRole("combobox");

    await step("open and navigate with arrow keys", async () => {
      await userEvent.click(select);
      await expect(await canvasBody.findByRole("listbox")).toBeInTheDocument();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
    });

    await step("verify selection", async () => {
      await expect(select).toHaveTextContent(/Banana|Blueberry/);
    });
  }
);

/**
 * Select items with icons displayed alongside the text.
 */
export const WithIcons = meta.story({
  render: (args) => (
    <Select {...args} items={themeItems} defaultValue="light">
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
});
