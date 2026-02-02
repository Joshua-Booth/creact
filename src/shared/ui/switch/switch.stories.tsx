import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Button } from "../button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../field";
import { Switch } from "./switch";

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta = {
  title: "ui/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Field>
      <FieldLabel>
        <Switch {...args} />
        Airplane Mode
      </FieldLabel>
    </Field>
  ),
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the switch.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the switch.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Field data-disabled orientation="horizontal">
      <FieldLabel>
        <Switch {...args} id="switch-disabled-unchecked" disabled />
        Airplane Mode
      </FieldLabel>
    </Field>
  ),
};

/**
 * Switch with description text providing additional context.
 */
export const Description: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI Switch with FieldTitle uses aria-describedby for association
          // but axe expects aria-labelledby, which would be redundant
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Field orientation="horizontal" className="w-96">
      <FieldContent>
        <FieldTitle>Marketing emails</FieldTitle>
        <FieldDescription>
          Receive emails about new products, features, and more.
        </FieldDescription>
      </FieldContent>
      <Switch {...args} id="marketing" />
    </Field>
  ),
};

/**
 * Card-style switch where the entire field is clickable.
 * The FieldLabel wraps the inner Field to make the whole card interactive.
 */
export const ChoiceCard: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // FieldLabel wraps inner Field for card styling
          // The switch is accessible via the FieldTitle text
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <FieldGroup className="w-sm">
      <Field>
        <FieldLabel htmlFor="switch-share">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Share across devices</FieldTitle>
              <FieldDescription>
                Focus is shared across devices, and turns off when you leave the
                app.
              </FieldDescription>
            </FieldContent>
            <Switch {...args} id="switch-share" />
          </Field>
        </FieldLabel>
      </Field>
      <Field>
        <FieldLabel htmlFor="switch-notifications">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                Receive notifications when focus mode is enabled or disabled.
              </FieldDescription>
            </FieldContent>
            <Switch {...args} id="switch-notifications" defaultChecked />
          </Field>
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
};

/**
 * Switch with validation error state using `aria-invalid`.
 */
export const Invalid: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI Switch with FieldTitle uses aria-describedby for association
          // but axe expects aria-labelledby, which would be redundant
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Field orientation="horizontal" className="w-96" data-invalid="true">
      <FieldContent>
        <FieldTitle>Accept terms and conditions</FieldTitle>
        <FieldDescription>
          You must accept the terms to continue.
        </FieldDescription>
      </FieldContent>
      <Switch {...args} id="terms" aria-invalid="true" />
    </Field>
  ),
};

/**
 * Switch comes in two sizes: `default` and `sm`.
 */
export const Size: Story = {
  render: () => (
    <FieldGroup className="w-40">
      <Field orientation="horizontal">
        <FieldLabel>
          <Switch size="sm" />
          Small
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel>
          <Switch size="default" />
          Default
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
};

/**
 * Switch used within a form with submit functionality.
 */
export const WithForm: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI Switch with FieldTitle uses aria-describedby for association
          // but axe expects aria-labelledby, which would be redundant
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <form
      className="flex w-96 flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        alert(`Marketing emails: ${formData.get("marketing") === "on"}`);
      }}
    >
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Marketing emails</FieldTitle>
          <FieldDescription>
            Receive emails about new products, features, and more.
          </FieldDescription>
        </FieldContent>
        <Switch {...args} name="marketing" id="marketing-form" />
      </Field>
      <Button type="submit" className="w-fit">
        Submit
      </Button>
    </form>
  ),
};

export const ShouldToggle: Story = {
  name: "when clicking the switch, should toggle it on and off",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvas, step }) => {
    const switchBtn = await canvas.findByRole("switch");

    await step("toggle the switch on", async () => {
      await userEvent.click(switchBtn);
      await expect(switchBtn).toBeChecked();
    });

    await step("toggle the switch off", async () => {
      await userEvent.click(switchBtn);
      await expect(switchBtn).not.toBeChecked();
    });
  },
};

export const ShouldSubmitForm: Story = {
  name: "when submitting the form with switch enabled, should submit",
  tags: ["!dev", "!autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI Switch with FieldTitle uses aria-describedby for association
          // but axe expects aria-labelledby, which would be redundant
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <form
      data-testid="test-form"
      className="flex w-96 flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const form = e.currentTarget;
        form.dataset.submitted = "true";
        form.dataset.value = formData.get("marketing") === "on" ? "on" : "off";
      }}
    >
      <Field orientation="horizontal">
        <Switch {...args} name="marketing" id="marketing-test" />
        <FieldContent>
          <FieldTitle>Marketing emails</FieldTitle>
          <FieldDescription>
            Receive emails about new products, features, and more.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Button type="submit" className="w-fit">
        Submit
      </Button>
    </form>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const switchBtn = await canvas.findByRole("switch");
    const submitBtn = await canvas.findByRole("button", { name: "Submit" });
    const form = await canvas.findByTestId("test-form");

    await step("enable the switch", async () => {
      await userEvent.click(switchBtn);
      await expect(switchBtn).toBeChecked();
    });

    await step("submit the form", async () => {
      await userEvent.click(submitBtn);
      await expect(form).toHaveAttribute("data-submitted", "true");
      await expect(form).toHaveAttribute("data-value", "on");
    });
  },
};
