import { fileURLToPath } from "node:url";

/**
 * Shared `@/` import aliases, mirroring the tsconfig `paths`. Declared
 * explicitly instead of `resolve.tsconfigPaths: true` because tsconfig-based
 * resolution misses React Router's `?route-chunk=` virtual modules.
 */
export const aliases = [
  {
    find: "@/storybook",
    replacement: fileURLToPath(new URL("../.storybook", import.meta.url)),
  },
  {
    find: "@",
    replacement: fileURLToPath(new URL("../src", import.meta.url)),
  },
];
