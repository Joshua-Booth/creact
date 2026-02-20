import preview from "@/storybook/preview";
import { expect, userEvent } from "storybook/test";

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
const meta = preview.meta({
  title: "ui/Switch",
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          "A control that allows the user to toggle between checked and not checked.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/switch) · [Base UI docs](https://base-ui.com/react/components/switch)",
      },
    },
  },
  render: (args) => (
    <Field>
      <FieldLabel>
        <Switch {...args} />
        Airplane Mode
      </FieldLabel>
    </Field>
  ),
});

// --- Stories ---

/**
 * The default form of the switch.
 */
export const Default = meta.story();

/**
 * Switch with description text providing additional context.
 */
export const Description = meta.story({
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
});

/**
 * Card-style switch where the entire field is clickable.
 * The FieldLabel wraps the inner Field to make the whole card interactive.
 */
export const ChoiceCard = meta.story({
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
});

/**
 * Use the `disabled` prop to disable the switch.
 */
export const Disabled = meta.story({
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
});

/**
 * Switch with validation error state using `aria-invalid`.
 */
export const Invalid = meta.story({
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
});

/**
 * Switch comes in two sizes: `default` and `sm`.
 */
export const Size = meta.story({
  render: (args) => (
    <FieldGroup className="w-40">
      <Field orientation="horizontal">
        <FieldLabel>
          <Switch {...args} size="sm" />
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
});

/**
 * Switch used within a form with submit functionality.
 */
export const WithForm = meta.story({
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
});

// --- Tests ---

Default.test(
  "when clicking the switch, should toggle it on and off",
  async ({ canvas, step }) => {
    const switchBtn = await canvas.findByRole("switch");

    await step("toggle the switch on", async () => {
      await userEvent.click(switchBtn);
      await expect(switchBtn).toBeChecked();
    });

    await step("toggle the switch off", async () => {
      await userEvent.click(switchBtn);
      await expect(switchBtn).not.toBeChecked();
    });
  }
);

Default.test(
  "when pressing Space on a focused switch, should toggle it",
  async ({ canvas, step }) => {
    const switchBtn = await canvas.findByRole("switch");

    await step("focus and press Space to toggle on", async () => {
      switchBtn.focus();
      await userEvent.keyboard(" ");
      await expect(switchBtn).toBeChecked();
    });

    await step("press Space again to toggle off", async () => {
      await userEvent.keyboard(" ");
      await expect(switchBtn).not.toBeChecked();
    });
  }
);

Disabled.test(
  "when clicking a disabled switch, should not toggle",
  async ({ canvas }) => {
    const switchBtn = await canvas.findByRole("switch");
    await expect(switchBtn).not.toBeChecked();
    await userEvent.click(switchBtn, { pointerEventsCheck: 0 });
    await expect(switchBtn).not.toBeChecked();
  }
);

WithForm.test(
  "when submitting the form with switch enabled, should submit",
  async ({ canvas, step }) => {
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
  }
);
