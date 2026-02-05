import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment -- incomplete types
export default defineConfig([...fsd.configs.recommended]);
