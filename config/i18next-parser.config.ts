import type { UserConfig } from "i18next-parser";

const config: UserConfig = {
  locales: ["en"],
  output: "public/locales/$LOCALE/$NAMESPACE.json",
  input: ["../src/**/*.{ts,tsx}"],
  defaultNamespace: "common",
  keySeparator: ".",
  namespaceSeparator: ":",
  createOldCatalogs: false,
  failOnWarnings: false,
  verbose: true,
  sort: true,
  lexers: {
    ts: ["JavascriptLexer"],
    tsx: ["JsxLexer"],
  },
};

export default config;
