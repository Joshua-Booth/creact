import preview from "@/storybook/preview";
import { SearchIcon } from "lucide-react";
import { expect, userEvent } from "storybook/test";

import { Badge } from "../badge";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Input } from "./input";

/**
 * Displays a form input field or a component that looks like an input field.
 */
const meta = preview.meta({
  title: "ui/Input",
  component: Input,
  argTypes: {},
  args: {
    className: "w-96",
    type: "email",
    placeholder: "Email",
    disabled: false,
  },
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the input field.
 */
export const Default = meta.story();

/**
 * Use the `Field` component with `FieldLabel` and `FieldDescription` for
 * accessible form fields with proper labeling and helper text.
 */
export const WithField = meta.story({
  render: (args) => (
    <Field className={args.className}>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input {...args} id="username" type="text" placeholder="shadcn" />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  ),
});

/**
 * Use `FieldSet` and `FieldGroup` to group multiple related fields together
 * in a form layout.
 */
export const WithFieldGroup = meta.story({
  render: (args) => (
    <FieldSet className={args.className}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fg-username">Username</FieldLabel>
          <Input {...args} id="fg-username" type="text" placeholder="shadcn" />
          <FieldDescription>Choose a unique username.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="fg-password">Password</FieldLabel>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input
            {...args}
            id="fg-password"
            type="password"
            placeholder="••••••••"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
});

/**
 * Use the `disabled` prop to make the input non-interactive and appears faded,
 * indicating that input is not currently accepted.
 */
export const Disabled = meta.story({
  args: { disabled: true },
  render: (args) => (
    <Field data-disabled className={args.className}>
      <FieldLabel htmlFor="input-demo-disabled">Email</FieldLabel>
      <Input
        id="input-demo-disabled"
        type="email"
        placeholder="Email"
        disabled
        {...args}
      />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  ),
});

/**
 * Use `aria-invalid` to indicate that the input value is invalid.
 * Combine with `FieldError` to display an error message.
 */
export const Invalid = meta.story({
  render: (args) => (
    <Field className={args.className} data-invalid>
      <FieldLabel htmlFor="email-invalid" aria-invalid="true">
        Email
      </FieldLabel>
      <Input {...args} id="email-invalid" aria-invalid="true" />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  ),
});

/**
 * Use `type="file"` to create a file input that allows users to select files
 * from their device.
 */
export const File = meta.story({
  render: (args) => (
    <Field>
      <FieldLabel htmlFor="picture">Picture</FieldLabel>
      <Input {...args} id="file" type="file" />
      <FieldDescription>Select a picture to upload.</FieldDescription>
    </Field>
  ),
});

/**
 * Use `Field` with `orientation="horizontal"` for inline form layouts
 * where the label appears beside the input.
 */
export const Inline = meta.story({
  render: (args) => (
    <Field orientation="horizontal" className="w-[500px]">
      <FieldLabel>Email</FieldLabel>
      <div className="flex flex-1 gap-2">
        <Input {...args} className="flex-1" />
        <Button type="submit">Subscribe</Button>
      </div>
    </Field>
  ),
});

/**
 * Use `FieldGroup` to arrange multiple fields in a responsive grid layout.
 */
export const Grid = meta.story({
  render: (args) => (
    <FieldGroup className={args.className}>
      <Field>
        <FieldLabel htmlFor="first-name">First Name</FieldLabel>
        <Input {...args} id="first-name" placeholder="Enter your first name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
        <Input {...args} id="last-name" placeholder="Enter your last name" />
      </Field>
    </FieldGroup>
  ),
});

/**
 * Use the `required` prop and visual indicators to mark required fields.
 */
export const Required = meta.story({
  render: (args) => (
    <Field className={args.className}>
      <FieldLabel htmlFor="required-field">
        Required Field <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        {...args}
        id="required-field"
        required
        placeholder="This field must be filled out"
      />
      <FieldDescription>This field must be filled out.</FieldDescription>
    </Field>
  ),
});

/**
 * Use the `Badge` component inside `FieldLabel` to highlight special status.
 */
export const WithBadge = meta.story({
  render: (args) => (
    <Field className={args.className}>
      <FieldLabel htmlFor="webhook-url">
        Webhook URL{" "}
        <Badge variant="secondary" className="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input
        {...args}
        id="webhook-url"
        placeholder="https://example.com/webhook"
      />
    </Field>
  ),
});

/**
 * Use the `Button` component to indicate that the input field can be submitted
 * or used to trigger an action.
 */
export const WithButton = meta.story({
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Input {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
});

/**
 * Use `InputGroup` for inputs with icons or addons. See the InputGroup
 * component for more examples including password toggles, clear buttons, and more.
 */
export const WithInputGroup = meta.story({
  render: (args) => (
    <InputGroup className={args.className}>
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput type="search" placeholder="Search..." />
    </InputGroup>
  ),
});

/**
 * Use `ButtonGroup` to combine an input with action buttons in a cohesive group.
 */
export const WithButtonGroup = meta.story({
  render: (args) => (
    <Field className={args.className}>
      <FieldLabel htmlFor="search-input">Search</FieldLabel>
      <ButtonGroup>
        <Input
          {...args}
          id="search-input"
          type="search"
          placeholder="Search..."
        />
        <Button variant="outline">Search</Button>
      </ButtonGroup>
    </Field>
  ),
});

/**
 * Combine multiple field types to build complete forms with inputs, selects,
 * and action buttons.
 */
export const Form = meta.story({
  render: (args) => (
    <form className="w-96">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Name</FieldLabel>
          <Input {...args} id="form-name" type="text" placeholder="Your name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-email">Email</FieldLabel>
          <Input
            {...args}
            id="form-email"
            type="email"
            placeholder="your@email.com"
          />
          <FieldDescription>
            We'll never share your email with anyone.
          </FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
            <Input
              {...args}
              id="form-phone"
              type="tel"
              placeholder="(555) 000-0000"
            />
          </Field>
          <Field>
            <FieldLabel>Country</FieldLabel>
            <Select defaultValue="us">
              <SelectTrigger className={args.className}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="form-address">Address</FieldLabel>
          <Input
            {...args}
            id="form-address"
            type="text"
            placeholder="Enter your address"
          />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  ),
});

// --- Tests ---

Default.test(
  "when user enters text, should see it in the input field",
  async ({ canvas, step }) => {
    const input = await canvas.findByPlaceholderText(/email/i);
    const mockedInput = "mocked@shadcn.com";

    await step("focus and type into the input field", async () => {
      await userEvent.click(input);
      await userEvent.type(input, mockedInput);
    });

    await expect(input).toHaveValue(mockedInput);
  }
);
