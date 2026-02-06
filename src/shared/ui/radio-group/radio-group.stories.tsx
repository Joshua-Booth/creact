/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, waitFor } from "storybook/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldLegendDescription,
  FieldSet,
  FieldTitle,
} from "../field";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../item";
import { RadioGroup, RadioGroupItem } from "./radio-group";

/**
 * A set of checkable buttons—known as radio buttons—where no more than one of
 * the buttons can be checked at a time.
 */
const meta = {
  title: "ui/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultValue: "comfortable",
    className: "flex flex-col gap-2",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Field>
        <FieldLabel className="flex items-center gap-2">
          <RadioGroupItem value="default" />
          Default
        </FieldLabel>
      </Field>
      <Field>
        <FieldLabel className="flex items-center gap-2">
          <RadioGroupItem value="comfortable" />
          Comfortable
        </FieldLabel>
      </Field>
      <Field>
        <FieldLabel className="flex items-center gap-2">
          <RadioGroupItem value="compact" />
          Compact
        </FieldLabel>
      </Field>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the radio group.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the radio group.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Radio group with fieldset, legend, and description for grouped selections.
 */
export const Fieldset: Story = {
  render: (args) => (
    <div className="w-md">
      <FieldSet>
        <FieldLegend variant="label">Subscription Plan</FieldLegend>
        <FieldLegendDescription>
          Yearly and lifetime plans offer significant savings.
        </FieldLegendDescription>
        <RadioGroup {...args} defaultValue="monthly">
          <Field orientation="horizontal">
            <RadioGroupItem value="monthly" id="plan-monthly" />
            <FieldLabel htmlFor="plan-monthly" className="font-normal">
              Monthly ($9.99/month)
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="yearly" id="plan-yearly" />
            <FieldLabel htmlFor="plan-yearly" className="font-normal">
              Yearly ($99.99/year)
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="lifetime" id="plan-lifetime" />
            <FieldLabel htmlFor="plan-lifetime" className="font-normal">
              Lifetime ($249.99)
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
};

/**
 * Radio items with description text for additional context.
 */
export const Description: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI RadioGroup renders both hidden native radios and visible indicators
          // This causes duplicate form label association and toggle field name warnings
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <RadioGroup {...args} className="w-96 gap-4">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" />
        <FieldContent>
          <FieldTitle>Default</FieldTitle>
          <FieldDescription>
            Standard spacing for most use cases.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" />
        <FieldContent>
          <FieldTitle>Comfortable</FieldTitle>
          <FieldDescription>
            Extra breathing room for a relaxed layout.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" />
        <FieldContent>
          <FieldTitle>Compact</FieldTitle>
          <FieldDescription>
            Reduced spacing for dense interfaces.
          </FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  ),
};

/**
 * Card-style radio selections with rich content and descriptions.
 */
export const ChoiceCard: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI RadioGroup renders both hidden native radios and visible indicators
          // This causes duplicate form label association and toggle field name warnings
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <div className="w-md">
      <FieldSet>
        <FieldLegend variant="label">Plan</FieldLegend>
        <FieldLegendDescription>
          Select your subscription plan.
        </FieldLegendDescription>
        <RadioGroup {...args} defaultValue="enterprise">
          <Item
            variant="outline"
            render={<label htmlFor="plus" aria-label="Plus" />}
            className="has-data-checked:border-primary/50
              dark:has-data-checked:bg-primary/10 cursor-pointer"
          >
            <ItemContent>
              <ItemTitle>Plus</ItemTitle>
              <ItemDescription>
                For individuals and small teams.
              </ItemDescription>
            </ItemContent>
            <RadioGroupItem value="plus" id="plus" />
          </Item>
          <Item
            variant="outline"
            render={<label htmlFor="pro" aria-label="Pro" />}
            className="has-data-checked:border-primary/50
              dark:has-data-checked:bg-primary/10 cursor-pointer"
          >
            <ItemContent>
              <ItemTitle>Pro</ItemTitle>
              <ItemDescription>For growing businesses.</ItemDescription>
            </ItemContent>
            <RadioGroupItem value="pro" id="pro" />
          </Item>
          <Item
            variant="outline"
            render={<label htmlFor="enterprise" aria-label="Enterprise" />}
            className="has-data-checked:border-primary/50
              dark:has-data-checked:bg-primary/10 cursor-pointer"
          >
            <ItemContent>
              <ItemTitle>Enterprise</ItemTitle>
              <ItemDescription>
                For large teams and enterprises.
              </ItemDescription>
            </ItemContent>
            <RadioGroupItem value="enterprise" id="enterprise" />
          </Item>
        </RadioGroup>
      </FieldSet>
    </div>
  ),
};

/**
 * Radio group with validation error state.
 */
export const Invalid: Story = {
  render: (args) => (
    <RadioGroup {...args} aria-invalid="true" defaultValue="">
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="option1" aria-invalid="true" />
        <FieldLabel className="font-normal">Option 1</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="option2" aria-invalid="true" />
        <FieldLabel className="font-normal">Option 2</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="option3" aria-invalid="true" />
        <FieldLabel className="font-normal">Option 3</FieldLabel>
      </Field>
    </RadioGroup>
  ),
};

export const ShouldToggleRadio: Story = {
  name: "when clicking on a radio button, it should toggle its state",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const radios = await canvas.findAllByRole("radio");
    await expect(radios).toHaveLength(3);

    await step("click the default radio button", async () => {
      await userEvent.click(radios[0]!);
      await waitFor(() => expect(radios[0]).toBeChecked());
      await waitFor(() => expect(radios[1]).not.toBeChecked());
    });

    await step("click the comfortable radio button", async () => {
      await userEvent.click(radios[1]!);
      await waitFor(() => expect(radios[1]).toBeChecked());
      await waitFor(() => expect(radios[0]).not.toBeChecked());
    });
  },
};
