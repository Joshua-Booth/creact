import preview from "@/storybook/preview";
import { expect, userEvent } from "storybook/test";

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";

const meta = preview.meta({
  title: "ui/NativeSelect",
  component: NativeSelect,
});

// --- Stories ---

export const Default = meta.story({
  args: {
    "aria-label": "Select",
    children: (
      <>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
        <NativeSelectOption value="2">Option 2</NativeSelectOption>
        <NativeSelectOption value="3">Option 3</NativeSelectOption>
      </>
    ),
  },
});

export const Groups = meta.story({
  args: {
    "aria-label": "Select department",
    children: (
      <>
        <NativeSelectOption value="">Select department</NativeSelectOption>
        <NativeSelectOptGroup label="Engineering">
          <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
          <NativeSelectOption value="backend">Backend</NativeSelectOption>
          <NativeSelectOption value="devops">DevOps</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Sales">
          <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
          <NativeSelectOption value="account-manager">
            Account Manager
          </NativeSelectOption>
          <NativeSelectOption value="sales-director">
            Sales Director
          </NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Operations">
          <NativeSelectOption value="support">
            Customer Support
          </NativeSelectOption>
          <NativeSelectOption value="product-manager">
            Product Manager
          </NativeSelectOption>
          <NativeSelectOption value="ops-manager">
            Operations Manager
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </>
    ),
  },
});

export const Disabled = meta.story({
  args: {
    "aria-label": "Select priority",
    disabled: true,
    children: (
      <>
        <NativeSelectOption value="">Select priority</NativeSelectOption>
        <NativeSelectOption value="low">Low</NativeSelectOption>
        <NativeSelectOption value="medium">Medium</NativeSelectOption>
        <NativeSelectOption value="high">High</NativeSelectOption>
        <NativeSelectOption value="critical">Critical</NativeSelectOption>
      </>
    ),
  },
});

export const Invalid = meta.story({
  args: {
    "aria-label": "Select role",
    "aria-invalid": true,
    children: (
      <>
        <NativeSelectOption value="">Select role</NativeSelectOption>
        <NativeSelectOption value="admin">Admin</NativeSelectOption>
        <NativeSelectOption value="editor">Editor</NativeSelectOption>
        <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
        <NativeSelectOption value="guest">Guest</NativeSelectOption>
      </>
    ),
  },
});

// --- Tests ---

Default.test(
  "when an option is selected, should update the value",
  async ({ canvas, step }) => {
    const select = await canvas.findByRole("combobox");

    await step("select option 2", async () => {
      await userEvent.selectOptions(select, "2");
      await expect(select).toHaveValue("2");
    });

    await step("select option 3", async () => {
      await userEvent.selectOptions(select, "3");
      await expect(select).toHaveValue("3");
    });
  }
);
