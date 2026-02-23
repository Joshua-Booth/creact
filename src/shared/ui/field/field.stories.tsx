import { useState } from "react";

import preview from "@/storybook/preview";
import { expect, userEvent } from "storybook/test";

import { Button } from "../button";
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
  FieldProvider,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";

/**
 * Provides accessible form field layouts with labels, descriptions, and error states.
 */
const meta = preview.meta({
  title: "ui/Field",
  component: Field,
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
    docs: {
      description: {
        component:
          "Provides accessible form field layouts with labels, descriptions, and error states.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/field) · [Base UI docs](https://base-ui.com/react/components/field)",
      },
    },
  },
});

// --- Stories ---

/**
 * Basic text input fields with labels and descriptions.
 */
export const Default = meta.story({
  render: (args) => (
    <FieldSet className="w-xs">
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" type="text" placeholder="john_doe" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>
        <Field {...args}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input id="password" type="password" placeholder="••••••••" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
});

/**
 * A feedback form using a textarea with label and description.
 */
export const TextareaStory = meta.story({
  name: "Textarea",
  render: (args) => (
    <FieldSet className="w-xs">
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
          <Textarea
            id="feedback"
            placeholder="Your feedback helps us improve..."
            rows={4}
          />
          <FieldDescription>
            Share your thoughts about our service.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
});

/**
 * A dropdown field for selecting from a list of options.
 */
export const SelectStory = meta.story({
  name: "Select",
  render: (args) => (
    <Field {...args} className="w-xs">
      <FieldLabel>Department</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="support">Customer Support</SelectItem>
          <SelectItem value="hr">Human Resources</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="operations">Operations</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>
        Select your department or area of work.
      </FieldDescription>
    </Field>
  ),
});

/**
 * A price range slider with dynamic value display.
 */
export const SliderStory = meta.story({
  name: "Slider",
  render: (args) => {
    const [value, setValue] = useState([200, 800]);

    return (
      <Field {...args} className="w-xs">
        <FieldLabel>Price Range</FieldLabel>
        <FieldDescription>
          Set your budget range ($
          <span className="font-medium tabular-nums">{value[0]}</span> –{" "}
          <span className="font-medium tabular-nums">{value[1]}</span>).
        </FieldDescription>
        <Slider
          value={value}
          onValueChange={(val: number | readonly number[]) =>
            setValue(typeof val === "number" ? [val] : [...val])
          }
          max={1000}
          min={0}
          step={10}
          className="mt-2 w-full"
        />
      </Field>
    );
  },
});

/**
 * Address fields grouped with a legend, description, and two-column layout.
 */
export const Fieldset = meta.story({
  render: (args) => (
    <FieldSet className="w-sm">
      <FieldLegend>Address Information</FieldLegend>
      <FieldLegendDescription>
        We need your address to deliver your order.
      </FieldLegendDescription>
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="street">Street Address</FieldLabel>
          <Input id="street" type="text" placeholder="123 Main St" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field {...args}>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" type="text" placeholder="New York" />
          </Field>
          <Field {...args}>
            <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
            <Input id="zip" type="text" placeholder="90502" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  ),
});

/**
 * Multiple checkboxes in a group with a separator and a checkbox with description.
 */
export const CheckboxStory = meta.story({
  name: "Checkbox",
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <FieldGroup className="w-xs">
      <FieldSet>
        <FieldLegend variant="label">
          Show these items on the desktop
        </FieldLegend>
        <FieldLegendDescription>
          Select the items you want to show on the desktop.
        </FieldLegendDescription>
        <FieldGroup className="gap-3">
          <Field {...args} orientation="horizontal">
            <Checkbox id="hard-disks" />
            <FieldLabel htmlFor="hard-disks" className="font-normal">
              Hard disks
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="external-disks" />
            <FieldLabel htmlFor="external-disks" className="font-normal">
              External disks
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="cds-dvds" />
            <FieldLabel htmlFor="cds-dvds" className="font-normal">
              CDs, DVDs, and iPods
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="connected-servers" />
            <FieldLabel htmlFor="connected-servers" className="font-normal">
              Connected servers
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <Field {...args} orientation="horizontal">
        <Checkbox id="sync-folders" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="sync-folders">
            Sync Desktop & Documents folders
          </FieldLabel>
          <FieldDescription>
            Your Desktop & Documents folders are being synced with iCloud Drive.
            You can access them from other devices.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
});

/**
 * Radio buttons for selecting one option from a group.
 */
export const Radio = meta.story({
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <FieldSet className="w-xs">
      <FieldLegend variant="label">Subscription Plan</FieldLegend>
      <FieldLegendDescription>
        Yearly and lifetime plans offer significant savings.
      </FieldLegendDescription>
      <RadioGroup defaultValue="monthly">
        <Field {...args} orientation="horizontal">
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
            Lifetime ($299.99)
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  ),
});

/**
 * A toggle switch for enabling or disabling a setting.
 */
export const SwitchStory = meta.story({
  name: "Switch",
  render: (args) => (
    <Field {...args} orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
      <Switch id="2fa" />
    </Field>
  ),
});

/**
 * Wraps `Field` components inside `FieldLabel` to create selectable card-style
 * radio options.
 */
export const ChoiceCard = meta.story({
  name: "Choice Card",
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <FieldGroup className="w-xs">
      <FieldSet>
        <FieldLegend variant="label">Compute Environment</FieldLegend>
        <FieldLegendDescription>
          Select the compute environment for your cluster.
        </FieldLegendDescription>
        <RadioGroup defaultValue="kubernetes">
          <FieldProvider>
            <FieldLabel htmlFor="kubernetes-cc">
              <Field {...args} orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>
                    Run GPU workloads on a K8s cluster.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="kubernetes" id="kubernetes-cc" />
              </Field>
            </FieldLabel>
          </FieldProvider>
          <FieldProvider>
            <FieldLabel htmlFor="vm-cc">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual Machine</FieldTitle>
                  <FieldDescription>
                    Access a cluster to run GPU workloads.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="vm" id="vm-cc" />
              </Field>
            </FieldLabel>
          </FieldProvider>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  ),
});

