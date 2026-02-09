import type { Decorator } from "@storybook/react-vite";

import { DirectionProvider } from "../../src/shared/ui/direction";

export const withDirection: Decorator = (Story, context) => {
  const dir = context.globals.direction === "rtl" ? "rtl" : "ltr";
  return (
    <DirectionProvider direction={dir}>
      <div dir={dir}>
        <Story />
      </div>
    </DirectionProvider>
  );
};
