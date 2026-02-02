import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldLegendDescription,
  FieldSeparator,
  FieldSet,
} from "../field";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Textarea } from "../textarea";
import { Label } from "./label";

/**
 * Renders an accessible label associated with controls.
 */
const meta = {
  title: "ui/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "text" },
    },
  },
  args: {
    children: "Your email address",
    htmlFor: "email",
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof Label>;

/**
 * The default form of the label.
 */
export const Default: Story = {};

/**
 * Label associated with an input field via htmlFor.
 */
export const WithInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label {...args} htmlFor="email-input">
        Email address
      </Label>
      <Input id="email-input" type="email" placeholder="Enter your email" />
    </div>
  ),
};

/**
 * Label associated with a checkbox control.
 */
export const WithCheckbox: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" aria-labelledby="terms-label" />
      <Label {...args} id="terms-label">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

/**
 * Label with a required field indicator (red asterisk).
 */
export const Required: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label {...args} htmlFor="required-input">
        Username
        <span className="text-destructive">*</span>
      </Label>
      <Input id="required-input" placeholder="Enter username" required />
    </div>
  ),
};

/**
 * Label with an optional indicator suffix.
 */
export const Optional: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label {...args} htmlFor="optional-input">
        Bio
        <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>
      <Input id="optional-input" placeholder="Tell us about yourself" />
    </div>
  ),
};

/**
 * Label in a disabled state via group data attribute.
 */
export const Disabled: Story = {
  render: (args) => (
    <div className="group flex flex-col gap-2" data-disabled="true">
      <Label {...args} htmlFor="disabled-input">
        Disabled field
      </Label>
      <Input id="disabled-input" placeholder="Cannot edit" disabled />
    </div>
  ),
};

/**
 * Label with long text showing truncation behavior.
 */
export const LongText: Story = {
  render: (args) => (
    <div className="flex w-48 flex-col gap-2">
      <Label {...args} htmlFor="long-input" className="block truncate">
        This is a very long label that should truncate when it exceeds the
        container width
      </Label>
      <Input id="long-input" placeholder="Enter value" />
    </div>
  ),
};

/**
 * A comprehensive payment form demonstrating labels in real-world context.
 */
export const PaymentForm: Story = {
  render: (args) => (
    <div className="w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldLegendDescription>
              All transactions are secure and encrypted
            </FieldLegendDescription>
            <FieldGroup>
              <Field>
                <FieldLabel {...args}>Name on Card</FieldLabel>
                <Input placeholder="Evil Rabbit" required />
              </Field>
              <Field>
                <FieldLabel>Card Number</FieldLabel>
                <Input placeholder="1234 5678 9012 3456" required />
                <FieldDescription>
                  Enter your 16-digit card number
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Month</FieldLabel>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">01</SelectItem>
                      <SelectItem value="02">02</SelectItem>
                      <SelectItem value="03">03</SelectItem>
                      <SelectItem value="04">04</SelectItem>
                      <SelectItem value="05">05</SelectItem>
                      <SelectItem value="06">06</SelectItem>
                      <SelectItem value="07">07</SelectItem>
                      <SelectItem value="08">08</SelectItem>
                      <SelectItem value="09">09</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="11">11</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Year</FieldLabel>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2029">2029</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>CVV</FieldLabel>
                  <Input placeholder="123" required />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address</FieldLegend>
            <FieldLegendDescription>
              The billing address associated with your payment method
            </FieldLegendDescription>
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="same-as-shipping" defaultChecked />
                <FieldLabel htmlFor="same-as-shipping" className="font-normal">
                  Same as shipping address
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Comments</FieldLabel>
                <Textarea
                  placeholder="Add any additional comments"
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  ),
};

/**
 * When clicking label, should focus associated input.
 */
export const ShouldFocusInputOnClick: Story = {
  name: "when clicking label, should focus associated input",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="focus-test-input">Click me to focus input</Label>
      <Input id="focus-test-input" placeholder="I should receive focus" />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("click label and verify input receives focus", async () => {
      const label = canvas.getByText("Click me to focus input");
      const input = canvas.getByPlaceholderText("I should receive focus");

      await userEvent.click(label);

      await expect(input).toHaveFocus();
    });
  },
};
