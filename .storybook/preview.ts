import type { Preview } from "@storybook/react-vite";

import "../src/app/styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },

    docs: {
      toc: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
      config: {
        rules: [
          // Disable aria-hidden-focus check: @base-ui/react uses focus guard
          // elements for focus trapping in dialogs/popovers. These are
          // intentionally focusable with aria-hidden for accessibility.
          { id: "aria-hidden-focus", enabled: false },
          // Disable aria-required-children for cmdk listbox: when filtering
          // returns no results, the listbox has no option/group children,
          // which is invalid per ARIA spec but is cmdk's design.
          { id: "aria-required-children", selector: ":not([cmdk-list])" },
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
