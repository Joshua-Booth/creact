---
paths:
  - "**/*.stories.{ts,tsx}"
---

Every `render` function in a story must accept `args` and spread `{...args}` onto the primary component. Never use `() =>` — always use `(args) =>`. This ensures Storybook's "Show code" panel renders the code example correctly.
