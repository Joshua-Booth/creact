import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { expect, within } from "storybook/test";

import { LogoutPage } from "./logout-page";

const meta = preview.meta({
  title: "pages/Logout",
  component: LogoutPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
  },
});

export const Default = meta.story();

Default.test(
  "should render logout heading and message",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Logout"
    );
    await expect(canvas.getByText("Logging out...")).toBeVisible();
  }
);
