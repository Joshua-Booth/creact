import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { expect, userEvent, within } from "storybook/test";

import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Slider } from "../slider";
import { Switch } from "../switch";
import { Textarea } from "../textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldLegendDescription,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";

/**
 * Provides accessible form field layouts with labels, descriptions, and error states.
 */
const meta = {
  title: "ui/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
      description: "The layout orientation of the field",
    },
  },
  args: {
    orientation: "vertical",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A simple field with label, input, and description.
 */
export const Default: Story = {
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>Enter your email address.</FieldDescription>
    </Field>
  ),
};

/**
 * Field in an error state with error message.
 */
export const ErrorState: Story = {
  name: "Error",
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel>Email</FieldLabel>
      <Input
        type="email"
        aria-invalid="true"
        placeholder="you@example.com"
        defaultValue="invalid-email"
      />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  ),
};

/**
 * Field with a textarea for longer text input.
 */
export const WithTextarea: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <Field {...args} orientation="vertical">
      <FieldLabel className="w-32">Bio</FieldLabel>
      <FieldContent>
        <Textarea placeholder="Tell us about yourself" rows={3} />
        <FieldDescription>
          Brief description for your profile. Max 200 characters.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
};

/**
 * Field with a checkbox control.
 */
export const WithCheckbox: Story = {
  args: {
    orientation: "horizontal",
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI Checkbox renders both a hidden native checkbox and a visible indicator
          // This causes duplicate form label association warnings
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Field {...args}>
      <Checkbox id="terms" />
      <FieldContent>
        <FieldTitle>Accept terms and conditions</FieldTitle>
        <FieldDescription>
          You agree to our Terms of Service and Privacy Policy.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
};

/**
 * FieldSet with FieldLegend for grouping related fields.
 */
export const Fieldset: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Personal Information</FieldLegend>
      <FieldLegendDescription>
        Enter your personal details below.
      </FieldLegendDescription>
      <FieldGroup>
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input placeholder="John" />
        </Field>
        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input placeholder="Doe" />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" placeholder="john@example.com" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * FieldGroup with separator between field sections.
 */
export const WithSeparator: Story = {
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="Enter email" />
      </Field>
      <FieldSeparator>or</FieldSeparator>
      <Field>
        <FieldLabel>Phone</FieldLabel>
        <Input type="tel" placeholder="Enter phone number" />
      </Field>
    </FieldGroup>
  ),
};

/**
 * FieldSet with radio group.
 */
export const WithRadioGroup: Story = {
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
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend variant="label">Notification Preferences</FieldLegend>
      <RadioGroup defaultValue="email">
        <Field orientation="horizontal">
          <RadioGroupItem value="email" id="email-radio" />
          <FieldContent>
            <FieldTitle>Email notifications</FieldTitle>
            <FieldDescription>
              Receive notifications via email.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="sms" id="sms-radio" />
          <FieldContent>
            <FieldTitle>SMS notifications</FieldTitle>
            <FieldDescription>
              Receive notifications via text message.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="none" id="none-radio" />
          <FieldContent>
            <FieldTitle>No notifications</FieldTitle>
            <FieldDescription>
              Don&apos;t receive any notifications.
            </FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
    </FieldSet>
  ),
};

/**
 * Field with a select dropdown.
 */
export const WithSelect: Story = {
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel>Role</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Select your account role.</FieldDescription>
    </Field>
  ),
};

/**
 * Field with a slider and dynamic value display.
 */
export const WithSlider: Story = {
  render: function SliderStory(args) {
    const [value, setValue] = useState([50]);

    return (
      <Field {...args} className="w-80">
        <div className="flex items-center justify-between">
          <FieldLabel>Volume</FieldLabel>
          <span className="text-muted-foreground text-sm">{value[0]}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={(val: number | readonly number[]) =>
            setValue(typeof val === "number" ? [val] : Array.from(val))
          }
          max={100}
          step={1}
        />
        <FieldDescription>Adjust the volume level.</FieldDescription>
      </Field>
    );
  },
};

/**
 * Field with a switch toggle.
 */
export const WithSwitch: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <Field {...args} className="w-80 justify-between">
      <FieldContent>
        <FieldTitle id="marketing-label">Marketing emails</FieldTitle>
        <FieldDescription>
          Receive emails about new products and features.
        </FieldDescription>
      </FieldContent>
      <Switch aria-labelledby="marketing-label" />
    </Field>
  ),
};

/**
 * FieldError with multiple errors from an array.
 */
export const MultipleErrors: Story = {
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel>Password</FieldLabel>
      <Input type="password" aria-invalid="true" placeholder="Enter password" />
      <FieldError
        errors={[
          { message: "Password must be at least 8 characters" },
          { message: "Password must contain a number" },
          { message: "Password must contain a special character" },
        ]}
      />
    </Field>
  ),
};

/**
 * Responsive field that switches layout based on container width.
 */
export const ResponsiveLayout: Story = {
  args: {
    orientation: "responsive",
  },
  render: (args) => (
    <FieldGroup className="w-[600px]">
      <Field {...args}>
        <FieldLabel className="w-32">Email</FieldLabel>
        <FieldContent>
          <Input type="email" placeholder="Enter email" />
          <FieldDescription>Your primary contact email.</FieldDescription>
        </FieldContent>
      </Field>
      <Field {...args}>
        <FieldLabel className="w-32">Phone</FieldLabel>
        <FieldContent>
          <Input type="tel" placeholder="Enter phone" />
          <FieldDescription>Optional contact number.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
};

/**
 * Disabled field state.
 */
export const Disabled: Story = {
  render: (args) => (
    <Field {...args} className="w-80" disabled>
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="Enter email" disabled />
      <FieldDescription>This field is disabled.</FieldDescription>
    </Field>
  ),
};

/**
 * When field has error, should show aria-invalid and error message.
 */
export const ShouldShowErrorState: Story = {
  name: "when field has error, should show aria-invalid and error message",
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel htmlFor="error-input">Email</FieldLabel>
      <Input
        id="error-input"
        type="email"
        aria-invalid="true"
        placeholder="Enter email"
      />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify error message is visible", async () => {
      await expect(
        canvas.getByText("Please enter a valid email address.")
      ).toBeVisible();
    });

    await step("verify input has aria-invalid attribute", async () => {
      const input = canvas.getByPlaceholderText("Enter email");
      await expect(input).toHaveAttribute("aria-invalid", "true");
    });
  },
};

/**
 * When clicking label, should focus associated input.
 */
export const ShouldAssociateLabelWithInput: Story = {
  name: "when clicking label, should focus associated input",
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldLabel htmlFor="label-test-input">Username</FieldLabel>
      <Input id="label-test-input" placeholder="Enter username" />
    </Field>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("click label and verify input receives focus", async () => {
      const label = canvas.getByText("Username");
      const input = canvas.getByPlaceholderText("Enter username");

      await userEvent.click(label);

      await expect(input).toHaveFocus();
    });
  },
};
