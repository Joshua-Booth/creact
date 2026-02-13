import preview from "@/storybook/preview";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Textarea } from "./textarea";

/**
 * Displays a form textarea or a component that looks like a textarea.
 */
const meta = preview.meta({
  title: "ui/Textarea",
  component: Textarea,
  argTypes: {},
  args: {
    placeholder: "Type your message here.",
    disabled: false,
    className: "w-96",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a form textarea or a component that looks like a textarea.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/textarea)",
      },
    },
  },
});

// --- Stories ---

/**
 * The default form of the textarea.
 */
export const Default = meta.story();

/**
 * Use the `disabled` prop to disable the textarea.
 */
export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

/**
 * Use the `Field` component to add a label and description to the textarea.
 */
export const WithField = meta.story({
  render: (args) => (
    <Field className={args.className}>
      <FieldLabel>Your message</FieldLabel>
      <Textarea {...args} />
      <FieldDescription>
        Your message will be copied to the support team.
      </FieldDescription>
    </Field>
  ),
});

/**
 * Use the `data-invalid` attribute and `FieldError` component to display
 * validation errors.
 */
export const Invalid = meta.story({
  render: (args) => (
    <Field data-invalid className={args.className}>
      <FieldLabel>Your message</FieldLabel>
      <Textarea {...args} aria-invalid />
      <FieldError>Please enter a message.</FieldError>
    </Field>
  ),
});

/**
 * Use the `Button` component to indicate that the textarea can be submitted
 * or used to trigger an action.
 */
export const WithButton = meta.story({
  render: (args) => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button type="submit">Send Message</Button>
    </div>
  ),
});

// --- Tests ---

Default.test(
  "when user types into textarea, should display the text",
  async ({ canvas, step }) => {
    const textarea = await canvas.findByRole("textbox");
    const message = "Hello, this is a test message.";

    await step("focus and type into the textarea", async () => {
      await userEvent.click(textarea);
      await userEvent.type(textarea, message);
    });

    await expect(textarea).toHaveValue(message);
  }
);
