import type { Decorator } from "@storybook/react-vite";

import { SWRConfig } from "swr";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const withSWR: Decorator = (Story) => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      dedupingInterval: 0,
      fetcher,
    }}
  >
    <Story />
  </SWRConfig>
);