/**
 * Grouped fields with a separator dividing notification preference sections.
 */
export const FieldGroupStory = meta.story({
  name: "Field Group",
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <FieldGroup className="w-xs">
      <FieldSet>
        <FieldLegend variant="label">Responses</FieldLegend>
        <FieldLegendDescription>
          Get notified when ChatGPT responds to requests that take time, like
          research or image generation.
        </FieldLegendDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field {...args} orientation="horizontal">
            <Checkbox id="push" defaultChecked disabled />
            <FieldLabel htmlFor="push" className="font-normal">
              Push notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLegend variant="label">Tasks</FieldLegend>
        <FieldLegendDescription>
          Get notified when tasks you&apos;ve created have updates.{" "}
          <a href="/tasks">Manage tasks</a>
        </FieldLegendDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal">
            <Checkbox id="push-tasks" />
            <FieldLabel htmlFor="push-tasks" className="font-normal">
              Push notifications
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="email-tasks" />
            <FieldLabel htmlFor="email-tasks" className="font-normal">
              Email notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  ),
});

/**
 * Fields that adapt orientation based on container width.
 */
export const ResponsiveLayout = meta.story({
  name: "Responsive Layout",
  render: (args) => (
    <div className="w-lg">
      <form>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldLegendDescription>
            Fill in your profile information.
          </FieldLegendDescription>
          <FieldGroup>
            <Field {...args} orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>
                  Provide your full name for identification.
                </FieldDescription>
              </FieldContent>
              <Input id="name" placeholder="Evil Rabbit" />
            </Field>
            <Field {...args} orientation="responsive">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  ),
});

/**
 * Field error states with single and multiple error messages.
 */
export const ErrorState = meta.story({
  name: "Error",
  render: (args) => (
    <FieldGroup className="w-80">
      <Field {...args}>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          aria-invalid="true"
          placeholder="you@example.com"
          defaultValue="invalid-email"
        />
        <FieldError>Please enter a valid email address.</FieldError>
      </Field>
      <Field {...args}>
        <FieldLabel>Password</FieldLabel>
        <Input
          type="password"
          aria-invalid="true"
          placeholder="Enter password"
        />
        <FieldError
          errors={[
            { message: "Password must be at least 8 characters" },
            { message: "Password must contain a number" },
            { message: "Password must contain a special character" },
          ]}
        />
      </Field>
    </FieldGroup>
  ),
});

/**
 * Disabled field state.
 */
export const Disabled = meta.story({
  render: (args) => (
    <Field {...args} className="w-80" disabled>
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="Enter email" disabled />
      <FieldDescription>This field is disabled.</FieldDescription>
    </Field>
  ),
});

// --- Tests ---

Default.test(
  "when field has error, should show aria-invalid and error message",
  {
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
  },
  async ({ canvas, step }) => {
    await step("verify error message is visible", async () => {
      await expect(
        canvas.getByText("Please enter a valid email address.")
      ).toBeVisible();
    });

    await step("verify input has aria-invalid attribute", async () => {
      const input = canvas.getByPlaceholderText("Enter email");
      await expect(input).toHaveAttribute("aria-invalid", "true");
    });
  }
);

Default.test(
  "when clicking label, should focus associated input",
  {
    render: (args) => (
      <Field {...args} className="w-80">
        <FieldLabel htmlFor="label-test-input">Username</FieldLabel>
        <Input id="label-test-input" placeholder="Enter username" />
      </Field>
    ),
  },
  async ({ canvas, step }) => {
    await step("click label and verify input receives focus", async () => {
      const label = canvas.getByText("Username");
      const input = canvas.getByPlaceholderText("Enter username");

      await userEvent.click(label);

      await expect(input).toHaveFocus();
    });
  }
);
