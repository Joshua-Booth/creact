import type { Decorator } from "@storybook/react-vite";

import { SWRConfig } from "swr";

export const withSWR: Decorator = (Story) => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      dedupingInterval: 0,
      fetcher: (url: string) => fetch(url).then((res) => res.json()),
    }}
  >
    <Story />
  </SWRConfig>
);
