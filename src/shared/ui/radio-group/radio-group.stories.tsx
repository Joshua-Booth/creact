import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, waitFor } from "storybook/test";

import { Field, FieldLabel } from "../field";
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

export const ShouldToggleRadio: Story = {
  name: "when clicking on a radio button, it should toggle its state",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const radios = await canvas.findAllByRole("radio");
    expect(radios).toHaveLength(3);

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
