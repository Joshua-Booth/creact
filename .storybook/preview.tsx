import * as addonA11y from "@storybook/addon-a11y/preview";
import * as addonDocs from "@storybook/addon-docs/preview";
import { definePreview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { withRouter } from "storybook-addon-remix-react-router";

import { withDirection } from "./decorators/with-direction";

import "../src/app/styles/globals.css";
import "./storybook-dark.css";

initialize({ onUnhandledRequest: "bypass" });

export default definePreview({
  addons: [addonDocs, addonA11y],
  loaders: [mswLoader],
  globalTypes: {
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "globe",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    direction: "ltr",
  },
  decorators: [withRouter, withDirection],
  parameters: {
    darkMode: {
      darkClass: "dark",
      lightClass: "light",
      classTarget: "html",
      stylePreview: true,
    },
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
    options: {
      storySort: {
        order: ["ui", ["Guides", "*"]],
      },
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
});
