import preview from "@/storybook/preview";
import { expect } from "storybook/test";

import { NativeSelect } from "./native-select";

const meta = preview.meta({
  title: "ui/NativeSelect",
  component: NativeSelect,
});

// --- Stories ---

export const Default = meta.story();

// --- Tests ---

Default.test("should render successfully", async ({ canvas }) => {
  const element = await canvas.findByRole("generic");
  await expect(element).toBeInTheDocument();
});
