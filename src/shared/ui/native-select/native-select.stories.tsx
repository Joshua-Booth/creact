import preview from "@/storybook/preview";
import { expect, userEvent } from "storybook/test";

import { NativeSelect, NativeSelectOption } from "./native-select";

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
