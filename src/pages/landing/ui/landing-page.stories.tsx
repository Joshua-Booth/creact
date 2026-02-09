import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { expect, within } from "storybook/test";

import { LandingPage } from "./landing-page";

const meta = preview.meta({
  title: "pages/Landing",
  component: LandingPage,
  tags: ["!autodocs"],
  decorators: [withI18n],
  parameters: {
    layout: "fullscreen",
  },
});

export const Default = meta.story();

Default.test(
  "should render heading and subheading",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "React Frontend"
    );
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent(
      "A project template for creating awesome React web apps."
    );
  }
);
