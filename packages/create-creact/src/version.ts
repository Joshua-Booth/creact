import { readFileSync } from "node:fs";

// Read at runtime rather than imported, so the built CLI in dist reads the
// same package.json as the source in src, one directory up from either.
const manifest = JSON.parse(
  // oxlint-disable-next-line security/detect-non-literal-fs-filename -- this package's own package.json
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
) as { readonly version: string };

export const VERSION = manifest.version;
