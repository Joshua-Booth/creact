import type { Meta, StoryObj } from "@storybook/react-vite";

import { useRef, useState } from "react";

import { SearchIcon } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button";
import { Field, FieldError, FieldLabel } from "../field";
import { InputGroupAddon } from "../input-group";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "./combobox";

const fruitNames = [
  "Apple",
  "Banana",
  "Blueberry",
  "Grapes",
  "Pineapple",
  "Orange",
  "Mango",
  "Strawberry",
] as const;

const groupedItems = {
  fruits: [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ],
  vegetables: [
    { value: "carrot", label: "Carrot" },
    { value: "broccoli", label: "Broccoli" },
    { value: "spinach", label: "Spinach" },
  ],
  grains: [
    { value: "rice", label: "Rice" },
    { value: "wheat", label: "Wheat" },
    { value: "oats", label: "Oats" },
  ],
};

const countries = [
  { value: "us", label: "United States", description: "North America" },
  { value: "uk", label: "United Kingdom", description: "Europe" },
  { value: "jp", label: "Japan", description: "Asia" },
  { value: "au", label: "Australia", description: "Oceania" },
];

/**
 * An autocomplete input with a filterable list of options.
 */
const meta: Meta<typeof Combobox> = {
  title: "ui/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {},
  args: {},
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [
          // ComboboxTrigger and ComboboxClear buttons are icon-only and lack accessible names
          // This is a component implementation issue to be fixed in the component itself
          { id: "button-name", enabled: false },
        ],
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default combobox with single selection.
 */
export const Default: Story = {
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput placeholder="Select a fruit..." className="w-64" />
      <ComboboxContent>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Multi-select combobox with chips for displaying selected values.
 */
export const Multiple: Story = {
  render: function MultipleStory() {
    const [values, setValues] = useState<string[]>(["Apple"]);
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <Combobox
        items={fruitNames}
        multiple
        value={values}
        onValueChange={(newValues) => setValues(newValues as string[])}
      >
        <ComboboxChips ref={anchorRef} className="w-80">
          {values.map((value) => (
            <ComboboxChip key={value}>{value}</ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder="Select fruits..." />
        </ComboboxChips>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxEmpty>No fruits found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/**
 * Combobox with a clear button to reset the selection.
 */
export const ClearButton: Story = {
  render: (args) => (
    <Combobox {...args} items={fruitNames} defaultValue="Apple">
      <ComboboxInput
        placeholder="Select a fruit..."
        className="w-64"
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Combobox with grouped options and labels.
 */
export const Groups: Story = {
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput placeholder="Select food..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>Fruits</ComboboxLabel>
            {groupedItems.fruits.map((item) => (
              <ComboboxItem key={item.value} value={item.label}>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Vegetables</ComboboxLabel>
            {groupedItems.vegetables.map((item) => (
              <ComboboxItem key={item.value} value={item.label}>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Grains</ComboboxLabel>
            {groupedItems.grains.map((item) => (
              <ComboboxItem key={item.value} value={item.label}>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Combobox with custom item content including descriptions.
 */
export const CustomItems: Story = {
  render: (args) => (
    <Combobox
      {...args}
      items={countries}
      itemToStringValue={(item: unknown) =>
        (item as (typeof countries)[number]).value
      }
      itemToStringLabel={(item: unknown) =>
        (item as (typeof countries)[number]).label
      }
    >
      <ComboboxInput placeholder="Select a country..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          {(item: (typeof countries)[number]) => (
            <ComboboxItem key={item.value} value={item}>
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-muted-foreground text-xs">
                  {item.description}
                </span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Combobox in an invalid/error state.
 */
export const Invalid: Story = {
  render: (args) => (
    <Field data-invalid className="w-64">
      <FieldLabel>Favorite Fruit</FieldLabel>
      <Combobox {...args} items={fruitNames}>
        <ComboboxInput placeholder="Select a fruit..." aria-invalid />
        <ComboboxContent>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError>Please select a fruit.</FieldError>
    </Field>
  ),
};

/**
 * Disabled combobox state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput
        placeholder="Select a fruit..."
        className="w-64"
        disabled
      />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Combobox with auto-highlight enabled to automatically highlight the first matching option.
 */
export const AutoHighlight: Story = {
  args: {
    autoHighlight: true,
  },
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput placeholder="Type to search..." className="w-64" />
      <ComboboxContent>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Combobox triggered by a button with dropdown popup.
 */
export const Popup: Story = {
  render: function PopupStory() {
    const [value, setValue] = useState<string | null>(null);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <Combobox
        items={fruitNames}
        value={value}
        onValueChange={(newValue) => setValue(newValue as string | null)}
      >
        <ComboboxTrigger
          ref={anchorRef}
          render={<Button variant="outline" className="w-48 justify-between" />}
        >
          <ComboboxValue placeholder="Select a fruit..." />
        </ComboboxTrigger>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxInput placeholder="Search..." />
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/**
 * Combobox with InputGroup addon for a search icon.
 */
export const InputGroupStory: Story = {
  name: "Input Group",
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput placeholder="Search fruits..." className="w-64">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * When an item is clicked, should update the input value.
 */
export const ShouldSelectItem: Story = {
  name: "when item is clicked, should update input value",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "button-name", enabled: false },
          // Base UI focus guards have aria-hidden with tabindex causing violations
          { id: "aria-hidden-focus", enabled: false },
          // Base UI Combobox internals cause these violations
          { id: "aria-input-field-name", enabled: false },
          { id: "scrollable-region-focusable", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput placeholder="Select a fruit..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("open combobox and select an item", async () => {
      const input = canvas.getByPlaceholderText("Select a fruit...");
      await userEvent.click(input);

      await waitFor(() => {
        expect(
          canvasBody.getByRole("option", { name: "Banana" })
        ).toBeVisible();
      });

      await userEvent.click(canvasBody.getByRole("option", { name: "Banana" }));
    });

    await step("verify input shows selected value", async () => {
      const input = canvas.getByPlaceholderText("Select a fruit...");
      expect(input).toHaveValue("Banana");
    });
  },
};

/**
 * When typing in the input, should update input value and show matching options.
 */
export const ShouldFilterOptions: Story = {
  name: "when typing, should update input and show matching option",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "button-name", enabled: false },
          // Base UI focus guards have aria-hidden with tabindex causing violations
          { id: "aria-hidden-focus", enabled: false },
          // Base UI Combobox internals cause these violations
          { id: "aria-input-field-name", enabled: false },
          { id: "scrollable-region-focusable", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput placeholder="Search fruits..." className="w-64" />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("type in input and verify value updates", async () => {
      const input = canvas.getByPlaceholderText("Search fruits...");
      await userEvent.click(input);
      await userEvent.type(input, "Blu");

      expect(input).toHaveValue("Blu");
    });

    await step("verify matching option is visible", async () => {
      await waitFor(() => {
        expect(
          canvasBody.getByRole("option", { name: "Blueberry" })
        ).toBeVisible();
      });
    });
  },
};

/**
 * When no matches found, should show empty state message.
 */
export const ShouldShowEmptyState: Story = {
  name: "when no matches found, should show empty state",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "button-name", enabled: false },
          // Base UI focus guards have aria-hidden with tabindex causing violations
          { id: "aria-hidden-focus", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput placeholder="Search fruits..." className="w-64" />
      <ComboboxContent>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const canvasBody = within(canvasElement.ownerDocument.body);

    await step("type non-matching text", async () => {
      const input = canvas.getByPlaceholderText("Search fruits...");
      await userEvent.click(input);
      await userEvent.type(input, "xyz123");
    });

    await step("verify empty state message is shown", async () => {
      await waitFor(() => {
        expect(canvasBody.getByText("No results found.")).toBeVisible();
      });
    });
  },
};

/**
 * When clear button is clicked, should reset selection.
 */
export const ShouldClearSelection: Story = {
  name: "when clear button is clicked, should reset selection",
  tags: ["!dev", "!autodocs"],
  args: {
    defaultValue: "Apple",
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "button-name", enabled: false },
          // Base UI focus guards have aria-hidden with tabindex causing violations
          { id: "aria-hidden-focus", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Combobox {...args} items={fruitNames}>
      <ComboboxInput
        placeholder="Select a fruit..."
        className="w-64"
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify initial value is set", async () => {
      const input = canvas.getByPlaceholderText("Select a fruit...");
      expect(input).toHaveValue("Apple");
    });

    await step("click clear button and verify value is cleared", async () => {
      // Clear button is icon-only, find by data-slot attribute
      const clearButton = canvasElement.querySelector(
        '[data-slot="combobox-clear"]'
      ) as HTMLButtonElement;
      await userEvent.click(clearButton);

      const input = canvas.getByPlaceholderText("Select a fruit...");
      expect(input).toHaveValue("");
    });
  },
};
